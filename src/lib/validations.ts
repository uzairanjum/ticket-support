import { z } from 'zod';

// ─── Auth Schemas ────────────────────────────────────────
export const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.enum(['customer', 'admin', 'team_member']),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;

// ─── Ticket Schemas ──────────────────────────────────────
export const createTicketSchema = z.object({
    ticket_type: z.enum([
        'Technical Issue',
        'Billing',
        'Feature Request',
        'Bug Report',
        'Account Management',
    ]),
    description: z
        .string()
        .min(10, 'Description must be at least 10 characters')
        .max(5000, 'Description must be less than 5000 characters'),
});

export const updateTicketSchema = z.object({
    ticket_type: z.enum([
        'Technical Issue',
        'Billing',
        'Feature Request',
        'Bug Report',
        'Account Management',
    ]).optional(),
    description: z
        .string()
        .min(10, 'Description must be at least 10 characters')
        .max(5000, 'Description must be less than 5000 characters')
        .optional(),
    status: z.enum(['open', 'progress', 'review', 'resolved']).optional(),
    assign_to: z.coerce.number().nullable().optional(),
});

export const assignTicketSchema = z.object({
    ticket_id: z.string().min(1, 'Invalid ticket ID'),
    staff_id: z.string().min(1, 'Invalid staff member ID'),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type UpdateTicketInput = z.infer<typeof updateTicketSchema>;
export type AssignTicketInput = z.infer<typeof assignTicketSchema>;
