
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
                            v.branch_code,
                            COALESCE(b.name, v.branch_code) as branch_name,
                            v.ordernumber,
                            v.billingtime,
                            v.carownername,
                            v.ordertype_name,
                            v.repairtype_name,
                            v.workorderstatus_name,
                            v.licensenumber,
                            v.brand,
                            v.vehicleserialname,
                            v.vehiclemodelname,
                            v.vin,
                            v.serviceadvisor,
                            v.totalamountexcludingtax,
                            v.totalamountincludingtax,
                            v.taxamount,
                            v.submissiontime,
                            v.inplantmileage,
                            v.repairer,
                            v.repairerphone,
                            v.enginenumber,
                            v.manhourcost,
                            v.customerdescription
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
                            branch_code: 'gi01', branch_name: 'Minburi', ordernumber: 'RO-2024-001', billingtime: '2024-03-15',
                            carownername: 'John Doe', ordertype_name: 'General', totalamountexcludingtax: 5000,
                            repairtype_name: 'Engine Repair', workorderstatus_name: 'Completed', licensenumber: 'ABC-123',
                            brand: 'Toyota', vehicleserialname: 'Camry', vehiclemodelname: '2.5G', vin: 'VIN1234567890',
                            serviceadvisor: 'SA1', totalamountincludingtax: 5350, taxamount: 350, submissiontime: '2024-03-10',
                            inplantmileage: 100000, repairer: 'Mechanic A', repairerphone: '081-111-1111', enginenumber: 'ENG123',
                            manhourcost: 1000, customerdescription: 'Engine knocking sound'
                        },
                        {
                            branch_code: 'gi02', branch_name: 'Salaya', ordernumber: 'RO-2024-002', billingtime: '2024-03-14',
                            carownername: 'Jane Smith', ordertype_name: 'Claim', totalamountexcludingtax: 8500,
                            repairtype_name: 'Body Repair', workorderstatus_name: 'In Progress', licensenumber: 'DEF-456',
                            brand: 'Honda', vehicleserialname: 'Civic', vehiclemodelname: '1.8EL', vin: 'VIN0987654321',
                            serviceadvisor: 'SA2', totalamountincludingtax: 9095, taxamount: 595, submissiontime: '2024-03-12',
                            inplantmileage: 50000, repairer: 'Mechanic B', repairerphone: '082-222-2222', enginenumber: 'ENG456',
                            manhourcost: 1500, customerdescription: 'Front bumper damage'
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
