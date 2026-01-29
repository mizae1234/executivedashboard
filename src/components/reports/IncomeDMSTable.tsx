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

interface IncomeDMSData {
    branch_name: string;
    ordertype_name: string;
    job_count: number;
    total_revenue: number;
}

interface IncomeDMSTableProps {
    data: IncomeDMSData[];
}

export function IncomeDMSTable({ data }: IncomeDMSTableProps) {
    // Calculate totals for footer
    const totalCount = data.reduce((sum, item) => sum + Number(item.job_count), 0);
    const totalRevenue = data.reduce((sum, item) => sum + Number(item.total_revenue), 0);

    return (
        <Card className="col-span-1 shadow-sm border-t-4 border-t-green-600">
            <CardHeader className="bg-green-50 border-b pb-3">
                <CardTitle className="text-green-800">Income DMS Report (Job Count Focus)</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="rounded-md border-0 h-full">
                    <Table>
                        <TableHeader className="bg-green-700">
                            <TableRow>
                                <TableHead className="font-bold text-white">Branches</TableHead>
                                <TableHead className="font-bold text-white border-l border-green-600">Order Type</TableHead>
                                <TableHead className="text-right font-bold text-white border-l border-green-600 bg-green-800">Job Count</TableHead>
                                <TableHead className="text-right font-bold text-white border-l border-green-600 bg-green-800">Total Revenue</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data && data.length > 0 ? (
                                data.map((item, index) => (
                                    <TableRow key={index} className="hover:bg-green-50/50 odd:bg-white even:bg-green-50/20">
                                        <TableCell className="font-medium text-green-900">{item.branch_name}</TableCell>
                                        <TableCell className="border-l">{item.ordertype_name}</TableCell>
                                        <TableCell className="text-right border-l font-medium">
                                            {Number(item.job_count).toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-right border-l text-green-700">
                                            {Number(item.total_revenue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        No data available.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter className="bg-green-800 text-white">
                            <TableRow>
                                <TableCell colSpan={2} className="font-bold">Grand Total</TableCell>
                                <TableCell className="text-right font-bold border-l border-green-600">
                                    {Number(totalCount).toLocaleString()}
                                </TableCell>
                                <TableCell className="text-right font-bold border-l border-green-600">
                                    {Number(totalRevenue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
