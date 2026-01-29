import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession, hashPassword, getDefaultPassword, isAdmin } from '@/lib/auth';

// GET all users (admin only)
export async function GET() {
    try {
        const session = await getSession();
        if (!session || session.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const result = await pool.query(
            'SELECT id, email, name, role, is_active, created_at FROM users ORDER BY created_at DESC'
        );

        return NextResponse.json({ users: result.rows });
    } catch (error) {
        console.error('Get users error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST create new user (admin only)
export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session || session.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { email, name, role = 'user' } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Check if email already exists
        const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
        if (existing.rows.length > 0) {
            return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
        }

        // Default password is email prefix
        const defaultPassword = getDefaultPassword(email);
        const passwordHash = await hashPassword(defaultPassword);

        const result = await pool.query(
            `INSERT INTO users (email, password_hash, name, role, is_active) 
       VALUES ($1, $2, $3, $4, true) 
       RETURNING id, email, name, role, is_active, created_at`,
            [email.toLowerCase(), passwordHash, name || null, role]
        );

        return NextResponse.json({ user: result.rows[0] }, { status: 201 });
    } catch (error) {
        console.error('Create user error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
