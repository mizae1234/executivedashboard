"use client"

import { Line, LineChart as RechartsLineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface IncomeLineChartProps {
    data: {
        date: string;
        amount: number;
    }[];
}

export function IncomeLineChart({ data }: IncomeLineChartProps) {
    return (
        <Card className="col-span-1 md:col-span-2 lg:col-span-4">
            <CardHeader>
                <CardTitle>Income Trend (Monthly)</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `฿${value}`}
                            />
                            <Tooltip
                                formatter={(value: number) => [`฿${value.toLocaleString()}`, 'Income']}
                                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="amount"
                                stroke="#0f172a" // slate-900 (primary)
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 6 }}
                            />
                        </RechartsLineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
