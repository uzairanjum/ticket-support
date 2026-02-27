'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { loginSchema, signupSchema } from '@/lib/validations';
import { roleConfig } from '@/lib/constants';
import { type UserRole } from '@/types';

export async function loginAction(formData: FormData) {
    const supabase = await createClient();

    const rawData = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    };

    const result = loginSchema.safeParse(rawData);
    if (!result.success) {
        const firstIssue = result.error.issues?.[0];
        return { error: firstIssue?.message || 'Validation failed' };
    }

    const { data: userData, error: loginError } = await supabase
        .from('users')
        .select('*')
        .eq('email', result.data.email)
        .eq('password', result.data.password)
        .single();

    if (loginError || !userData) {
        return { error: 'Invalid email or password' };
    }

    const cookieStore = await cookies();
    cookieStore.set('user_id', String(userData.id), {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    const role = (userData.role as UserRole) || 'customer';
    const dashboard = roleConfig[role]?.dashboard || roleConfig.customer.dashboard;
    redirect(dashboard);
}

export async function signupAction(formData: FormData) {
    const supabase = await createClient();

    const rawData = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        role: formData.get('role') as string,
    };

    const result = signupSchema.safeParse(rawData);
    if (!result.success) {
        const firstIssue = result.error.issues?.[0];
        return { error: firstIssue?.message || 'Validation failed' };
    }

    const { data: userData, error: signupError } = await supabase
        .from('users')
        .insert({
            name: result.data.name,
            email: result.data.email,
            password: result.data.password,
            role: result.data.role as 'customer' | 'admin' | 'team_member',
        })
        .select()
        .single();

    if (signupError || !userData) {
        return { error: signupError?.message || 'Signup failed' };
    }

    const cookieStore = await cookies();
    cookieStore.set('user_id', String(userData.id), {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    const role = (result.data.role as UserRole) || 'customer';
    const dashboard = roleConfig[role]?.dashboard || roleConfig.customer.dashboard;
    redirect(dashboard);
}

export async function signOutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('user_id');
    redirect('/login');
}
