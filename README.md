# LiveScore — Football Live Scores

A modern, premium football live score web app built with Next.js 15+, TypeScript, Tailwind CSS, Shadcn/ui, and Supabase.

## Features

- **Live Matches** — Real-time scores with auto-refresh (15-30s intervals)
- **Fixtures** — Browse matches by date with a date switcher
- **Match Details** — Full match page with events timeline, lineups, statistics
- **Standings** — League tables for top European leagues
- **Search** — Find teams and leagues instantly
- **Favorites** — Save favorite teams and leagues (requires Supabase auth)
- **Authentication** — Sign up / sign in with Supabase Auth
- **Dashboard** — Personal dashboard with favorite teams and leagues
- **Dark Theme** — Premium dark sports UI, mobile-first design
- **Mock Data** — Works without an API key using built-in mock data

## Tech Stack

- **Next.js 16** (App Router, Server Components)
- **TypeScript**
- **Tailwind CSS 4**
- **Shadcn/ui** (base-nova style)
- **Supabase** (Auth + Database)
- **TanStack React Query** (data fetching + caching)
- **Lucide Icons**
- **date-fns**

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:

| Variable | Description |
|----------|-------------|
| `FOOTBALL_API_KEY` | API key from [api-football.com](https://www.api-football.com/) (optional — app works with mock data) |
| `FOOTBALL_API_HOST` | API host (default: `v3.football.api-sports.io`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL (optional for basic browsing) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key (optional for basic browsing) |

### 3. Set up Supabase (optional)

If you want auth and favorites:

1. Create a [Supabase project](https://supabase.com)
2. Run the SQL schema in `supabase/schema.sql` in the Supabase SQL editor
3. Add your Supabase URL and anon key to `.env.local`

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/football/       # API route handlers (server-side)
│   ├── auth/               # Sign in / Sign up pages
│   ├── dashboard/          # User dashboard
│   ├── fixtures/           # Fixtures by date
│   ├── live/               # Live matches
│   ├── match/[id]/         # Match details
│   ├── search/             # Search teams & leagues
│   ├── standings/          # League standings
│   └── page.tsx            # Homepage
├── components/             # Reusable UI components
│   ├── ui/                 # Shadcn/ui primitives
│   ├── match-card.tsx      # Match score card
│   ├── match-list.tsx      # Grouped match list
│   ├── navbar.tsx          # Top navigation
│   ├── footer.tsx          # Footer
│   ├── standings-table.tsx # Standings table
│   ├── search-bar.tsx      # Search input
│   └── ...
├── hooks/                  # Custom React hooks
│   ├── use-auth.ts         # Supabase auth hook
│   └── use-favorites.ts   # Favorites CRUD hooks
├── lib/                    # Utilities & config
│   ├── supabase/           # Supabase client setup
│   ├── providers.tsx       # React Query provider
│   └── utils.ts            # cn() utility
├── services/               # API service layer
│   ├── football.ts         # Unified service (API + fallback)
│   ├── football-api.ts     # Real API client with mappers
│   └── mock-data.ts        # Mock/seed data
└── types/                  # TypeScript type definitions
    └── football.ts         # All football data types
supabase/
└── schema.sql              # Database schema + RLS policies
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with live/today/upcoming/finished tabs |
| `/live` | All live matches with auto-refresh |
| `/fixtures` | Fixtures by date with date picker |
| `/match/[id]` | Match details (events, lineups, stats) |
| `/standings` | League standings table |
| `/search` | Search teams and leagues |
| `/dashboard` | User favorites dashboard |
| `/auth/sign-in` | Sign in page |
| `/auth/sign-up` | Sign up page |

## Football API

The app uses [API-Football](https://www.api-football.com/) by default. The API layer is abstracted so you can swap providers:

- `services/football-api.ts` — Raw API calls with typed mappers
- `services/football.ts` — Unified service with mock fallback
- `services/mock-data.ts` — Mock data for development

All API calls go through Next.js API route handlers (`/api/football/*`) to keep your API key server-side.

## License

MIT
