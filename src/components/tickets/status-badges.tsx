import { Badge as UiBadge } from '@/components/ui/badge';
import { statusConfig, typeConfig } from '@/lib/constants';
import { type TicketStatus, type TicketType } from '@/types';
import { cn } from '@/lib/utils';

export function StatusBadge({ status, className }: { status: TicketStatus; className?: string }) {
    const config = statusConfig[status];
    return (
        <UiBadge
            variant="outline"
            className={cn('gap-1.5 px-2.5 py-0.5 font-medium transition-colors', config.bg, config.color, className)}
        >
            <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />
            {config.label}
        </UiBadge>
    );
}

export function TypeBadge({ type, className }: { type: TicketType; className?: string }) {
    const config = typeConfig[type];
    return (
        <UiBadge
            variant="secondary"
            className={cn('gap-1.5 px-2.5 py-0.5 bg-secondary/50 text-secondary-foreground border-transparent', className)}
        >
            <span className="text-xs">{config.icon}</span>
            {config.label}
        </UiBadge>
    );
}
