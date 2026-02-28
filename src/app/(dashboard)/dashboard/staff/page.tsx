import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import {
    getCurrentProfile,
    getStaffMemberTickets,
    getDashboardStats,
} from '@/services/tickets';
import { StatsCard } from '@/components/dashboard/stats-card';
import { TicketTable, TicketTableSkeleton } from '@/components/tickets/ticket-table';
import { TicketFiltersBar } from '@/components/tickets/ticket-filters';
import { Pagination } from '@/components/tickets/pagination';
import { UpdateStatusSelect } from '@/components/tickets/update-status-select';
import { RealtimeProvider } from '@/components/realtime-provider';
import { Ticket as TicketIcon, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import type { TicketStatus, TicketType } from '@/types';

interface PageProps {
    searchParams: Promise<{
        page?: string;
        status?: TicketStatus;
        ticket_type?: TicketType;
        search?: string;
    }>;
}

export default async function StaffDashboard({ searchParams }: PageProps) {
    const profile = await getCurrentProfile();

    if (!profile || profile.role !== 'team_member') {
        redirect('/login');
    }

    const params = await searchParams;
    const page = parseInt(params.page || '1', 10);
    const filters = {
        status: params.status,
        ticket_type: params.ticket_type,
        search: params.search,
    };

    const [ticketsResult, stats] = await Promise.all([
        getStaffMemberTickets(profile.id, filters, { page, limit: 10 }),
        getDashboardStats(profile.id, 'team_member'),
    ]);

    return (
        <RealtimeProvider>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Staff Queue</h1>
                        <p className="text-muted-foreground mt-1">
                            Welcome back, {profile.name}. Manage your assigned tickets.
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                    <StatsCard
                        title="Assigned"
                        value={stats.progress}
                        icon={<Clock className="h-5 w-5 text-blue-500" />}
                        color="text-blue-600"
                    />
                    <StatsCard
                        title="In Review"
                        value={stats.review}
                        icon={<AlertCircle className="h-5 w-5 text-purple-500" />}
                        color="text-purple-600"
                    />
                    <StatsCard
                        title="Resolved"
                        value={stats.resolved}
                        icon={<CheckCircle className="h-5 w-5 text-emerald-500" />}
                        color="text-emerald-600"
                    />
                    <StatsCard
                        title="Total Handled"
                        value={stats.total}
                        icon={<TicketIcon className="h-5 w-5 text-primary" />}
                    />
                </div>

                {/* Tickets Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold tracking-tight">My Active Tickets</h2>
                    </div>

                    <Suspense fallback={<TicketTableSkeleton rows={5} />}>
                        <TicketFiltersBar showStatusFilter />
                        <TicketTable
                            tickets={ticketsResult.data}
                            showCustomer
                            actions={(ticket) => (
                                <UpdateStatusSelect ticketId={ticket.id} currentStatus={ticket.status} />
                            )}
                        />
                        <Pagination
                            page={ticketsResult.page}
                            totalPages={ticketsResult.totalPages}
                            count={ticketsResult.count}
                        />
                    </Suspense>
                </div>
            </div>
        </RealtimeProvider>
    );
}
