"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"

interface IncomeData {
    id: number | string;
    date: string | Date;
    channel: string;
    amount: number;
}

interface IncomeTableProps {
    data: IncomeData[];
}

export function IncomeTable({ data }: IncomeTableProps) {
    return (
        <Card className="col-span-1 md:col-span-4">
            <CardHeader>
                <CardTitle>Detailed Income Data</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Channel</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data && data.length > 0 ? (
                                data.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            {typeof item.date === 'string'
                                                ? format(new Date(item.date), "dd MMM yyyy")
                                                : format(item.date, "dd MMM yyyy")
                                            }
                                        </TableCell>
                                        <TableCell>{item.channel}</TableCell>
                                        <TableCell className="text-right">
                                            ฿{Number(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
