'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X, Filter } from 'lucide-react';
import { statusConfig, typeConfig } from '@/lib/constants';
import { useDebounce } from '@/hooks/use-debounce'; // Assuming this exists or I'll create it

export function TicketFiltersBar({
    showStatusFilter = false,
    showTypeFilter = false,
}: {
    showStatusFilter?: boolean;
    showTypeFilter?: boolean;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(searchParams.get('search') || '');
    const debouncedSearch = useDebounce(search, 300);

    const createQueryString = useCallback(
        (params: Record<string, string | null>) => {
            const newSearchParams = new URLSearchParams(searchParams.toString());

            for (const [key, value] of Object.entries(params)) {
                if (value === null || value === 'all') {
                    newSearchParams.delete(key);
                } else {
                    newSearchParams.set(key, value);
                }
            }

            // Always reset to page 1 when filtering
            newSearchParams.set('page', '1');

            return newSearchParams.toString();
        },
        [searchParams]
    );

    useEffect(() => {
        const currentSearch = searchParams.get('search') || '';
        if (debouncedSearch !== currentSearch) {
            const query = createQueryString({ search: debouncedSearch || null });
            router.push(`${pathname}?${query}`, { scroll: false });
        }
    }, [debouncedSearch, pathname, router, createQueryString, searchParams]);

    const handleFilterChange = (key: string, value: string) => {
        const query = createQueryString({ [key]: value });
        router.push(`${pathname}?${query}`, { scroll: false });
    };

    const clearFilters = () => {
        setSearch('');
        router.push(pathname);
    };

    const hasFilters = search || searchParams.get('status') || searchParams.get('type');

    return (
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-card p-4 rounded-xl border border-border/50 shadow-sm mb-6">
            <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by description..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 h-10 border-border/60 focus:border-primary/50 transition-colors"
                />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
                <div className="flex items-center gap-2">
                    {showStatusFilter && (
                        <Select
                            value={searchParams.get('status') || 'all'}
                            onValueChange={(v) => handleFilterChange('status', v)}
                        >
                            <SelectTrigger className="h-10 w-[130px] border-border/60">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                {Object.entries(statusConfig).map(([key, { label }]) => (
                                    <SelectItem key={key} value={key}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}

                    {showTypeFilter && (
                        <Select
                            value={searchParams.get('ticket_type') || 'all'}
                            onValueChange={(v) => handleFilterChange('ticket_type', v)}
                        >
                            <SelectTrigger className="h-10 w-[150px] border-border/60">
                                <SelectValue placeholder="Ticket Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                {Object.entries(typeConfig).map(([key, { label }]) => (
                                    <SelectItem key={key} value={key}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>

                {hasFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="h-10 px-3 text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-4 w-4 mr-2" />
                        Clear
                    </Button>
                )}
            </div>
        </div>
    );
}
