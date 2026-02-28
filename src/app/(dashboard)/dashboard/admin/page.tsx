import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import {
    getCurrentProfile,
    getTickets,
    getDashboardStats,
    getStaffMembers,
} from '@/services/tickets';
import { StatsCard } from '@/components/dashboard/stats-card';
import { TicketTable, TicketTableSkeleton } from '@/components/tickets/ticket-table';
import { TicketFiltersBar } from '@/components/tickets/ticket-filters';
import { Pagination } from '@/components/tickets/pagination';
import { AssignTicketDialog } from '@/components/tickets/assign-ticket-dialog';
import { RealtimeProvider } from '@/components/realtime-provider';
import { Ticket as TicketIcon, Clock, CheckCircle, AlertCircle, Users } from 'lucide-react';
import type { TicketStatus, TicketType } from '@/types';

interface PageProps {
    searchParams: Promise<{
        page?: string;
        status?: TicketStatus;
        ticket_type?: TicketType;
        search?: string;
    }>;
}

export default async function AdminDashboard({ searchParams }: PageProps) {
    const profile = await getCurrentProfile();

    if (!profile || profile.role !== 'admin') {
        redirect('/login');
    }

    const params = await searchParams;
    const page = parseInt(params.page || '1', 10);
    const filters = {
        status: params.status,
        ticket_type: params.ticket_type,
        search: params.search,
    };

    const [ticketsResult, stats, staffMembers] = await Promise.all([
        getTickets(filters, { page, limit: 15 }),
        getDashboardStats(),
        getStaffMembers(),
    ]);

    return (
        <RealtimeProvider>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage all tickets, assign staff members, and track platform progress
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    <StatsCard
                        title="Total Tickets"
                        value={stats.total}
                        icon={<TicketIcon className="h-5 w-5 text-primary" />}
                    />
                    <StatsCard
                        title="Open"
                        value={stats.open}
                        icon={<AlertCircle className="h-5 w-5 text-amber-500" />}
                        color="text-amber-600"
                    />
                    <StatsCard
                        title="Progress"
                        value={stats.progress}
                        icon={<Clock className="h-5 w-5 text-blue-500" />}
                        color="text-blue-600"
                    />
                    <StatsCard
                        title="Review"
                        value={stats.review}
                        icon={<Users className="h-5 w-5 text-purple-500" />}
                        color="text-purple-600"
                    />
                    <StatsCard
                        title="Resolved"
                        value={stats.resolved}
                        icon={<CheckCircle className="h-5 w-5 text-emerald-500" />}
                        color="text-emerald-600"
                    />
                </div>

                {/* Tickets Section */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold tracking-tight">All Tickets</h2>

                    <Suspense fallback={<TicketTableSkeleton rows={10} />}>
                        <TicketFiltersBar
                            showStatusFilter
                            showTypeFilter
                        />
                        <TicketTable
                            tickets={ticketsResult.data}
                            showCustomer
                            showStaff
                            actions={(ticket) => (
                                <AssignTicketDialog
                                    ticket={ticket}
                                    staffMembers={staffMembers}
                                />
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
