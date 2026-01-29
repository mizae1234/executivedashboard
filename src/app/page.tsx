
import { Construction } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-slate-100 rounded-full">
              <Construction className="h-8 w-8 text-slate-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">Dashboard Coming Soon</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            We are currently building the main executive summary dashboard.
            Please utilize the Reports section for detailed analysis.
          </p>
          <div className="pt-4">
            <Link href="/reports/gi-income">
              <Button className="w-full">
                Go to GI Income Report
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
