import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Login - Executive Dashboard',
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Auth pages don't need the sidebar/header layout
    return <>{children}</>;
}
