import { Ticket, Loader2 } from 'lucide-react';

export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <div className="relative">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Ticket className="h-8 w-8 text-primary" />
                </div>
                <div className="absolute -bottom-1 -right-1">
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                </div>
            </div>
            <p className="text-sm text-muted-foreground font-medium">Loading...</p>
        </div>
    );
}
