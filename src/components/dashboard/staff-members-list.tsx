'use client';

import { formatDistanceToNow } from 'date-fns';
import { Mail, Calendar, MoreVertical, UserCheck, Search } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

interface StaffMember {
    id: number;
    name: string;
    email: string | null;
    created_at?: string;
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

const gradients = [
    'from-violet-500 to-purple-600',
    'from-blue-500 to-cyan-600',
    'from-emerald-500 to-teal-600',
    'from-orange-500 to-red-600',
    'from-pink-500 to-rose-600',
    'from-indigo-500 to-blue-600',
    'from-amber-500 to-yellow-600',
    'from-cyan-500 to-blue-600',
];

function getGradient(index: number): string {
    return gradients[index % gradients.length];
}

export function StaffMembersList({ staffMembers }: { staffMembers: StaffMember[] }) {
    const [search, setSearch] = useState('');

    const filteredMembers = staffMembers.filter(
        (member) =>
            member.name.toLowerCase().includes(search.toLowerCase()) ||
            member.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-tight">Team Members</h2>
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search members..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 h-9 text-sm border-border/60"
                    />
                </div>
            </div>

            {filteredMembers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 border rounded-xl bg-card/50 border-dashed">
                    <div className="h-14 w-14 rounded-full bg-muted/80 flex items-center justify-center mb-4">
                        <UserCheck className="h-7 w-7 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">
                        {search ? 'No matching staff members' : 'No staff members found'}
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                        {search ? 'Try refining your search' : 'Team members with the "team_member" role will appear here'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredMembers.map((member, index) => (
                        <div
                            key={member.id}
                            className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm p-5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20"
                        >
                            {/* Decorative gradient bar */}
                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getGradient(index)} opacity-60 group-hover:opacity-100 transition-opacity`} />

                            <div className="flex items-start gap-4">
                                {/* Avatar with gradient */}
                                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${getGradient(index)} flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-primary/10 shrink-0 transition-transform duration-300 group-hover:scale-105`}>
                                    {getInitials(member.name)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-semibold truncate">{member.name}</h3>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                                            <UserCheck className="h-2.5 w-2.5" />
                                            Staff
                                        </span>
                                    </div>

                                    <div className="mt-3 space-y-1.5">
                                        {member.email && (
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Mail className="h-3 w-3 shrink-0" />
                                                <span className="truncate">{member.email}</span>
                                            </div>
                                        )}
                                        {member.created_at && (
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Calendar className="h-3 w-3 shrink-0" />
                                                <span>Joined {formatDistanceToNow(new Date(member.created_at), { addSuffix: true })}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Status indicator */}
                            <div className="absolute top-4 right-4">
                                <div className="flex items-center gap-1.5">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                                    <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">Active</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
