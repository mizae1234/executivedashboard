"use client"

import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface IncomeBarChartProps {
    data: {
        channel: string;
        amount: number;
    }[];
}

export function IncomeBarChart({ data }: IncomeBarChartProps) {
    return (
        <Card className="col-span-1 md:col-span-2 lg:col-span-3">
            <CardHeader>
                <CardTitle>Income by Channel</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="channel"
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
                                cursor={{ fill: '#f1f5f9' }}
                                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                            />
                            <Bar
                                dataKey="amount"
                                fill="#0f172a"
                                radius={[4, 4, 0, 0]}
                            />
                        </RechartsBarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
