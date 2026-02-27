# 🎫 TicketFlow — Production-Grade SaaS Ticketing Platform

A modern, multi-role ticketing platform built with **Next.js 14+**, **TypeScript**, **Supabase**, **Tailwind CSS**, and **shadcn/ui**. Features realtime updates, role-based access control, and enterprise-grade security.

---

## 🏗️ Architecture

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group
│   │   ├── login/page.tsx        # Login page
│   │   ├── signup/page.tsx       # Signup page
│   │   ├── actions.ts            # Auth server actions
│   │   └── layout.tsx            # Auth layout (centered, decorative bg)
│   ├── (dashboard)/              # Dashboard route group
│   │   ├── dashboard/
│   │   │   ├── customer/         # Customer dashboard
│   │   │   ├── admin/            # Admin dashboard
│   │   │   └── team/             # Team member dashboard
│   │   ├── actions.ts            # Ticket server actions
│   │   └── layout.tsx            # Dashboard layout (sidebar shell)
│   ├── auth/callback/route.ts    # OAuth callback handler
│   ├── error.tsx                 # Global error boundary
│   ├── loading.tsx               # Global loading state
│   ├── not-found.tsx             # 404 page
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Design system
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── dashboard/                # Dashboard-specific components
│   │   ├── dashboard-shell.tsx   # Sidebar + navigation shell
│   │   └── stats-card.tsx        # Stats card component
│   ├── tickets/                  # Ticket-related components
│   │   ├── status-badges.tsx     # Status, Priority, Type badges
│   │   ├── ticket-table.tsx      # Ticket data table
│   │   ├── ticket-filters.tsx    # Filter bar
│   │   ├── create-ticket-dialog.tsx
│   │   ├── assign-ticket-dialog.tsx
│   │   ├── update-status-select.tsx
│   │   └── pagination.tsx
│   └── realtime-provider.tsx     # Realtime subscription wrapper
├── hooks/
│   ├── use-realtime-tickets.ts   # Supabase Realtime hook
│   └── use-current-user.ts       # Auth state hook
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser Supabase client
│   │   ├── server.ts             # Server Supabase client
│   │   └── middleware.ts         # Session + RBAC middleware helper
│   ├── constants.ts              # UI configuration constants
│   ├── validations.ts            # Zod schemas
│   └── utils.ts                  # Utility functions
├── services/
│   └── tickets.ts                # Data access layer (server-side)
├── types/
│   ├── index.ts                  # Domain models & DTOs
│   └── database.ts               # Supabase DB types
└── middleware.ts                 # Next.js middleware entry
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** 9+
- A [Supabase](https://supabase.com) project

### 1. Clone & Install

```bash
cd ticketing
npm install
```

### 2. Configure Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Set Up Database

1. Go to your Supabase project → **SQL Editor**
2. Paste the contents of `supabase/schema.sql`
3. Click **Run** to create tables, indexes, RLS policies, and triggers

### 4. Enable Realtime

In Supabase Dashboard:
1. Go to **Database** → **Replication**
2. Enable replication for the `tickets` table
3. (The SQL script already runs `ALTER PUBLICATION supabase_realtime ADD TABLE public.tickets`)

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 👤 Roles & Permissions

| Role          | Dashboard           | Can Do                                           |
|--------------|---------------------|--------------------------------------------------|
| **Customer** | `/dashboard/customer` | Create tickets, view own tickets                |
| **Admin**    | `/dashboard/admin`    | View all, assign tickets, update status          |
| **Team Member** | `/dashboard/team`  | View assigned, update status (assigned→resolved→closed) |

### RBAC Enforcement

- **Middleware**: Route-level protection (redirects unauthorized users)
- **RLS Policies**: Database-level protection (enforced by Supabase)
- **Server Actions**: Additional role checks before mutations

---

## 🔒 Security

- **Row Level Security (RLS)**: All tables use strict RLS policies
- **No service_role key on frontend**: Only `anon` key is exposed
- **Zod validation**: All inputs validated on server
- **Secure cookies**: Managed by `@supabase/ssr`
- **CSRF protection**: Built into Supabase sessions
- **Input sanitization**: Via Zod `transform` and `check`

---

## 🔁 Realtime

Tickets table is subscribed via Supabase Realtime channels:
- New ticket creation → toast notification
- Ticket assignment → toast notification
- Status updates → toast notification + auto-refresh

---

## 🎨 Design

- **Color palette**: Refined purple-tinted neutral palette
- **Status**: Amber (open), Blue (assigned), Green (resolved), Gray (closed)
- **Typography**: Inter font family
- **Components**: shadcn/ui with custom styling
- **Animations**: Fade-in, slide-up, pulse effects
- **Responsive**: Mobile-first with sidebar drawer

---

## 📦 Tech Stack

| Tech | Purpose |
|------|---------|
| Next.js 14+ | App Router, Server Components, Server Actions |
| TypeScript | Strict type safety |
| Supabase | Auth, Postgres, RLS, Realtime |
| Tailwind CSS | Utility-first styling |
| shadcn/ui | Premium UI components |
| Zod | Runtime validation |
| Lucide React | Icons |
| date-fns | Date formatting |

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Supabase Production

1. Enable email confirmations (optional)
2. Set up custom SMTP for auth emails
3. Configure rate limiting
4. Set up database backups

---

## 📈 Future Roadmap

- [ ] Ticket comments / threaded replies
- [ ] File attachments (Supabase Storage)
- [ ] SLA tracking & alerts
- [ ] Analytics dashboard
- [ ] Email notifications
- [ ] Audit log
- [ ] Dark mode toggle
- [ ] Bulk operations
- [ ] Export to CSV

---

## License

MIT
