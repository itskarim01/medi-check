import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const result = await pool.query(
      `SELECT
         m.id, m.title, m.dosage, m.form, m.start_date, m.end_date, m.is_active,
         COALESCE(
           json_agg(
             json_build_object('id', rt.id, 'reminder_time', rt.reminder_time)
             ORDER BY rt.reminder_time
           ) FILTER (WHERE rt.id IS NOT NULL), '[]'
         ) AS reminder_times
       FROM medications m
       LEFT JOIN reminder_times rt ON rt.medication_id = m.id
       WHERE m.user_id = $1
       GROUP BY m.id
       ORDER BY m.created_at DESC`,
      [session.userId]
    );
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("Fetch medications error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, dosage, form, start_date, end_date, reminder_times } = await req.json();

  if (!title || !dosage) {
    return NextResponse.json({ error: "Title and dosage are required" }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const medResult = await client.query(
      `INSERT INTO medications (user_id, title, dosage, form, start_date, end_date)
       VALUES ($1, $2, $3, $4, COALESCE($5, CURRENT_DATE), $6)
       RETURNING *`,
      [session.userId, title, dosage, form ?? null, start_date ?? null, end_date ?? null]
    );
    const medication = medResult.rows[0];

    const times: string[] = Array.isArray(reminder_times) ? reminder_times : [];
    for (const time of times) {
      await client.query(
        `INSERT INTO reminder_times (medication_id, reminder_time) VALUES ($1, $2)`,
        [medication.id, time]
      );
    }

    await client.query("COMMIT");
    return NextResponse.json({ ...medication, reminder_times: times }, { status: 201 });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Create medication error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    client.release();
  }
}