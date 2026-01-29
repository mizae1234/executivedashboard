"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableFooter
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Income365Data {
    branch_name: string;
    invoice_count: number;
    total_revenue: number;
    percent_total: number;
    avg_revenue: number;
}

interface Income365TableProps {
    data: Income365Data[];
    summary: {
        total_revenue: number;
        total_count: number;
        avg_revenue_overall: number;
    }
}

export function Income365Table({ data, summary }: Income365TableProps) {
    return (
        <Card className="col-span-1 shadow-sm border-t-4 border-t-blue-500">
            <CardHeader className="bg-slate-50 border-b pb-3">
                <CardTitle className="text-blue-700">Income 365 Report (Detailed)</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="rounded-md border-0 h-full">
                    <Table>
                        <TableHeader className="bg-slate-100">
                            <TableRow>
                                <TableHead className="font-bold text-slate-700">Branches</TableHead>
                                <TableHead className="text-right font-bold text-slate-700 border-l">% of Total Revenue</TableHead>
                                <TableHead className="text-right font-bold text-slate-700 border-l">Avg Revenue / Invoice</TableHead>
                                <TableHead className="text-right font-bold text-slate-700 border-l">Total Invoice Count</TableHead>
                                <TableHead className="text-right font-bold text-slate-700 bg-slate-200 border-l">Total Revenue</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data && data.length > 0 ? (
                                data.map((item, index) => (
                                    <TableRow key={index} className="hover:bg-blue-50/50">
                                        <TableCell className="font-medium">{item.branch_name}</TableCell>
                                        <TableCell className="text-right border-l">
                                            {Number(item.percent_total).toFixed(2)}%
                                        </TableCell>
                                        <TableCell className="text-right border-l">
                                            {Number(item.avg_revenue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </TableCell>
                                        <TableCell className="text-right border-l">
                                            {Number(item.invoice_count).toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-right border-l font-medium bg-slate-50">
                                            {Number(item.total_revenue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No data available.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter className="bg-slate-200 border-t-2 border-slate-300">
                            <TableRow>
                                <TableCell className="font-bold text-slate-900">Grand Total</TableCell>
                                <TableCell className="text-right font-bold text-slate-900 border-l">100.00%</TableCell>
                                <TableCell className="text-right font-bold text-slate-900 border-l">
                                    {Number(summary?.avg_revenue_overall || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </TableCell>
                                <TableCell className="text-right font-bold text-slate-900 border-l">
                                    {Number(summary?.total_count || 0).toLocaleString()}
                                </TableCell>
                                <TableCell className="text-right font-bold text-slate-900 border-l">
                                    {Number(summary?.total_revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
