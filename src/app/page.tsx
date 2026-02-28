import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Ticket, ArrowRight, Shield, Zap, Users, BarChart3 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -right-[20%] h-[80%] w-[60%] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-[40%] -left-[20%] h-[80%] w-[60%] rounded-full bg-primary/3 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-5 border-b border-border/50 bg-background/60 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
            <Ticket className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">TicketFlow</span>
        </Link>
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild className="font-medium">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild className="shadow-lg shadow-primary/20 font-semibold">
            <Link href="/signup" className="gap-2">
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 lg:px-12 py-24 lg:py-36 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
          <Zap className="h-3.5 w-3.5" />
          Enterprise-grade ticketing made simple
        </div>
        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
          Streamline your support with{' '}
          <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
            TicketFlow
          </span>
        </h1>
        <p className="mt-6 text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          A modern, multi-role ticketing platform with realtime updates, role-based access control,
          and a beautiful interface that your team will love.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Button asChild size="lg" className="h-12 px-8 text-base font-semibold shadow-xl shadow-primary/25 hover:shadow-primary/35 transition-all">
            <Link href="/signup" className="gap-2">
              Start Free <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="h-12 px-8 text-base font-semibold">
            <Link href="/login">Log in</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 lg:px-12 pb-24 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Shield,
              title: 'Enterprise Security',
              desc: 'Row-level security, RBAC, and encrypted sessions keep your data safe.',
            },
            {
              icon: Zap,
              title: 'Realtime Updates',
              desc: 'Instant ticket updates across all dashboards without page refresh.',
            },
            {
              icon: Users,
              title: 'Multi-role Access',
              desc: 'Customer, Admin, and Team Member views with isolated permissions.',
            },
            {
              icon: BarChart3,
              title: 'Analytics Ready',
              desc: 'Built-in stats and designed for future analytics integration.',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="group relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-7 transition-all duration-300 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 px-6 lg:px-12 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Ticket className="h-4 w-4" />
            <span className="font-medium">TicketFlow</span>
          </div>
          <p>© 2026 TicketFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
