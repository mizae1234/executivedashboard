'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface AppLayoutProps {
    children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
    const pathname = usePathname();

    // Auth pages don't show sidebar/header
    const isAuthPage = pathname.startsWith('/auth');

    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen w-full overflow-hidden">
            <Sidebar />
            <div className="flex flex-col flex-1 h-full overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50">
                    {children}
                </main>
            </div>
        </div>
    );
}
