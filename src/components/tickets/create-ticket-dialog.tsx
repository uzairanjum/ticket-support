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
import { Plus, Loader2, Ticket } from 'lucide-react';
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
                <Button className="gap-2 shadow-lg shadow-emerald-500/20 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 hover:scale-[1.02]">
                    <Plus className="h-4 w-4" />
                    New Ticket
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] border-0 bg-white/95 backdrop-blur-xl shadow-2xl shadow-black/10 rounded-2xl">
                <DialogHeader className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <Ticket className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-gray-900">Create Ticket</DialogTitle>
                            <DialogDescription className="text-sm text-gray-500">
                                Submit a new support request
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <form action={handleSubmit} className="space-y-5 pt-2">
                    <div className="space-y-2.5">
                        <Label htmlFor="ticket_type" className="text-sm font-medium text-gray-700">Ticket Type</Label>
                        <Select name="ticket_type" required defaultValue="Technical Issue">
                            <SelectTrigger id="ticket_type" className="h-11 bg-gray-50/50 border-gray-200/50 focus:ring-emerald-500 focus:border-emerald-500 rounded-xl">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-gray-100 shadow-xl shadow-black/5">
                                {Object.entries(typeConfig).map(([key, { label, icon }]) => (
                                    <SelectItem key={key} value={key} className="rounded-lg">
                                        <div className="flex items-center gap-2.5">
                                            <span className="text-sm">{icon}</span>
                                            <span>{label}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2.5">
                        <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Please describe your issue in detail..."
                            required
                            className="min-h-[120px] resize-none bg-gray-50/50 border-gray-200/50 focus:ring-emerald-500 focus:border-emerald-500 rounded-xl"
                            disabled={isPending}
                        />
                    </div>

                    <DialogFooter className="pt-2 gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isPending}
                            className="rounded-xl border-gray-200 hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={isPending} 
                            className="min-w-[120px] rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/25"
                        >
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
