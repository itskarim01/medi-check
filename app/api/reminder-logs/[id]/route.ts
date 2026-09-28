import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { status } = await req.json();

  if (!["taken", "skipped"].includes(status)) {
    return NextResponse.json({ error: "Status must be 'taken' or 'skipped'" }, { status: 400 });
  }

  const ownerCheck = await pool.query(
    `SELECT rt.id
     FROM reminder_times rt
     JOIN medications m ON m.id = rt.medication_id
     WHERE rt.id = $1 AND m.user_id = $2`,
    [id, session.userId]
  );
  if (ownerCheck.rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const result = await pool.query(
    `INSERT INTO reminder_logs (reminder_time_id, log_date, status)
     VALUES ($1, CURRENT_DATE, $2)
     ON CONFLICT (reminder_time_id, log_date)
     DO UPDATE SET status = EXCLUDED.status, logged_at = CURRENT_TIMESTAMP
     RETURNING id, status, logged_at`,
    [id, status]
  );

  return NextResponse.json(result.rows[0]);
}