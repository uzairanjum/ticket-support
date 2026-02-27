'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { updateTicketStatusAction } from '@/app/(dashboard)/actions';
import { statusConfig } from '@/lib/constants';
import { type TicketStatus } from '@/types';
import { Loader2 } from 'lucide-react';

interface UpdateStatusSelectProps {
    ticketId: number;
    currentStatus: TicketStatus;
}

export function UpdateStatusSelect({ ticketId, currentStatus }: UpdateStatusSelectProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    async function handleStatusChange(value: string) {
        const formData = new FormData();
        formData.append('ticket_id', String(ticketId));
        formData.append('status', value);

        startTransition(async () => {
            const result = await updateTicketStatusAction(formData);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success(`Status updated to ${value}`);
                router.refresh();
            }
        });
    }

    // Define allowed transitions for staff
    // Typically: open -> progress -> review -> resolved
    const allowedStatuses: TicketStatus[] = ['open', 'progress', 'review', 'resolved'];

    return (
        <div className="flex items-center gap-2">
            <Select
                defaultValue={currentStatus}
                onValueChange={handleStatusChange}
                disabled={isPending}
            >
                <SelectTrigger className="w-[130px] h-8 text-xs font-medium border-border/60">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {allowedStatuses.map((status) => (
                        <SelectItem key={status} value={status} className="text-xs">
                            {statusConfig[status].label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {isPending && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
        </div>
    );
}
