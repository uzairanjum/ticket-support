'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { createTicketSchema, updateTicketSchema, assignTicketSchema } from '@/lib/validations';

export async function createTicketAction(formData: FormData) {
    const supabase = await createClient();
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get('user_id')?.value;

    if (!userIdStr) {
        return { error: 'Not authenticated' };
    }
    const userId = parseInt(userIdStr, 10);

    const rawData = {
        ticket_type: formData.get('ticket_type') as string,
        description: formData.get('description') as string,
    };

    const result = createTicketSchema.safeParse(rawData);
    if (!result.success) {
        const firstIssue = result.error.issues?.[0];
        return { error: firstIssue?.message || 'Validation failed' };
    }

    const { error } = await supabase.from('tickets').insert({
        ticket_type: result.data.ticket_type,
        description: result.data.description,
        status: 'open' as const,
        created_by: userId,
    });

    if (error) {
        return { error: `Failed to create ticket: ${error.message}` };
    }

    revalidatePath('/dashboard/customer');
    return { success: true };
}

export async function assignTicketAction(formData: FormData) {
    const supabase = await createClient();
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get('user_id')?.value;

    if (!userIdStr) {
        return { error: 'Not authenticated' };
    }
    const userId = parseInt(userIdStr, 10);

    // Verify admin role
    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

    if (profile?.role !== 'admin') {
        return { error: 'Unauthorized: Admin access required' };
    }

    const rawData = {
        ticket_id: formData.get('ticket_id') as string,
        staff_id: formData.get('staff_id') as string,
    };

    const result = assignTicketSchema.safeParse(rawData);
    if (!result.success) {
        const firstIssue = result.error.issues?.[0];
        return { error: firstIssue?.message || 'Validation failed' };
    }

    const { error } = await supabase
        .from('tickets')
        .update({
            assign_to: parseInt(result.data.staff_id, 10),
            status: 'progress' as const,
        })
        .eq('id', parseInt(result.data.ticket_id, 10));

    if (error) {
        return { error: `Failed to assign ticket: ${error.message}` };
    }

    revalidatePath('/dashboard/admin');
    return { success: true };
}

export async function updateTicketStatusAction(formData: FormData) {
    const supabase = await createClient();
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get('user_id')?.value;

    if (!userIdStr) {
        return { error: 'Not authenticated' };
    }

    const ticketId = formData.get('ticket_id') as string;
    const status = formData.get('status') as string;

    const result = updateTicketSchema.safeParse({ status });
    if (!result.success) {
        const firstIssue = result.error.issues?.[0];
        return { error: firstIssue?.message || 'Validation failed' };
    }

    const { error } = await supabase
        .from('tickets')
        .update({ status: result.data.status as 'open' | 'progress' | 'review' | 'resolved' })
        .eq('id', parseInt(ticketId, 10));

    if (error) {
        return { error: `Failed to update ticket: ${error.message}` };
    }

    revalidatePath('/dashboard');
    return { success: true };
}
