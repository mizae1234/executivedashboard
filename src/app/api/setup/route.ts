import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { hashPassword } from '@/lib/auth';

// POST: Initialize users table and create default admin
export async function POST() {
    try {
        // Create users table if not exists
        await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'user',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Create index
        await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
    `);

        // Check if admin exists
        const existingAdmin = await pool.query(
            "SELECT id FROM users WHERE email = 'admin@icare-insurance.com'"
        );

        if (existingAdmin.rows.length === 0) {
            // Create default admin user with password 'admin'
            const adminPasswordHash = await hashPassword('admin');
            await pool.query(
                `INSERT INTO users (email, password_hash, name, role) 
         VALUES ($1, $2, $3, $4)`,
                ['admin@icare-insurance.com', adminPasswordHash, 'System Admin', 'admin']
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Database setup completed. Admin user: admin@icare-insurance.com / password: admin'
        });
    } catch (error) {
        console.error('Setup error:', error);
        return NextResponse.json(
            { error: 'Setup failed', details: String(error) },
            { status: 500 }
        );
    }
}

// GET: Check if setup is complete
export async function GET() {
    try {
        const result = await pool.query(
            "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_name = 'users'"
        );
        const tableExists = parseInt(result.rows[0].count) > 0;

        if (tableExists) {
            const userCount = await pool.query('SELECT COUNT(*) as count FROM users');
            return NextResponse.json({
                setup: true,
                userCount: parseInt(userCount.rows[0].count)
            });
        }

        return NextResponse.json({ setup: false });
    } catch (error) {
        return NextResponse.json({ setup: false, error: String(error) });
    }
}
