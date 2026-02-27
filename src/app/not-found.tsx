import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Ticket, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
            <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Ticket className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-6xl font-bold tracking-tight text-primary mb-2">404</h1>
            <h2 className="text-xl font-semibold mb-3">Page not found</h2>
            <p className="text-muted-foreground max-w-sm mb-8">
                The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <Button asChild className="gap-2">
                <Link href="/">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </Link>
            </Button>
        </div>
    );
}
