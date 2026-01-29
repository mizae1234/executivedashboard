import { compare, hash } from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

const COOKIE_NAME = 'auth-token';

export interface User {
    id: number;
    email: string;
    name: string | null;
    role: string;
    is_active: boolean;
}

export interface SessionPayload {
    userId: number;
    email: string;
    role: string;
    expiresAt: Date;
}

// Hash password using bcrypt
export async function hashPassword(password: string): Promise<string> {
    return hash(password, 12);
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
}

// Get default password from email (prefix before @)
export function getDefaultPassword(email: string): string {
    return email.split('@')[0];
}

// Create JWT token
export async function createToken(payload: Omit<SessionPayload, 'expiresAt'>): Promise<string> {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    return new SignJWT({ ...payload, expiresAt: expiresAt.toISOString() })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(SECRET_KEY);
}

// Verify JWT token
export async function verifyToken(token: string): Promise<SessionPayload | null> {
    try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        return payload as unknown as SessionPayload;
    } catch {
        return null;
    }
}

// Create session (set cookie)
export async function createSession(user: User): Promise<void> {
    const token = await createToken({
        userId: user.id,
        email: user.email,
        role: user.role,
    });

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7 days
    });
}

// Get current session
export async function getSession(): Promise<SessionPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) return null;

    return verifyToken(token);
}

// Destroy session (logout)
export async function destroySession(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
    const session = await getSession();
    return session !== null;
}

// Check if user is admin
export async function isAdmin(): Promise<boolean> {
    const session = await getSession();
    return session?.role === 'admin';
}
