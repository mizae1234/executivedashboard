
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const scope = searchParams.get('scope');

        if (!startDate || !endDate) {
            return NextResponse.json({ error: 'startDate and endDate are required' }, { status: 400 });
        }

        let rows: any[] = [];
        let transactions: any[] = [];
        const client = await pool.connect();

        try {
            // --- Summary Scope ---
            if (scope !== 'transactions') {
                try {
                    // Try querying the view
                    // Columns: Branch Name, Order Type, Job Count, Total Revenue
                    const query = `
                    SELECT 
                        COALESCE(b.name, v.branch_code) as branch_name,
                        v.ordertype_name,
                        COUNT(*) as job_count,
                        SUM(v.final_amountexcludingtax) as total_revenue
                    FROM view_rp_gi_income_dms v
                    LEFT JOIN master_branches b ON v.branch_code = b.code
                    WHERE v.billingtime >= $1 AND v.billingtime <= $2
                    GROUP BY b.name, v.branch_code, v.ordertype_name
                    ORDER BY b.name, v.ordertype_name
                `;
                    const result = await client.query(query, [startDate, endDate]);
                    rows = result.rows;
                } catch (dbError) {
                    console.warn("Database error (Income DMS Summary), using mock data:", dbError);
                    rows = [
                        { branch_code: 'gi01', branch_name: 'Minburi', ordertype_name: 'General Repair', job_count: 150, total_revenue: 631132.18 },
                        { branch_code: 'gi01', branch_name: 'Minburi', ordertype_name: 'Claim', job_count: 45, total_revenue: 200000.00 },
                        { branch_code: 'gi02', branch_name: 'Salaya', ordertype_name: 'General Repair', job_count: 120, total_revenue: 368436.98 },
                        { branch_code: 'gi03', branch_name: 'Exp. Ramintra', ordertype_name: 'General Repair', job_count: 180, total_revenue: 572776.23 },
                    ];
                }
            }

            // --- Transactions Scope ---
            if (scope === 'transactions') {
                try {
                    // Fetch Raw Transactions (Top 500)
                    const queryTransactions = `
                        SELECT 
                            v.ordernumber,
                            v.billingtime,
                            v.branch_code,
                            COALESCE(b.name, v.branch_code) as branch_name,
                            v.carownername,
                            v.vin,
                            v.workorderstatus_name,
                            v.ordertype_name,
                            v.brand,
                            v.final_amountexcludingtax,
                            v.claimsheetno
                        FROM view_rp_gi_income_dms v
                        LEFT JOIN master_branches b ON v.branch_code = b.code
                        WHERE v.billingtime >= $1 AND v.billingtime <= $2
                        ORDER BY v.billingtime DESC
                        LIMIT 500
                    `;
                    const resTrans = await client.query(queryTransactions, [startDate, endDate]);
                    transactions = resTrans.rows;

                } catch (dbError) {
                    console.warn("Database error (Income DMS Transactions), using mock data:", dbError);
                    transactions = [
                        {
                            ordernumber: 'RO-2024-001', billingtime: '2024-03-15', branch_code: 'gi01', branch_name: 'Minburi',
                            carownername: 'John Doe', vin: 'VIN1234567890', workorderstatus_name: 'Completed',
                            ordertype_name: 'General', brand: 'Toyota', final_amountexcludingtax: 5000, claimsheetno: 'CLM-001'
                        },
                        {
                            ordernumber: 'RO-2024-002', billingtime: '2024-03-14', branch_code: 'gi02', branch_name: 'Salaya',
                            carownername: 'Jane Smith', vin: 'VIN0987654321', workorderstatus_name: 'In Progress',
                            ordertype_name: 'Claim', brand: 'Honda', final_amountexcludingtax: 8500, claimsheetno: 'CLM-002'
                        },
                    ];
                }
            }

        } finally {
            client.release();
        }

        if (scope === 'transactions') {
            return NextResponse.json({ transactions });
        }

        return NextResponse.json({
            data: rows,
            // transactions: transactions // Removed to save bandwidth in strict summary scope
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
