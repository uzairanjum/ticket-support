import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/services/tickets';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Shield, User, Mail, Bell, Lock } from 'lucide-react';

export default async function SettingsPage() {
    const profile = await getCurrentProfile();

    if (!profile) {
        redirect('/login');
    }

    const initials = profile.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-1">
                    Manage your account settings and preferences.
                </p>
            </div>

            <div className="grid gap-6">
                {/* Profile Section */}
                <Card className="border-border/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" />
                            Profile Information
                        </CardTitle>
                        <CardDescription>
                            Update your personal details and how others see you.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-6 pb-4">
                            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-primary/20">
                                {initials}
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-semibold text-lg">{profile.name}</h3>
                                <p className="text-sm text-muted-foreground">{profile.email}</p>
                                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider mt-2">
                                    <Shield className="h-3 w-3" />
                                    {profile.role === 'team_member' ? 'Staff' : profile.role}
                                </div>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" defaultValue={profile.name} disabled />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input id="email" className="pl-9" defaultValue={profile.email} disabled />
                                </div>
                            </div>
                        </div>
                        <Button variant="outline" disabled>Update Profile</Button>
                    </CardContent>
                </Card>

                {/* Security Section */}
                <Card className="border-border/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="h-5 w-5 text-primary" />
                            Security
                        </CardTitle>
                        <CardDescription>
                            Manage your password and account security.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/30">
                            <div className="space-y-0.5">
                                <p className="text-sm font-medium">Password</p>
                                <p className="text-xs text-muted-foreground">Last changed 2 months ago</p>
                            </div>
                            <Button variant="outline" size="sm">Change Password</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Notifications Section */}
                <Card className="border-border/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-primary" />
                            Notifications
                        </CardTitle>
                        <CardDescription>
                            Configure how you receive updates about your tickets.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground italic">Notification preferences are coming soon.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
