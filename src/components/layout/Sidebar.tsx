'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PieChart, BarChart3, Users, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => {
                if (data.user?.role === 'admin') setIsAdmin(true);
            })
            .catch(() => { });
    }, []);

    return (
        <div className={cn('pb-12 w-64 border-r bg-background hidden md:block', className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        Executive Portal
                    </h2>
                    <div className="space-y-1">
                        <Link href="/" passHref>
                            <Button variant={pathname === '/' ? 'secondary' : 'ghost'} className="w-full justify-start">
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        Reports
                    </h2>
                    <div className="space-y-1">
                        <Link href="/reports/gi-income" passHref>
                            <Button variant={pathname.startsWith('/reports/gi-income') ? 'secondary' : 'ghost'} className="w-full justify-start">
                                <BarChart3 className="mr-2 h-4 w-4" />
                                GI Income Report
                            </Button>
                        </Link>
                        <Button variant="ghost" className="w-full justify-start opacity-50 cursor-not-allowed" disabled>
                            <PieChart className="mr-2 h-4 w-4" />
                            Sales Report
                        </Button>
                    </div>
                </div>

                {/* Admin Section */}
                {isAdmin && (
                    <div className="px-3 py-2">
                        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                            Admin
                        </h2>
                        <div className="space-y-1">
                            <Link href="/admin/users" passHref>
                                <Button variant={pathname.startsWith('/admin/users') ? 'secondary' : 'ghost'} className="w-full justify-start">
                                    <Users className="mr-2 h-4 w-4" />
                                    User Management
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
