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

interface OverviewData {
    name: string; // Branch Name
    rev365: number;
    revDMS: number;
    total: number;
}

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OverviewTableProps {
    data: OverviewData[];
    onViewDetail: (tab: string) => void;
}

export function OverviewTable({ data, onViewDetail }: OverviewTableProps) {
    const total365 = data.reduce((acc, item) => acc + Number(item.rev365), 0);
    const totalDMS = data.reduce((acc, item) => acc + Number(item.revDMS), 0);
    const grandTotal = data.reduce((acc, item) => acc + Number(item.total), 0);

    return (
        <Card className="col-span-1 md:col-span-4 border-t-4 border-t-purple-500">
            <CardHeader>
                <CardTitle className="text-purple-700">Consolidated Branch Revenue (365 + DMS)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader className="bg-purple-50">
                            <TableRow>
                                <TableHead className="font-bold text-slate-700">Branch Name</TableHead>
                                <TableHead className="text-right font-bold text-blue-600">
                                    <div className="flex flex-col items-end gap-1">
                                        <span>Income 365</span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-6 text-xs text-blue-600 border-blue-200 hover:bg-blue-50"
                                            onClick={() => onViewDetail('income-365')}
                                        >
                                            View Detail <ArrowRight className="ml-1 h-3 w-3" />
                                        </Button>
                                    </div>
                                </TableHead>
                                <TableHead className="text-right font-bold text-green-600">
                                    <div className="flex flex-col items-end gap-1">
                                        <span>Income DMS</span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-6 text-xs text-green-600 border-green-200 hover:bg-green-50"
                                            onClick={() => onViewDetail('income-dms')}
                                        >
                                            View Detail <ArrowRight className="ml-1 h-3 w-3" />
                                        </Button>
                                    </div>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data && data.length > 0 ? (
                                data.map((item, index) => (
                                    <TableRow key={index} className="hover:bg-slate-50">
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell className="text-right text-blue-600">
                                            ฿{Number(item.rev365).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </TableCell>
                                        <TableCell className="text-right text-green-600">
                                            ฿{Number(item.revDMS).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center">
                                        No data available.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter className="bg-purple-100">
                            <TableRow>
                                <TableCell className="font-bold">Grand Total</TableCell>
                                <TableCell className="text-right font-bold text-blue-800">
                                    ฿{Number(total365).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </TableCell>
                                <TableCell className="text-right font-bold text-green-800">
                                    ฿{Number(totalDMS).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
