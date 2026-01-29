
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        const client = await pool.connect();
        try {
            // Create Table
            await client.query(`
        CREATE TABLE IF NOT EXISTS gi_income_data (
            id SERIAL PRIMARY KEY,
            date DATE NOT NULL,
            channel VARCHAR(50) NOT NULL,
            amount DECIMAL(15, 2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

            // Create Index
            await client.query(`
        CREATE INDEX IF NOT EXISTS idx_gi_income_date ON gi_income_data(date);
      `);

            // Check if data exists
            const check = await client.query('SELECT count(*) FROM gi_income_data');
            const count = parseInt(check.rows[0].count);

            if (count === 0) {
                // Seed Data
                await client.query(`
            INSERT INTO gi_income_data (date, channel, amount) VALUES
            ('2024-01-05', 'Agency', 50000.00),
            ('2024-01-12', 'Direct', 25000.00),
            ('2024-01-20', 'Broker', 75000.00),
            ('2024-02-05', 'Agency', 55000.00),
            ('2024-02-15', 'Direct', 30000.00),
            ('2024-02-22', 'Broker', 80000.00),
            ('2024-03-01', 'Agency', 62000.00),
            ('2024-03-10', 'Direct', 35000.00),
            ('2024-03-15', 'Broker', 88000.00);
        `);
            }

            // ==========================================
            // Master Map Tables Setup
            // ==========================================

            // 1. Master Order Types
            await client.query(`
                CREATE TABLE IF NOT EXISTS master_order_types (
                    id SERIAL PRIMARY KEY,
                    name_cn VARCHAR(100) NOT NULL,
                    name_en VARCHAR(100) NOT NULL
                );
            `);
            const checkOrderTypes = await client.query('SELECT count(*) FROM master_order_types');
            if (parseInt(checkOrderTypes.rows[0].count) === 0) {
                await client.query(`
                    INSERT INTO master_order_types (name_cn, name_en) VALUES
                    ('维修', 'Repair'),
                    ('索赔', 'Claims');
                `);
            }

            // 2. Master Work Order Statuses
            await client.query(`
                CREATE TABLE IF NOT EXISTS master_work_order_statuses (
                    id SERIAL PRIMARY KEY,
                    name_cn VARCHAR(100) NOT NULL,
                    name_en VARCHAR(100) NOT NULL
                );
            `);
            const checkStatuses = await client.query('SELECT count(*) FROM master_work_order_statuses');
            if (parseInt(checkStatuses.rows[0].count) === 0) {
                await client.query(`
                    INSERT INTO master_work_order_statuses (name_cn, name_en) VALUES
                    ('交车', 'Delivery'),
                    ('新建', 'New'),
                    ('已结算', 'Settled'),
                    ('派工', 'Dispatch'),
                    ('已提交结算', 'Settlement submitted');
                `);
            }

            // 3. Master Repair Types
            await client.query(`
                CREATE TABLE IF NOT EXISTS master_repair_types (
                    id SERIAL PRIMARY KEY,
                    name_cn VARCHAR(100) NOT NULL,
                    name_en VARCHAR(100) NOT NULL
                );
            `);
            const checkRepairTypes = await client.query('SELECT count(*) FROM master_repair_types');
            if (parseInt(checkRepairTypes.rows[0].count) === 0) {
                await client.query(`
                    INSERT INTO master_repair_types (name_cn, name_en) VALUES
                    ('首次保养', 'First maintenance'),
                    ('钣金喷漆', 'Sheet metal painting'),
                    ('软件升级', 'Software upgrade'),
                    ('服务活动', 'Service Activities'),
                    ('服务月活动', 'Service Month Activities'),
                    ('售前维修', 'Pre-sales repair'),
                    ('内部维修', 'Internal repair'),
                    ('一般维修', 'General maintenance'),
                    ('PDI', 'PDI');
                `);
            }

            // 4. Master Branches
            await client.query(`
                CREATE TABLE IF NOT EXISTS master_branches (
                    id SERIAL PRIMARY KEY,
                    code VARCHAR(10) NOT NULL,
                    name VARCHAR(255) NOT NULL
                );
            `);
            const checkBranches = await client.query('SELECT count(*) FROM master_branches');
            if (parseInt(checkBranches.rows[0].count) === 0) {
                await client.query(`
                    INSERT INTO master_branches (code, name) VALUES
                    ('gi', 'บริษัท โกลด์ อินทิเกรท จำกัด'),
                    ('gi01', 'บริษัท โกลด์ อินทิเกรท กาญจนาภิเษก – บางแค จำกัด'),
                    ('gi02', 'บริษัท โกลด์ อินทิเกรท มีนบุรี จำกัด'),
                    ('gi03', 'บริษัท โกลด์ อินทิเกรท เลียบด่วนรามอินทรา จำกัด'),
                    ('gi04', 'บริษัท โกลด์ อินทิเกรท สีลม ซอย 9 จำกัด'),
                    ('gi05', 'บริษัท โกลด์ อินทิเกรท อุบลราชธานี จำกัด'),
                    ('gi07', 'บริษัท โกลด์ อินทิเกรท มหาชัย จำกัด'),
                    ('gi08', 'บริษัท โกลด์ อินทิเกรท ศาลายา จำกัด'),
                    ('gi09', 'บริษัท โกลด์ อินทิเกรท วิภาวดี จำกัด'),
                    ('gi10', 'บริษัท โกลด์ อินทิเกรท พิบูลสงคราม จำกัด'),
                    ('gi11', 'บริษัท โกลด์ อินทิเกรท อยุธยา จำกัด');
                `);
            }

            return NextResponse.json({ message: 'Database setup complete: All tables created and seeded.' });

        } finally {
            client.release();
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed to setup database', details: error }, { status: 500 });
    }
}
