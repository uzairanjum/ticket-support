import { StatsCardSkeleton } from '@/components/dashboard/stats-card';
import { TicketTableSkeleton } from '@/components/tickets/ticket-table';
import { Skeleton } from '@/components/ui/skeleton';

export default function CustomerDashboardLoading() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-64" />
                    <Skeleton className="h-5 w-48" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <StatsCardSkeleton key={i} />
                ))}
            </div>

            <div className="space-y-4">
                <Skeleton className="h-7 w-32" />
                <Skeleton className="h-10 w-full max-w-sm" />
                <TicketTableSkeleton />
            </div>
        </div>
    );
}
