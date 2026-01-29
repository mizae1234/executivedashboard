import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KPICardProps {
    title: string;
    value: string;
    trend?: number; // percentage, e.g. 12.5 or -5.2
    subtext?: string;
    className?: string;
}

export function KPICard({ title, value, trend, subtext, className }: KPICardProps) {
    return (
        <Card className={cn("", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {(trend !== undefined || subtext) && (
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                        {trend !== undefined && (
                            <span className={cn("flex items-center font-medium", trend > 0 ? "text-green-600" : trend < 0 ? "text-red-600" : "text-gray-600")}>
                                {trend > 0 ? <ArrowUpIcon className="mr-1 h-3 w-3" /> : trend < 0 ? <ArrowDownIcon className="mr-1 h-3 w-3" /> : <MinusIcon className="mr-1 h-3 w-3" />}
                                {Math.abs(trend)}%
                            </span>
                        )}
                        {subtext && <span className={cn(trend !== undefined && "ml-2")}>{subtext}</span>}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
