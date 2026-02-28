'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createTicketAction } from '@/app/(dashboard)/actions';
import { typeConfig } from '@/lib/constants';

export function CreateTicketDialog() {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        startTransition(async () => {
            const result = await createTicketAction(formData);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success('Ticket created successfully!');
                setOpen(false);
                router.refresh();
            }
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 shadow-lg shadow-primary/20">
                    <Plus className="h-4 w-4" />
                    New Ticket
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] border-border/50">
                <DialogHeader>
                    <DialogTitle className="text-xl">Create Ticket</DialogTitle>
                    <DialogDescription>
                        Submit a new support ticket. We&apos;ll get back to you as soon as possible.
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit} className="space-y-5 pt-2">
                    <div className="space-y-2">
                        <Label htmlFor="ticket_type">Ticket Type</Label>
                        <Select name="ticket_type" required defaultValue="Technical Issue">
                            <SelectTrigger id="ticket_type" className="h-11">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(typeConfig).map(([key, { label, icon }]) => (
                                    <SelectItem key={key} value={key}>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm">{icon}</span>
                                            <span>{label}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Please describe your issue in detail..."
                            required
                            className="min-h-[120px] resize-none"
                            disabled={isPending}
                        />
                    </div>

                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending} className="min-w-[100px]">
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Ticket'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
