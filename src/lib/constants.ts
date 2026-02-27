import { type TicketStatus, type TicketType, type UserRole } from '@/types';

// ─── Status Config ───────────────────────────────────────
export const statusConfig: Record<
    TicketStatus,
    { label: string; color: string; bg: string; dot: string }
> = {
    open: {
        label: 'Open',
        color: 'text-amber-700 dark:text-amber-400',
        bg: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800',
        dot: 'bg-amber-500',
    },
    progress: {
        label: 'In Progress',
        color: 'text-blue-700 dark:text-blue-400',
        bg: 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800',
        dot: 'bg-blue-500',
    },
    review: {
        label: 'In Review',
        color: 'text-purple-700 dark:text-purple-400',
        bg: 'bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800',
        dot: 'bg-purple-500',
    },
    resolved: {
        label: 'Resolved',
        color: 'text-emerald-700 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800',
        dot: 'bg-emerald-500',
    },
};

// ─── Type Config ─────────────────────────────────────────
export const typeConfig: Record<TicketType, { label: string; icon: string }> = {
    'Technical Issue': { label: 'Technical Issue', icon: '🔧' },
    Billing: { label: 'Billing', icon: '💳' },
    'Feature Request': { label: 'Feature Request', icon: '✨' },
    'Bug Report': { label: 'Bug Report', icon: '🐛' },
    'Account Management': { label: 'Account Management', icon: '👤' },
};

// ─── Role Config ─────────────────────────────────────────
export const roleConfig: Record<UserRole, { label: string; dashboard: string }> = {
    customer: { label: 'Customer', dashboard: '/dashboard/customer' },
    admin: { label: 'Admin', dashboard: '/dashboard/admin' },
    team_member: { label: 'Staff', dashboard: '/dashboard/staff' },
};
