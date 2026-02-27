'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { useCurrentUser } from '@/hooks/use-current-user';
import type { Ticket } from '@/types';

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
    const { user } = useCurrentUser();
    const router = useRouter();

    useEffect(() => {
        const supabase = createClient();

        const channel = supabase
            .channel('tickets-realtime')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'tickets',
                },
                (payload) => {
                    const { eventType, new: newTicket, old: oldTicket } = payload;
                    const ticket = newTicket as Ticket;
                    const oldT = oldTicket as Partial<Ticket>;

                    if (eventType === 'INSERT') {
                        if (user?.role === 'admin' || (user?.role === 'customer' && ticket.created_by === user.id)) {
                            toast.info('New Ticket', {
                                description: `A new ticket has been created: ${ticket.description.slice(0, 50)}...`,
                            });
                        }
                    } else if (eventType === 'UPDATE') {
                        // Notify if status changed
                        if (oldT.status && oldT.status !== ticket.status) {
                            if (user?.id === ticket.created_by || user?.id === ticket.assign_to || user?.role === 'admin') {
                                toast.info('Status Updated', {
                                    description: `Ticket #${ticket.id} is now ${ticket.status}`,
                                });
                            }
                        }

                        // Notify if assigned
                        if (!oldT.assign_to && ticket.assign_to) {
                            if (user?.id === ticket.assign_to) {
                                toast.success('New Assignment', {
                                    description: `A new ticket has been assigned to you: ${ticket.description.slice(0, 50)}...`,
                                });
                            }
                        }
                    }

                    router.refresh();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, router]);

    return <>{children}</>;
}
