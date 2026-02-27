import { redirect } from 'next/navigation';
import {
    getCurrentProfile,
    getStaffMembers,
} from '@/services/tickets';
import { StaffMembersList } from '@/components/dashboard/staff-members-list';
import { RealtimeProvider } from '@/components/realtime-provider';
import { StatsCard } from '@/components/dashboard/stats-card';
import { Users, Shield, UserCheck } from 'lucide-react';

export default async function AdminStaffPage() {
    const profile = await getCurrentProfile();

    if (!profile || profile.role !== 'admin') {
        redirect('/login');
    }

    const staffMembers = await getStaffMembers();

    return (
        <RealtimeProvider>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
                    <p className="text-muted-foreground mt-1 text-lg">
                        View and manage your team members. Staff members can be assigned tickets from the main dashboard.
                    </p>
                </div>

                {/* Staff Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatsCard
                        title="Total Staff"
                        value={staffMembers.length}
                        icon={<Users className="h-5 w-5 text-primary" />}
                    />
                    <StatsCard
                        title="Active"
                        value={staffMembers.length}
                        icon={<UserCheck className="h-5 w-5 text-blue-500" />}
                        color="text-blue-600"
                    />
                    <StatsCard
                        title="Team Role"
                        value={staffMembers.length > 0 ? staffMembers.length : 0}
                        icon={<Shield className="h-5 w-5 text-emerald-500" />}
                        color="text-emerald-600"
                    />
                </div>

                {/* Staff List */}
                <div className="pt-4">
                    <StaffMembersList staffMembers={staffMembers} />
                </div>
            </div>
        </RealtimeProvider>
    );
}
