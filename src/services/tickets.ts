import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import type {
    Ticket,
    TicketFilters,
    PaginationParams,
    PaginatedResult,
    DashboardStats,
    CreateTicketDTO,
    UpdateTicketDTO,
    User,
} from '@/types';

// ─── Shared Helper for Manual Joins ──────────────────────
async function attachUserProfiles(tickets: Ticket[]): Promise<Ticket[]> {
    if (tickets.length === 0) return [];
    const supabase = await createClient();

    const userIds = new Set<number>();
    tickets.forEach((t) => {
        if (t.created_by) userIds.add(t.created_by);
        if (t.assign_to) userIds.add(t.assign_to);
    });

    if (userIds.size === 0) return tickets;

    const { data: users } = await supabase
        .from('users')
        .select('id, name, email')
        .in('id', Array.from(userIds));

    const userMap = new Map((users || []).map((u) => [u.id, u as User]));

    return tickets.map((t) => {
        const customer = t.created_by ? userMap.get(t.created_by) : undefined;
        const staff = t.assign_to ? userMap.get(t.assign_to) : undefined;
        return {
            ...t,
            customer,
            staff,
        };
    });
}

// ─── Fetch Tickets (Server) ─────────────────────────────
export async function getTickets(
    filters: TicketFilters = {},
    pagination: PaginationParams = { page: 1, limit: 20 }
): Promise<PaginatedResult<Ticket>> {
    const supabase = await createClient();
    const { page, limit } = pagination;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
        .from('tickets')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

    if (filters.status) {
        query = query.eq('status', filters.status);
    }
    if (filters.ticket_type) {
        query = query.eq('ticket_type', filters.ticket_type);
    }
    if (filters.search) {
        query = query.or(`description.ilike.%${filters.search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
        throw new Error(`Failed to fetch tickets: ${error.message}`);
    }

    const ticketsWithUsers = await attachUserProfiles(data || []);

    return {
        data: ticketsWithUsers,
        count: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
    };
}

// ─── Get Customer Tickets ────────────────────────────────
export async function getCustomerTickets(
    customerId: number,
    filters: TicketFilters = {},
    pagination: PaginationParams = { page: 1, limit: 20 }
): Promise<PaginatedResult<Ticket>> {
    const supabase = await createClient();
    const { page, limit } = pagination;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
        .from('tickets')
        .select('*', { count: 'exact' })
        .eq('created_by', customerId)
        .order('created_at', { ascending: false })
        .range(from, to);

    if (filters.status) {
        query = query.eq('status', filters.status);
    }
    if (filters.ticket_type) {
        query = query.eq('ticket_type', filters.ticket_type);
    }
    if (filters.search) {
        query = query.or(`description.ilike.%${filters.search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
        throw new Error(`Failed to fetch customer tickets: ${error.message}`);
    }

    const ticketsWithUsers = await attachUserProfiles(data || []);

    return {
        data: ticketsWithUsers,
        count: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
    };
}

// ─── Get Staff Tickets ────────────────────────────────────
export async function getStaffMemberTickets(
    memberId: number,
    filters: TicketFilters = {},
    pagination: PaginationParams = { page: 1, limit: 20 }
): Promise<PaginatedResult<Ticket>> {
    const supabase = await createClient();
    const { page, limit } = pagination;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
        .from('tickets')
        .select('*', { count: 'exact' })
        .eq('assign_to', memberId)
        .order('created_at', { ascending: false })
        .range(from, to);

    if (filters.status) {
        query = query.eq('status', filters.status);
    }
    if (filters.search) {
        query = query.or(`description.ilike.%${filters.search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
        throw new Error(`Failed to fetch staff tickets: ${error.message}`);
    }

    const ticketsWithUsers = await attachUserProfiles(data || []);

    return {
        data: ticketsWithUsers,
        count: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
    };
}

// ─── Get Single Ticket ───────────────────────────────────
export async function getTicketById(ticketId: number): Promise<Ticket | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('id', ticketId)
        .single();

    if (error || !data) {
        return null;
    }

    const [ticketWithUser] = await attachUserProfiles([data]);
    return ticketWithUser;
}

// ─── Get Dashboard Stats ────────────────────────────────
export async function getDashboardStats(
    userId?: number,
    role?: string
): Promise<DashboardStats> {
    const supabase = await createClient();

    let query = supabase
        .from('tickets')
        .select('status');

    if (role === 'customer' && userId) {
        query = query.eq('created_by', userId);
    } else if (role === 'team_member' && userId) {
        query = query.eq('assign_to', userId);
    }

    const { data, error } = await query;

    if (error) {
        return { total: 0, open: 0, progress: 0, review: 0, resolved: 0 };
    }

    const rows = data as Array<{ status: string }>;

    const stats: DashboardStats = {
        total: rows.length,
        open: rows.filter((t) => t.status === 'open').length,
        progress: rows.filter((t) => t.status === 'progress').length,
        review: rows.filter((t) => t.status === 'review').length,
        resolved: rows.filter((t) => t.status === 'resolved').length,
    };

    return stats;
}

// ─── Get Staff Members ────────────────────────────────────
export async function getStaffMembers() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('users')
        .select('id, name, email, created_at')
        .eq('role', 'team_member')
        .order('name');

    if (error) {
        throw new Error(`Failed to fetch staff members: ${error.message}`);
    }

    return data || [];
}

// ─── Create Ticket ───────────────────────────────────────
export async function createTicket(ticket: CreateTicketDTO & { customer_id: number }) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('tickets')
        .insert({
            ticket_type: ticket.ticket_type,
            description: ticket.description,
            status: 'open' as const,
            created_by: ticket.customer_id,
        })
        .select()
        .single();

    if (error) {
        throw new Error(`Failed to create ticket: ${error.message}`);
    }

    return data;
}

// ─── Update Ticket ───────────────────────────────────────
export async function updateTicket(ticketId: number, updates: UpdateTicketDTO) {
    const supabase = await createClient();

    const updateData: Record<string, unknown> = {};
    if (updates.ticket_type !== undefined) updateData.ticket_type = updates.ticket_type;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.assign_to !== undefined) updateData.assign_to = updates.assign_to;

    const { data, error } = await supabase
        .from('tickets')
        .update(updateData)
        .eq('id', ticketId)
        .select()
        .single();

    if (error) {
        throw new Error(`Failed to update ticket: ${error.message}`);
    }

    return data;
}

// ─── Assign Ticket ───────────────────────────────────────
export async function assignTicket(ticketId: number, staffId: number) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('tickets')
        .update({
            assign_to: staffId,
            status: 'progress' as const,
        })
        .eq('id', ticketId)
        .select()
        .single();

    if (error) {
        throw new Error(`Failed to assign ticket: ${error.message}`);
    }

    return data;
}

// ─── Get Current User Profile ────────────────────────────
export async function getCurrentProfile(): Promise<User | null> {
    const supabase = await createClient();
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get('user_id')?.value;

    if (!userIdStr) return null;
    const userId = parseInt(userIdStr, 10);

    const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

    if (error || !profile) return null;

    return {
        id: profile.id,
        name: profile.name,
        role: profile.role as 'customer' | 'admin' | 'team_member',
        email: profile.email || '',
        created_at: profile.created_at,
    };
}
