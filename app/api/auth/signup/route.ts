import { NextRequest, NextResponse} from "next/server";
import { pool } from "@/lib/db";
import { hashPassword, createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const {first_name, last_name, email, gender, phone_number, pass_hash} = await req.json();
        
        if (!first_name || !last_name || !email || !gender || !phone_number || !pass_hash) return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    
        const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return NextResponse.json({ message: "User already exists" }, { status: 401 })
        };

        const hashedPassword = await hashPassword(pass_hash);

        const result = await pool.query(
            'INSERT INTO users (first_name, last_name, email, gender, phone_number, pass_hash) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, first_name, last_name, email, gender, phone_number, pass_hash',
            [first_name, last_name, email, gender, phone_number, hashedPassword]
        );
        
        const user = result.rows[0];
        await createSession(user.id);
        return NextResponse.json({ message: "User created successfully", user }, { status: 201 });
        
    } catch (err) {
        console.error("Error creating user:", err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }

}