'use client';

import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Sidebar } from './Sidebar';

export function Header() {
    return (
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6 lg:h-[60px]">
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 md:hidden"
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64">
                    {/* Mobile Sidebar reuse logic - simplified */}
                    <Sidebar className="block border-none w-full" />
                </SheetContent>
            </Sheet>
            <div className="w-full flex-1">
                <h1 className="text-lg font-semibold">Executive Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
                {/* User profile placeholder */}
                <div className="h-8 w-8 rounded-full bg-slate-200" />
            </div>
        </header>
    );
}
