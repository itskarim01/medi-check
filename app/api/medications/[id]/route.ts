import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const result = await pool.query(
      `SELECT
         m.*,
         COALESCE(
           json_agg(
             json_build_object('id', rt.id, 'reminder_time', rt.reminder_time)
             ORDER BY rt.reminder_time
           ) FILTER (WHERE rt.id IS NOT NULL), '[]'
         ) AS reminder_times
       FROM medications m
       LEFT JOIN reminder_times rt ON rt.medication_id = m.id
       WHERE m.id = $1 AND m.user_id = $2
       GROUP BY m.id`,
      [id, session.userId]
    );

    if (result.rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error("Fetch medication error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { title, dosage, form, start_date, end_date, is_active } = await req.json();

  try {
    const result = await pool.query(
      `UPDATE medications
       SET title = COALESCE($1, title),
           dosage = COALESCE($2, dosage),
           form = COALESCE($3, form),
           start_date = COALESCE($4, start_date),
           end_date = COALESCE($5, end_date),
           is_active = COALESCE($6, is_active)
       WHERE id = $7 AND user_id = $8
       RETURNING *`,
      [title ?? null, dosage ?? null, form ?? null, start_date ?? null, end_date ?? null, is_active ?? null, id, session.userId]
    );

    if (result.rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error("Update medication error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const result = await pool.query(
      `DELETE FROM medications WHERE id = $1 AND user_id = $2 RETURNING id`,
      [id, session.userId]
    );
    if (result.rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete medication error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}