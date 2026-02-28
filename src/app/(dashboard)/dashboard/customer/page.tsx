import { Suspense } from "react";
import { redirect } from "next/navigation";
import {
  getCurrentProfile,
  getCustomerTickets,
  getDashboardStats,
} from "@/services/tickets";
import {
  StatsCard,
} from "@/components/dashboard/stats-card";
import {
  TicketTable,
  TicketTableSkeleton,
} from "@/components/tickets/ticket-table";
import { CreateTicketDialog } from "@/components/tickets/create-ticket-dialog";
import { TicketFiltersBar } from "@/components/tickets/ticket-filters";
import { Pagination } from "@/components/tickets/pagination";
import { RealtimeProvider } from "@/components/realtime-provider";
import {
  Ticket as TicketIcon,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import type { TicketStatus, TicketType } from "@/types";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    status?: TicketStatus;
    ticket_type?: TicketType;
    search?: string;
  }>;
}

export default async function CustomerDashboard({ searchParams }: PageProps) {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== "customer") {
    redirect("/login");
  }

  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const filters = {
    status: params.status,
    ticket_type: params.ticket_type,
    search: params.search,
  };

  const [ticketsResult, stats] = await Promise.all([
    getCustomerTickets(profile.id, filters, { page, limit: 10 }),
    getDashboardStats(profile.id, "customer"),
  ]);

  return (
    <RealtimeProvider>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Support Overview
            </h1>
            <p className="text-gray-500 mt-1">
              Hello, {profile.name}. Track your support requests and their
              status.
            </p>
          </div>
          <CreateTicketDialog />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Requests"
            value={stats.total}
            icon={<TicketIcon className="h-5 w-5 text-emerald-600" />}
            color="text-gray-900"
          />
          <StatsCard
            title="Open"
            value={stats.open}
            icon={<AlertCircle className="h-5 w-5 text-amber-500" />}
            color="text-amber-600"
          />
          <StatsCard
            title="In Progress"
            value={stats.progress}
            icon={<Clock className="h-5 w-5 text-blue-500" />}
            color="text-blue-600"
          />
          <StatsCard
            title="Resolved"
            value={stats.resolved}
            icon={<CheckCircle className="h-5 w-5 text-emerald-500" />}
            color="text-emerald-600"
          />
        </div>

        {/* Tickets Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight text-gray-800">
              Your Tickets
            </h2>
          </div>

          <Suspense fallback={<TicketTableSkeleton rows={5} />}>
            <TicketFiltersBar showStatusFilter showTypeFilter />
            <TicketTable tickets={ticketsResult.data} showStaff={false} />
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
