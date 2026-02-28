import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge, TypeBadge } from "./status-badges";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { type Ticket } from "@/types";
import { Ticket as TicketIcon, User } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TicketTableProps {
  tickets: Ticket[];
  isLoading?: boolean;
  showCustomer?: boolean;
  showStaff?: boolean;
  actions?: (ticket: Ticket) => React.ReactNode;
}

function getInitials(name?: string): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function TicketTable({
  tickets,
  isLoading,
  showCustomer,
  showStaff,
  actions,
}: TicketTableProps) {
  if (isLoading) return <TicketTableSkeleton rows={5} />;

  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 border border-gray-100/50 rounded-2xl bg-white/50 backdrop-blur-sm shadow-lg shadow-black/5">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center mb-4 shadow-inner">
          <TicketIcon className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-600">
          No tickets found
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Tickets will appear here when created
        </p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="rounded-2xl border border-gray-100/50 bg-white/80 backdrop-blur-sm shadow-xl shadow-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full table-fixed min-w-[800px]">
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-gray-50/80 to-white/80 hover:from-gray-50 hover:to-white border-b border-gray-100">
                <TableHead className="w-[60px] font-semibold text-gray-500 text-xs">ID</TableHead>
                <TableHead className="w-[160px] font-semibold text-gray-500 text-xs">Type</TableHead>
                <TableHead className="min-w-[250px] font-semibold text-gray-500 text-xs">
                  Description
                </TableHead>
                <TableHead className="w-[120px] font-semibold text-gray-500 text-xs">
                  Status
                </TableHead>
                {showCustomer && (
                  <TableHead className="w-[200px] font-semibold text-gray-500 text-xs">
                    Customer
                  </TableHead>
                )}
                {showStaff && (
                  <TableHead className="w-[180px] font-semibold text-gray-500 text-xs">
                    Assigned
                  </TableHead>
                )}
                <TableHead className="w-[120px] font-semibold text-gray-500 text-xs">
                  Created
                </TableHead>
                {actions && (
                  <TableHead className="w-[100px] text-right font-semibold text-gray-500 text-xs">
                    Actions
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow
                  key={ticket.id}
                  className="group transition-all duration-200 hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-white border-b border-gray-50/50 last:border-0"
                >
                  <TableCell className="font-mono text-xs text-muted-foreground font-medium whitespace-normal">
                    #{ticket.id}
                  </TableCell>
                  <TableCell className="whitespace-normal">
                    <div className="w-full overflow-hidden">
                      <TypeBadge
                        type={ticket.ticket_type}
                        className="max-w-full"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="overflow-hidden whitespace-normal">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="text-sm font-medium truncate cursor-help line-clamp-1">
                          {ticket.description}
                        </p>
                      </TooltipTrigger>
                      <TooltipContent
                        side="bottom"
                        className="max-w-xs text-xs font-normal"
                      >
                        {ticket.description}
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="whitespace-normal">
                    <StatusBadge status={ticket.status} />
                  </TableCell>
                  {showCustomer && (
                    <TableCell className="whitespace-normal">
                      {ticket.customer ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2.5 cursor-help overflow-hidden">
                              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#005430] to-[#51A26A] flex items-center justify-center text-white text-[10px] font-bold shadow-sm shrink-0">
                                {getInitials(ticket.customer.name)}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-xs font-semibold truncate">
                                  {ticket.customer.name}
                                </span>
                                <span className="text-[10px] text-muted-foreground truncate">
                                  {ticket.customer.email}
                                </span>
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            <div className="space-y-1">
                              <p className="font-semibold">
                                {ticket.customer.name}
                              </p>
                              <p className="text-[10px] opacity-80">
                                {ticket.customer.email}
                              </p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <span className="text-xs text-muted-foreground italic flex items-center gap-1.5">
                          <User className="h-3 w-3" />
                          Unknown
                        </span>
                      )}
                    </TableCell>
                  )}
                  {showStaff && (
                    <TableCell className="whitespace-normal">
                      {ticket.staff ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2.5 cursor-help overflow-hidden">
                              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#005430] to-[#51A26A] flex items-center justify-center text-white text-[10px] font-bold shadow-sm shrink-0">
                                {getInitials(ticket.staff.name)}
                              </div>
                              <span className="text-xs font-medium truncate">
                                {ticket.staff.name}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            <p className="font-semibold">{ticket.staff.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-1 rounded-full border border-amber-200 dark:border-amber-800 font-medium">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                          Unassigned
                        </span>
                      )}
                    </TableCell>
                  )}
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(ticket.created_at), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  {actions && (
                    <TableCell className="text-right whitespace-normal">
                      {actions(ticket)}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </TooltipProvider>
  );
}

export function TicketTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-2xl border border-gray-100/50 bg-white/80 backdrop-blur-sm shadow-xl shadow-black/5 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-gray-50/80 to-white/80 border-b border-gray-100">
            <TableHead className="w-[80px] text-gray-400 text-xs">ID</TableHead>
            <TableHead className="text-gray-400 text-xs">Type</TableHead>
            <TableHead className="text-gray-400 text-xs">Description</TableHead>
            <TableHead className="text-gray-400 text-xs">Status</TableHead>
            <TableHead className="text-gray-400 text-xs">Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRow key={i} className="border-b border-gray-50/50 last:border-0">
              <TableCell>
                <Skeleton className="h-4 w-12 bg-gray-100" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-24 rounded-full bg-gray-100" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-48 bg-gray-100" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-20 rounded-full bg-gray-100" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24 bg-gray-100" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
