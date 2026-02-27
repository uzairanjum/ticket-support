import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
    const supabase = await createClient();
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if (!userId) {
        return NextResponse.json({ user: null });
    }

    const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', parseInt(userId, 10))
        .single();

    if (error || !profile) {
        return NextResponse.json({ user: null });
    }

    return NextResponse.json({
        user: {
            id: profile.id,
            name: profile.name,
            role: profile.role,
            email: profile.email,
            created_at: profile.created_at,
        },
    });
}
