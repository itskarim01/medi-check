import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);
const COOKIE_NAME = 'HS256';

export async function hashPassword(password: string) {
    return await bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
}

export async function createSession(userId: number) {
    const token = await new SignJWT({ userId })
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .setExpirationTime('1h')
        .sign(secret);

    (await cookies()).set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "lax",
        path: '/',
        maxAge: 60 * 60,
    });
}

export async function getSession(): Promise<{userId: number} | null > {
    const token = (await cookies()).get(COOKIE_NAME)?.value;
    if (!token) return null;
    try {
        const { payload } = await jwtVerify(token, secret);
        return { userId: payload.userId as number  };
    } catch (error) {
        return null;
    }
}

export async function clearSession() {
    (await cookies()).delete(COOKIE_NAME);
}