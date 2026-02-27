'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Ticket, Loader2, Eye, EyeOff } from 'lucide-react';
import { signupAction } from '../actions';

export default function SignupPage() {
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [showPassword, setShowPassword] = useState(false);

    async function handleSubmit(formData: FormData) {
        setError(null);
        startTransition(async () => {
            const result = await signupAction(formData);
            if (result?.error) {
                setError(result.error);
            }
        });
    }

    return (
        <Card className="border-border/50 shadow-2xl shadow-primary/5 backdrop-blur-sm bg-card/95">
            <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/30">
                    <Ticket className="h-7 w-7 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight">Create your account</CardTitle>
                <CardDescription className="text-base">
                    Get started with TicketFlow
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
                <form action={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive font-medium animate-in fade-in slide-in-from-top-1">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                            Full Name
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="John Doe"
                            required
                            minLength={2}
                            maxLength={100}
                            className="h-11"
                            disabled={isPending}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                            Email
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            required
                            className="h-11"
                            disabled={isPending}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium">
                            Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                required
                                minLength={8}
                                className="h-11 pr-10"
                                disabled={isPending}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role" className="text-sm font-medium">
                            Account Type
                        </Label>
                        <Select name="role" required defaultValue="customer">
                            <SelectTrigger id="role" className="h-11" disabled={isPending}>
                                <SelectValue placeholder="Select your role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="customer">
                                    <div className="flex items-center gap-2">
                                        <span>👤</span>
                                        <span>Customer</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="admin">
                                    <div className="flex items-center gap-2">
                                        <span>🛡️</span>
                                        <span>Admin</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="team_member">
                                    <div className="flex items-center gap-2">
                                        <span>👨‍💻</span>
                                        <span>Staff Member</span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button type="submit" className="w-full h-11 text-sm font-semibold" disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating account...
                            </>
                        ) : (
                            'Create Account'
                        )}
                    </Button>
                </form>

                <div className="mt-6">
                    <Separator className="my-4" />
                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link
                            href="/login"
                            className="text-primary hover:text-primary/80 font-semibold transition-colors"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
