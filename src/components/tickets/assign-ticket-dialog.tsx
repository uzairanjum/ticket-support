'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { UserPlus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { assignTicketAction } from '@/app/(dashboard)/actions';
import type { Ticket } from '@/types';

interface AssignTicketDialogProps {
    ticket: Ticket;
    staffMembers: { id: number; name: string; email: string | null }[];
}

export function AssignTicketDialog({ ticket, staffMembers }: AssignTicketDialogProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        formData.append('ticket_id', String(ticket.id));

        startTransition(async () => {
            const result = await assignTicketAction(formData);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success('Ticket assigned successfully!');
                setOpen(false);
                router.refresh();
            }
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8">
                    <UserPlus className="h-3.5 w-3.5" />
                    Assign
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] border-border/50">
                <DialogHeader>
                    <DialogTitle className="text-lg">Assign Ticket</DialogTitle>
                    <DialogDescription className="mt-1">
                        Assign this ticket to a staff member for processing.
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit} className="space-y-5 mt-2">
                    <div className="space-y-2">
                        <Label htmlFor="staff_id" className="text-sm font-medium">
                            Staff Member
                        </Label>
                        <Select name="staff_id" required>
                            <SelectTrigger id="staff_id" className="h-11" disabled={isPending}>
                                <SelectValue placeholder="Select staff member" />
                            </SelectTrigger>
                            <SelectContent>
                                {staffMembers.map((member) => (
                                    <SelectItem key={member.id} value={String(member.id)}>
                                        <div className="flex flex-col">
                                            <span>{member.name}</span>
                                            {member.email && (
                                                <span className="text-xs text-muted-foreground">{member.email}</span>
                                            )}
                                        </div>
                                    </SelectItem>
                                ))}
                                {staffMembers.length === 0 && (
                                    <SelectItem value="none" disabled>
                                        No staff members available
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending} className="min-w-[90px]">
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Assigning...
                                </>
                            ) : (
                                'Assign'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
