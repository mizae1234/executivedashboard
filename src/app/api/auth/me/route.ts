import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        // Get fresh user data from database
        const result = await pool.query(
            'SELECT id, email, name, role, is_active FROM users WHERE id = $1',
            [session.userId]
        );

        const user = result.rows[0];

        if (!user || !user.is_active) {
            return NextResponse.json(
                { error: 'User not found or disabled' },
                { status: 401 }
            );
        }

        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Get user error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
