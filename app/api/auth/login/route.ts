import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { verifyPassword, createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 401 });
    }

    const result = await pool.query(
      `SELECT id, first_name, last_name, email, gender, phone_number, pass_hash
       FROM users WHERE email = $1`,
      [email]
    );
    const user = result.rows[0];

    if (!user || !(await verifyPassword(password, user.pass_hash))) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 402 });
    }

    await createSession(user.id);

    const { pass_hash, ...safeUser } = user;
    return NextResponse.json({ user: safeUser });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}