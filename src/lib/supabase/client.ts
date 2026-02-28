'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

let client: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
    if (client) return client;

    client = createBrowserClient<Database>(
       " https://bnbspeurbxsnxxsphfco.supabase.co",
       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJuYnNwZXVyYnhzbnh4c3BoZmNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Nzk5NDYzOCwiZXhwIjoyMDgzNTcwNjM4fQ.mtnpAyrZAERcOHzaxbCnDU_y0vP5otsoOhtj0vh6qUs",
    );

    return client;
}
