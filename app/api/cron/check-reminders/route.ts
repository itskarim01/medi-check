import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { pool } from "@/lib/db";

webpush.setVapidDetails(
  "mailto:you@example.com",
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

interface DueReminder {
  reminder_time_id: string;
  user_id: string;
  title: string;
  dosage: string;
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dueResult = await pool.query<DueReminder>(
    `SELECT rt.id AS reminder_time_id, m.user_id, m.title, m.dosage
     FROM reminder_times rt
     JOIN medications m ON m.id = rt.medication_id
     LEFT JOIN reminder_logs rl ON rl.reminder_time_id = rt.id AND rl.log_date = CURRENT_DATE
     LEFT JOIN push_notification_logs pnl ON pnl.reminder_time_id = rt.id AND pnl.log_date = CURRENT_DATE
     WHERE m.is_active = TRUE
       AND m.start_date <= CURRENT_DATE
       AND (m.end_date IS NULL OR m.end_date >= CURRENT_DATE)
       AND rt.reminder_time <= CURRENT_TIME
       AND rl.id IS NULL
       AND pnl.id IS NULL`
  );

  let sent = 0;

  for (const reminder of dueResult.rows) {
    const subsResult = await pool.query(
      "SELECT id, endpoint, p256dh, auth FROM push_subscriptions WHERE user_id = $1",
      [reminder.user_id]
    );

    const payload = JSON.stringify({
      title: `Time for ${reminder.title}`,
      body: `${reminder.dosage} — mark it taken in MedTracker`,
      tag: reminder.reminder_time_id,
      url: "/dashboard",
    });

    for (const sub of subsResult.rows) {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload
        );
        sent++;
      } catch (err: any) {
        if (err.statusCode === 404 || err.statusCode === 410) {
          await pool.query("DELETE FROM push_subscriptions WHERE id = $1", [sub.id]);
        } else {
          console.error("Push send error:", err);
        }
      }
    }

    await pool.query(
      `INSERT INTO push_notification_logs (reminder_time_id, log_date)
       VALUES ($1, CURRENT_DATE)
       ON CONFLICT (reminder_time_id, log_date) DO NOTHING`,
      [reminder.reminder_time_id]
    );
  }

  return NextResponse.json({ checked: dueResult.rows.length, sent });
}