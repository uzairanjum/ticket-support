export type UserRole = 'customer' | 'admin' | 'team_member';

export type TicketType =
    | 'Technical Issue'
    | 'Billing'
    | 'Feature Request'
    | 'Bug Report'
    | 'Account Management';

export type TicketStatus = 'open' | 'progress' | 'review' | 'resolved';

export interface User {
    id: number;
    name: string;
    email: string;
    avatar_url?: string;
    role: UserRole;
    created_at: string;
}

export interface Ticket {
    id: number;
    ticket_type: TicketType;
    description: string;
    status: TicketStatus;
    created_by: number | null;
    assign_to?: number | null;
    created_at: string;
    updated_at: string;

    // Joins
    customer?: User;
    staff?: User;
}

export interface CreateTicketDTO {
    ticket_type: TicketType;
    description: string;
}

export interface UpdateTicketDTO {
    ticket_type?: TicketType;
    description?: string;
    status?: TicketStatus;
    assign_to?: number | null;
}

export interface TicketFilters {
    status?: TicketStatus;
    ticket_type?: TicketType;
    search?: string;
}

export interface PaginationParams {
    page: number;
    limit: number;
}

export interface PaginatedResult<T> {
    data: T[];
    count: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface DashboardStats {
    total: number;
    open: number;
    progress: number;
    review: number;
    resolved: number;
}
