# CreatorSuite

An all-in-one creator monetization suite — specialized micro-tools for calculating,
predicting, and optimizing creator business income. Built in Nothing's **Dot Matrix**
design language (black/white + red accent). See [CreatorSuite.md](CreatorSuite.md) for the
full specification.

## Stack

- **Next.js 16** (App Router) + React 19 + TypeScript (strict)
- **Tailwind v4** — custom Dot Matrix token system (CSS `@theme`)
- **Supabase** — Postgres + RLS for estimates, rate cards, editable benchmarks
- **NextAuth (Auth.js v5)** — optional Google OAuth via the Supabase adapter
- **@react-pdf/renderer** — branded per-tool + combined Rate Card PDFs
- **Google AdSense** — manual units only (sidebar / between-section / mobile banner)

The app **runs credential-free**: benchmarks fall back to a local seed bundle, and
auth / persistence / ads degrade gracefully (placeholders) when env vars are absent.

## v1.0 tools (7)

Sponsorship Rate Estimator · YouTube AdSense & RPM Predictor · UGC Rate Calculator ·
Patreon / Membership Tier Planner · Digital Product Launch Calculator ·
"Quit Your Job" Milestone Tracker · AI Output Cost Estimator

## Getting started

```bash
npm install
cp .env.local.example .env.local   # fill in keys (optional — app runs without them)
npm run dev                        # http://localhost:3000
```

### Connect Supabase + auth + ads

1. Create a Supabase project and run [supabase/migrations/0001_init.sql](supabase/migrations/0001_init.sql)
   in the SQL editor (creates the NextAuth schema, app tables, and RLS).
2. Fill `.env.local` (see `.env.local.example`): Supabase URL + anon + service keys,
   Google OAuth client id/secret, `NEXTAUTH_SECRET`, `ADMIN_EMAILS`, and AdSense client +
   slot ids.
3. Set your email in `ADMIN_EMAILS` to access `/admin` (benchmark editor + tool toggles).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Vitest unit tests (calculator formulas) |

## Architecture notes

- **One file per tool** — `lib/tools/<slug>/calc.ts` (pure `calculate()` + `buildReport()`
  + `meta`) and `Tool.tsx` (client view). Registered in `lib/tools/index.ts` and
  `components/tool/ToolHost.tsx`. Adding a tool = a new folder + two registry lines.
- **Benchmarks** are accessed via the single `getBenchmarks()` server function. The MVP
  stores the editable bundle as one JSONB document (`benchmarks` table); see the
  `CREATORSUITE-TODO` to normalize into the per-table design later.
- Estimates / formulas are estimates only — **not financial advice**.
