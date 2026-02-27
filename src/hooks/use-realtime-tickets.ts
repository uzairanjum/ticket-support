'use client';

import { useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Ticket } from '@/types';

type TicketChangeHandler = (payload: {
    eventType: 'INSERT' | 'UPDATE' | 'DELETE';
    new: Ticket;
    old: Partial<Ticket>;
}) => void;

export function useRealtimeTickets(
    onTicketChange: TicketChangeHandler,
    filter?: { column: string; value: string }
) {
    const stableOnChange = useCallback(onTicketChange, [onTicketChange]);

    useEffect(() => {
        const supabase = createClient();

        let channel = supabase.channel('tickets-realtime');

        const config: {
            event: '*';
            schema: 'public';
            table: 'tickets';
            filter?: string;
        } = {
            event: '*',
            schema: 'public',
            table: 'tickets',
        };

        if (filter) {
            config.filter = `${filter.column}=eq.${filter.value}`;
        }

        channel = channel.on(
            'postgres_changes',
            config,
            (payload) => {
                stableOnChange({
                    eventType: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
                    new: payload.new as Ticket,
                    old: payload.old as Partial<Ticket>,
                });
            }
        );

        channel.subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [stableOnChange, filter]);
}
