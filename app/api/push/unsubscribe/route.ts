import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { endpoint } = await req.json();
  await pool.query("DELETE FROM push_subscriptions WHERE endpoint = $1 AND user_id = $2", [endpoint, session.userId]);

  return NextResponse.json({ success: true });
}