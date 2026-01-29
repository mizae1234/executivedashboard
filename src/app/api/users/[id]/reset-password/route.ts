import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession, hashPassword, getDefaultPassword } from '@/lib/auth';

// POST reset password to default (email prefix)
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session || session.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { id } = await params;

        // Get user email
        const userResult = await pool.query('SELECT email FROM users WHERE id = $1', [id]);

        if (userResult.rows.length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const email = userResult.rows[0].email;
        const defaultPassword = getDefaultPassword(email);
        const passwordHash = await hashPassword(defaultPassword);

        await pool.query(
            'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            [passwordHash, id]
        );

        return NextResponse.json({
            success: true,
            message: `Password reset to: ${defaultPassword}`
        });
    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
