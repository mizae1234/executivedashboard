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

interface Transaction365 {
    dataareaid: string;
    invoiceid: string;
    invoiceaccount: string;
    salesid: string;
    invoicedate: string | Date;
    ledgervoucher: string;
    currencycode: string;
    invoiceamount: number;
    branch_code: string;
    customerreference: string;
    branch_name: string;
}

interface Income365TransactionTableProps {
    data: Transaction365[];
}

export function Income365TransactionTable({ data }: Income365TransactionTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil((data?.length || 0) / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = data?.slice(startIndex, endIndex);

    const handleExport = () => {
        if (!data || data.length === 0) return;

        // Prepare data for Excel
        const exportData = data.map(item => ({
            "Invoice Date": item.invoicedate ? format(new Date(item.invoicedate), "yyyy-MM-dd") : '',
            "Branch Name": item.branch_name,
            "Invoice ID": item.invoiceid,
            "Sales ID": item.salesid,
            "Account": item.invoiceaccount,
            "Customer Ref": item.customerreference,
            "Voucher": item.ledgervoucher,
            "Area ID": item.dataareaid,
            "Amount": item.invoiceamount,
            "Currency": item.currencycode
        }));

        // Create WorkSheet
        const ws = XLSX.utils.json_to_sheet(exportData);

        // Auto-width columns
        const colWidths = Object.keys(exportData[0] || {}).map(key => ({
            wch: Math.max(key.length, 15)
        }));
        ws['!cols'] = colWidths;

        // Create WorkBook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Income 365 Transactions");

        // Save File
        XLSX.writeFile(wb, `income_365_export_${format(new Date(), "yyyyMMdd_HHmmss")}.xlsx`);
    };

    return (
        <Card className="col-span-1 md:col-span-4 mt-6">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Detailed Income 365 Transactions</CardTitle>
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
                                <TableHead className="whitespace-nowrap">Invoice Date</TableHead>
                                <TableHead className="whitespace-nowrap">Branch Name</TableHead>
                                <TableHead className="whitespace-nowrap">Invoice ID</TableHead>
                                <TableHead className="whitespace-nowrap">Sales ID</TableHead>
                                <TableHead className="whitespace-nowrap">Account</TableHead>
                                <TableHead className="whitespace-nowrap">Customer Ref</TableHead>
                                <TableHead className="whitespace-nowrap">Voucher</TableHead>
                                <TableHead className="whitespace-nowrap">Area ID</TableHead>
                                <TableHead className="whitespace-nowrap text-right">Amount</TableHead>
                                <TableHead className="whitespace-nowrap">Currency</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentData && currentData.length > 0 ? (
                                currentData.map((item, index) => (
                                    <TableRow key={index} className="hover:bg-slate-50">
                                        <TableCell className="whitespace-nowrap">
                                            {item.invoicedate ? format(new Date(item.invoicedate), "dd MMM yyyy") : '-'}
                                        </TableCell>
                                        <TableCell className="max-w-[200px] truncate" title={item.branch_name}>
                                            {item.branch_name}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">{item.invoiceid}</TableCell>
                                        <TableCell className="whitespace-nowrap">{item.salesid}</TableCell>
                                        <TableCell className="whitespace-nowrap">{item.invoiceaccount}</TableCell>
                                        <TableCell className="whitespace-nowrap max-w-[150px] truncate" title={item.customerreference}>
                                            {item.customerreference || '-'}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">{item.ledgervoucher}</TableCell>
                                        <TableCell className="whitespace-nowrap">{item.dataareaid}</TableCell>
                                        <TableCell className="text-right font-medium">
                                            {Number(item.invoiceamount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </TableCell>
                                        <TableCell className="text-center">{item.currencycode}</TableCell>
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
