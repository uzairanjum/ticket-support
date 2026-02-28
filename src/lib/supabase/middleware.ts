import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@/types/database';

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient<Database>(
        " https://bnbspeurbxsnxxsphfco.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJuYnNwZXVyYnhzbnh4c3BoZmNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Nzk5NDYzOCwiZXhwIjoyMDgzNTcwNjM4fQ.mtnpAyrZAERcOHzaxbCnDU_y0vP5otsoOhtj0vh6qUs",
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const userIdStr = request.cookies.get('user_id')?.value;
    const userId = userIdStr ? parseInt(userIdStr, 10) : undefined;
    const { pathname } = request.nextUrl;

    // 1. If no user and trying to access protected route
    if (!userIdStr) {
        const publicRoutes = ['/login', '/signup', '/auth/callback', '/'];
        const isPublicRoute = publicRoutes.some(
            (route) => pathname === route || pathname.startsWith('/auth/')
        );

        if (!isPublicRoute) {
            const url = request.nextUrl.clone();
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }
    }

    // 2. If user is logged in, enforce role-based routing
    if (userId && pathname.startsWith('/dashboard')) {
        const { data: profile } = await supabase
            .from('users')
            .select('role')
            .eq('id', userId)
            .single();

        if (profile) {
            const role = profile.role as string;
            const roleRouteMap: Record<string, string> = {
                customer: '/dashboard/customer',
                admin: '/dashboard/admin',
                team_member: '/dashboard/staff',
            };

            const allowedRoute = roleRouteMap[role];

            if (allowedRoute && !pathname.startsWith(allowedRoute)) {
                const url = request.nextUrl.clone();
                url.pathname = allowedRoute;
                return NextResponse.redirect(url);
            }
        }
    }

    // 3. Redirect logged-in users from auth pages to their dashboard
    if (userId && (pathname === '/login' || pathname === '/signup')) {
        const { data: profile } = await supabase
            .from('users')
            .select('role')
            .eq('id', userId)
            .single();

        const role = (profile?.role as string) || 'customer';
        const roleRouteMap: Record<string, string> = {
            customer: '/dashboard/customer',
            admin: '/dashboard/admin',
            team_member: '/dashboard/staff',
        };

        const url = request.nextUrl.clone();
        url.pathname = roleRouteMap[role] || '/dashboard/customer';
        return NextResponse.redirect(url);
    }

    return supabaseResponse;
}
