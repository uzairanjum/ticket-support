import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/services/tickets';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { Toaster } from '@/components/ui/sonner';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const profile = await getCurrentProfile();

    if (!profile) {
        redirect('/login');
    }

    return (
        <>
            <DashboardShell initialUser={profile}>
                {children}
            </DashboardShell>
            <Toaster position="top-right" richColors closeButton />
        </>
    );
}
