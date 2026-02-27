'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Ticket,
    Users,
    Settings,
    LogOut,
    Bell,
    Menu,
    ChevronRight,
    Shield,
    LifeBuoy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { signOutAction } from '@/app/(auth)/actions';
import { useCurrentUser } from '@/hooks/use-current-user';
import { cn } from '@/lib/utils';
import { roleConfig } from '@/lib/constants';
import { type User as DomainUser } from '@/types';

interface DashboardShellProps {
    children: React.ReactNode;
    initialUser?: DomainUser;
}

export function DashboardShell({ children, initialUser }: DashboardShellProps) {
    const { user: hookedUser, loading } = useCurrentUser();
    const pathname = usePathname();

    const user = hookedUser || initialUser;

    const navigation = [
        {
            name: 'Overview',
            href: user?.role ? (roleConfig[user.role]?.dashboard || '#') : '#',
            icon: LayoutDashboard,
        },
        ...(user?.role === 'admin'
            ? [
                { name: 'Tickets', href: '/dashboard/admin', icon: Ticket },
                { name: 'Staff', href: '/dashboard/admin/staff', icon: Users },
            ]
            : []),
        ...(user?.role === 'team_member'
            ? [{ name: 'My Queue', href: '/dashboard/staff', icon: Ticket }]
            : []),
        ...(user?.role === 'customer'
            ? [{ name: 'My Tickets', href: '/dashboard/customer', icon: Ticket }]
            : []),
        { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ];

    const handleSignOut = () => {
        signOutAction();
    };

    return (
        <div className="flex min-h-screen bg-background">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 border-r border-border/50 bg-card/30 backdrop-blur-xl">
                <div className="flex h-16 items-center px-6 border-b border-border/50">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                            <Ticket className="h-4.5 w-4.5 text-primary-foreground" />
                        </div>
                        <span className="text-lg font-bold tracking-tight">TicketFlow</span>
                    </Link>
                </div>

                <nav className="flex-1 space-y-1 px-3 py-4">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group relative',
                                    isActive
                                        ? 'bg-primary/10 text-primary shadow-sm'
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        'h-4.5 w-4.5 transition-colors',
                                        isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                                    )}
                                />
                                {item.name}
                                {isActive && (
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border/50 bg-muted/20">
                    {(user || !loading) && (
                        <div className="flex items-center gap-3 px-2 py-1">
                            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0">
                                {user?.name?.[0]?.toUpperCase()}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-semibold truncate leading-none mb-1">
                                    {user?.name}
                                </span>
                                <span className="text-[10px] uppercase tracking-wider font-bold text-primary/70 leading-none">
                                    {user?.role === 'team_member' ? 'Staff' : (user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : '')}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 lg:pl-64 flex flex-col">
                {/* Top Header */}
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border/50 bg-background/60 backdrop-blur-xl px-4 lg:px-8">
                    <div className="flex items-center gap-4 lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-64 p-0 border-r-border/50">
                                <div className="flex h-16 items-center px-6 border-b border-border/50">
                                    <div className="flex items-center gap-2.5">
                                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                                            <Ticket className="h-4.5 w-4.5 text-primary-foreground" />
                                        </div>
                                        <span className="text-lg font-bold">TicketFlow</span>
                                    </div>
                                </div>
                                <nav className="p-4 space-y-1">
                                    {navigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={cn(
                                                'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg',
                                                pathname === item.href
                                                    ? 'bg-primary/10 text-primary'
                                                    : 'text-muted-foreground hover:bg-muted'
                                            )}
                                        >
                                            <item.icon className="h-5 w-5" />
                                            {item.name}
                                        </Link>
                                    ))}
                                </nav>
                            </SheetContent>
                        </Sheet>
                        <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
                                <Ticket className="h-4 w-4 text-primary-foreground" />
                            </div>
                            <span className="text-base font-bold">TicketFlow</span>
                        </div>
                    </div>

                    <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-full">
                            <Bell className="h-4.5 w-4.5" />
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 overflow-hidden border border-border/50">
                                    <div className="h-full w-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                        {user?.name?.[0]?.toUpperCase()}
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user?.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer">
                                    <Shield className="mr-2 h-4 w-4" />
                                    <span>Account Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                    <LifeBuoy className="mr-2 h-4 w-4" />
                                    <span>Support Center</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-destructive focus:text-destructive cursor-pointer"
                                    onClick={handleSignOut}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="flex-1 p-4 lg:p-8 overflow-auto">
                    <div className="mx-auto max-w-7xl animate-fade-in">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
