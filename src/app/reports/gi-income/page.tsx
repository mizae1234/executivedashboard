"use client";

import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { addDays, subDays } from "date-fns";
import { KPICard } from "@/components/reports/KPICard";
import { IncomeLineChart } from "@/components/reports/IncomeLineChart";
import { IncomeBarChart } from "@/components/reports/IncomeBarChart";
import { OverviewTable } from "@/components/reports/OverviewTable";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Income365Table } from "@/components/reports/Income365Table";
import { IncomeDMSTable } from "@/components/reports/IncomeDMSTable";
import { IncomeTable } from "@/components/reports/IncomeTable";
import { Income365TransactionTable } from "@/components/reports/Income365TransactionTable";
import { IncomeDMSTransactionTable } from "@/components/reports/IncomeDMSTransactionTable";

export default function GIIncomeReportPage() {
    const [date, setDate] = useState<DateRange | undefined>({
        from: subDays(new Date(), 30),
        to: new Date(),
    });
    const [data, setData] = useState<any>(null);
    const [data365, setData365] = useState<any>(null);
    const [dataDMS, setDataDMS] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("dashboard");

    // Transaction States
    const [transactions365, setTransactions365] = useState<any[] | null>(null);
    const [loadingTransactions365, setLoadingTransactions365] = useState(false);
    const [transactionsDMS, setTransactionsDMS] = useState<any[] | null>(null);
    const [loadingTransactionsDMS, setLoadingTransactionsDMS] = useState(false);

    const fetchData = async () => {
        if (!date?.from || !date?.to) return;

        setLoading(true);
        // Reset transactions on date change
        setTransactions365(null);
        setTransactionsDMS(null);

        try {
            const params = new URLSearchParams({
                startDate: date.from.toISOString(),
                endDate: date.to.toISOString(),
            });

            // Parallel fetching
            const [res, res365, resDMS] = await Promise.all([
                fetch(`/api/reports/gi-income?${params.toString()}`),
                fetch(`/api/reports/income-365?${params.toString()}`), // Default scope returns summary only
                fetch(`/api/reports/income-dms?${params.toString()}`)  // Default scope returns summary only
            ]);

            if (res.ok) setData(await res.json());
            if (res365.ok) setData365(await res365.json());
            if (resDMS.ok) setDataDMS(await resDMS.json());

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const loadTransactions365 = async () => {
        if (!date?.from || !date?.to) return;
        setLoadingTransactions365(true);
        try {
            const params = new URLSearchParams({
                startDate: date.from.toISOString(),
                endDate: date.to.toISOString(),
                scope: 'transactions'
            });
            const res = await fetch(`/api/reports/income-365?${params.toString()}`);
            if (res.ok) {
                const json = await res.json();
                setTransactions365(json.transactions);
            }
        } catch (error) {
            console.error("Failed to load 365 transactions", error);
        } finally {
            setLoadingTransactions365(false);
        }
    };

    const loadTransactionsDMS = async () => {
        if (!date?.from || !date?.to) return;
        setLoadingTransactionsDMS(true);
        try {
            const params = new URLSearchParams({
                startDate: date.from.toISOString(),
                endDate: date.to.toISOString(),
                scope: 'transactions'
            });
            const res = await fetch(`/api/reports/income-dms?${params.toString()}`);
            if (res.ok) {
                const json = await res.json();
                setTransactionsDMS(json.transactions);
            }
        } catch (error) {
            console.error("Failed to load DMS transactions", error);
        } finally {
            setLoadingTransactionsDMS(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [date]);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">GI Income Report</h1>
                <div className="flex items-center gap-2">
                    <DateRangePicker date={date} setDate={setDate} />
                    <Button onClick={fetchData} disabled={loading}>
                        {loading ? "Loading..." : "Refresh"}
                    </Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="dashboard">Dashboard Overview</TabsTrigger>
                    <TabsTrigger value="income-365" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900 border-b-2 data-[state=active]:border-blue-500">Income 365</TabsTrigger>
                    <TabsTrigger value="income-dms" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-900 border-b-2 data-[state=active]:border-green-600">Income DMS</TabsTrigger>
                </TabsList>

                <TabsContent value="dashboard" className="space-y-6">
                    {data && (
                        <>
                            {/* KPI Cards */}
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <KPICard
                                    title="Total Income 365"
                                    value={`฿${data.summary.total365.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                    subtext="China Blue System"
                                />
                                <KPICard
                                    title="Total Income DMS"
                                    value={`฿${data.summary.totalDMS.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                    subtext="DMS System"
                                />
                                <KPICard title="Best Source" value={data.summary.bestChannel} subtext="Highest revenue source" />
                                <KPICard title="Active Growth (365)" value={`${data.summary.growth > 0 ? '+' : ''}${data.summary.growth}%`} trend={data.summary.growth} />
                            </div>

                            {/* Table */}
                            <OverviewTable
                                data={data.raw}
                                onViewDetail={(tab) => setActiveTab(tab)}
                            />

                            {/* Charts */}
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                                <IncomeLineChart data={data.trend} />
                                <IncomeBarChart data={data.byChannel} />
                            </div>
                        </>
                    )}
                </TabsContent>

                <TabsContent value="income-365" className="space-y-6">
                    {data365 && (
                        <>
                            <Income365Table data={data365.data} summary={data365.summary} />

                            <div className="mt-8">
                                {!transactions365 ? (
                                    <div className="flex justify-center py-8 bg-slate-50 border border-dashed rounded-lg">
                                        <Button
                                            onClick={loadTransactions365}
                                            disabled={loadingTransactions365}
                                            variant="outline"
                                        >
                                            {loadingTransactions365 ? "Loading Transactions..." : "Load Detailed Transactions"}
                                        </Button>
                                    </div>
                                ) : (
                                    <Income365TransactionTable data={transactions365} />
                                )}
                            </div>
                        </>
                    )}
                </TabsContent>

                <TabsContent value="income-dms" className="space-y-6">
                    {dataDMS && (
                        <>
                            <IncomeDMSTable data={dataDMS.data} />

                            <div className="mt-8">
                                {!transactionsDMS ? (
                                    <div className="flex justify-center py-8 bg-slate-50 border border-dashed rounded-lg">
                                        <Button
                                            onClick={loadTransactionsDMS}
                                            disabled={loadingTransactionsDMS}
                                            variant="outline"
                                        >
                                            {loadingTransactionsDMS ? "Loading Transactions..." : "Load Detailed Transactions"}
                                        </Button>
                                    </div>
                                ) : (
                                    <IncomeDMSTransactionTable data={transactionsDMS} />
                                )}
                            </div>
                        </>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
