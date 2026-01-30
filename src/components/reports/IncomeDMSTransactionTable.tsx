import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, ChevronLeft, ChevronRight } from "lucide-react"
import { format } from "date-fns"
import * as XLSX from 'xlsx';

interface TransactionDMS {
    ordernumber: string;
    billingtime: string | Date;
    branch_code: string;
    branch_name: string;
    carownername: string;
    vin: string;
    workorderstatus_name: string;
    ordertype_name: string;
    brand: string;
    final_amountexcludingtax: number;
    claimsheetno: string;
}

interface IncomeDMSTransactionTableProps {
    data: TransactionDMS[];
}

export function IncomeDMSTransactionTable({ data }: IncomeDMSTransactionTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil((data?.length || 0) / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = data?.slice(startIndex, endIndex);

    const handleExport = () => {
        // ... (Export logic omitted for brevity, it's already there)
        if (!data || data.length === 0) return;

        // Prepare data for Excel
        const exportData = data.map(item => ({
            "Order Number": item.ordernumber,
            "Billing Date": item.billingtime ? format(new Date(item.billingtime), "yyyy-MM-dd") : '',
            "Branch": item.branch_name,
            "Customer": item.carownername,
            "Vin No": item.vin,
            "Status": item.workorderstatus_name,
            "Type": item.ordertype_name,
            "Brand": item.brand,
            "Total (Excl)": item.final_amountexcludingtax,
            "ClaimNo": item.claimsheetno || ''
        }));

        // Create WorkSheet
        const ws = XLSX.utils.json_to_sheet(exportData);

        // Auto-width columns (simple estimation)
        const colWidths = Object.keys(exportData[0] || {}).map(key => ({
            wch: Math.max(key.length, 15) // Min width 15
        }));
        ws['!cols'] = colWidths;

        // Create WorkBook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Income DMS Transactions");

        // Save File
        XLSX.writeFile(wb, `income_dms_export_${format(new Date(), "yyyyMMdd_HHmmss")}.xlsx`);
    };

    return (
        <Card className="col-span-1 md:col-span-4 mt-6">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Detailed Income DMS Transactions</CardTitle>
                <Button variant="outline" size="sm" onClick={handleExport} disabled={!data || data.length === 0}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Excel (.xlsx)
                </Button>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="whitespace-nowrap">Order No</TableHead>
                                <TableHead className="whitespace-nowrap">Billing Date</TableHead>
                                <TableHead className="whitespace-nowrap">Branch</TableHead>
                                <TableHead className="whitespace-nowrap">Customer</TableHead>
                                <TableHead className="whitespace-nowrap">Vin No</TableHead>
                                <TableHead className="whitespace-nowrap">Status</TableHead>
                                <TableHead className="whitespace-nowrap">Type</TableHead>
                                <TableHead className="whitespace-nowrap">Brand</TableHead>
                                <TableHead className="whitespace-nowrap text-right">Total (Excl)</TableHead>
                                <TableHead className="whitespace-nowrap">ClaimNo</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentData && currentData.length > 0 ? (
                                currentData.map((item, index) => (
                                    <TableRow key={index} className="hover:bg-slate-50">
                                        <TableCell className="whitespace-nowrap font-medium">{item.ordernumber}</TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            {item.billingtime ? format(new Date(item.billingtime), "dd/MM/yyyy") : '-'}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap max-w-[150px] truncate" title={item.branch_name}>
                                            {item.branch_name}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap max-w-[150px] truncate" title={item.carownername}>
                                            {item.carownername}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">{item.vin}</TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ring-gray-500/10 bg-gray-50 text-gray-600">
                                                {item.workorderstatus_name}
                                            </span>
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{item.ordertype_name}</TableCell>
                                        <TableCell className="whitespace-nowrap">{item.brand}</TableCell>
                                        <TableCell className="text-right font-medium">
                                            {Number(item.final_amountexcludingtax).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">{item.claimsheetno || '-'}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={10} className="h-24 text-center">
                                        No transactions found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-end space-x-2 py-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>
                        <div className="text-sm font-medium">
                            Page {currentPage} of {totalPages}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
