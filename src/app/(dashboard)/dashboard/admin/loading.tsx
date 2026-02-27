import { StatsCardSkeleton } from '@/components/dashboard/stats-card';
import { TicketTableSkeleton } from '@/components/tickets/ticket-table';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboardLoading() {
    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <Skeleton className="h-9 w-56" />
                <Skeleton className="h-5 w-72" />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <StatsCardSkeleton key={i} />
                ))}
            </div>

            <div className="space-y-4">
                <Skeleton className="h-7 w-28" />
                <div className="flex gap-3">
                    <Skeleton className="h-10 w-56" />
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-28" />
                </div>
                <TicketTableSkeleton rows={10} />
            </div>
        </div>
    );
}
