# CreatorSuite — Master Specification

> An All-in-One Creator Monetization Suite: 21 specialized micro-tools for calculating,
> predicting, and optimizing creator business income. Hosted on Vercel's free tier (Next.js),
> styled in Nothing's Dot Matrix design language (black/white + red accent), optional Google auth,
> Supabase persistence, curated benchmark enrichment, per-tool branded PDF export, and Google AdSense
> low-profile manual placement.
>
> **This document is the single source of truth for Claude Code.**
> Build in the phase order given. Every phase ends in a deployable, demoable app on Vercel.
> Do not pull later-phase tools forward. When unspecified, prefer the simplest correct implementation
> and leave a `// CREATORSUITE-TODO` marker.

---

## 0. Project Identity

| Field | Value |
|---|---|
| **Name** | CreatorSuite |
| **Domain** | `creatorsuite.vercel.app` (free Vercel domain) |
| **Platform** | Web app — Vercel free tier |
| **Framework** | Next.js (App Router) |
| **Target users** | Solo micro-influencers AND mid-tier creators (~100K–1M). Tools serve both depending on inputs. |
| **Monetization** | Google AdSense — manual placement, low-profile, never inside forms |
| **Greenfield** | Yes — fresh repo |

---

## 1. Non-Negotiable Pillars

1. **Dot Matrix design language** — Nothing's aesthetic: NDot-inspired, black/white/red, high-contrast grid, pixelated precision. No compromise.
2. **Hybrid data** — user inputs their own real stats; app enriches with curated benchmark ranges per niche.
3. **Layered persistence** — anonymous users get last-input memory (localStorage); signed-in users get full history + saved rate card.
4. **Low-profile AdSense** — sidebar + between-section placement only. Never inside a calculator form. Never interrupting a workflow.
5. **Branded PDF export** — every tool exports a professional CreatorSuite-branded PDF (rate card quality).
6. **Phased rollout** — MVP is 7 tools; v1.x and v2.x add the remaining 14 on a versioned roadmap.

---

## 2. Technology Stack

### 2.1 Framework & Hosting
- **Next.js 14+** (App Router). Vercel free tier deployment.
- Serverless API routes (`/app/api/`) for: benchmark data serving, PDF generation, admin operations.
- Edge-compatible where possible.

### 2.2 Database & Auth
- **Supabase** — Postgres database + Row Level Security (RLS) for user data isolation.
- **NextAuth.js** (Auth.js v5) — optional Google OAuth sign-in. Session stored in Supabase via NextAuth adapter.
- Supabase free tier is sufficient: 500MB DB, 2GB bandwidth, 50MB file storage.

### 2.3 Persistence model
| User state | Storage | What's saved |
|---|---|---|
| **Anonymous (not signed in)** | `localStorage` (client-side) | Last inputs per tool only. Pre-fills on return visit. |
| **Signed in** | Supabase (server-side) | Full history of estimates per tool (named + dated sessions) |
| **Signed in** | Supabase | One **saved Rate Card** — curated set of tool outputs the user assembles and revisits as a document |

### 2.4 Styling
- **Tailwind CSS** — primary styling. Custom Tailwind config implementing the Dot Matrix token system (§4).
- No component library — the Dot Matrix language is too distinctive for generic UI kits. Build components from scratch.
- CSS variables for the color/grid system.

### 2.5 PDF Export
- **`@react-pdf/renderer`** (React-PDF) — generate branded PDFs client-side or via serverless function.
- Each tool has its own PDF template (CreatorSuite branded, carries the Dot Matrix aesthetic into print).

### 2.6 Benchmark data layer
- Curated benchmark ranges stored in a **Supabase table** (`benchmarks`), editable via the admin dashboard (§7) without a code deploy.
- Served to the client via a `/api/benchmarks` route; cached at the edge.

### 2.7 AdSense
- Google AdSense script loaded globally.
- **Manual ad units only** — no auto-ads. Placements defined at the layout level (§6).

---

## 3. Tool Inventory & Phasing

### Phase v1.0 — MVP (7 tools)

| # | Tool | Category |
|---|---|---|
| 1 | Sponsorship Rate Estimator | Brand Deals |
| 2 | YouTube AdSense & RPM Predictor | Ad Revenue |
| 3 | UGC Rate Calculator | Brand Deals |
| 4 | Patreon / Membership Tier Planner | Audience Funnels |
| 5 | Digital Product (E-book / Course) Launch Calculator | Audience Funnels |
| 6 | Creator "Quit Your Job" Milestone Tracker | Business Ops |
| 7 | AI Output Cost Estimator | Content Production |

### Phase v1.1

| # | Tool | Category |
|---|---|---|
| 8 | Affiliate ROI Predictor | Brand Deals |
| 9 | Usage Rights Multiplier | Brand Deals |
| 10 | Multi-Platform Bundler | Brand Deals |
| 11 | Blog & Website RPM Forecaster | Ad Revenue |

### Phase v1.2

| # | Tool | Category |
|---|---|---|
| 12 | TikTok Creator Rewards Program Estimator | Ad Revenue |
| 13 | Short-Form Shorts / Reels Estimator | Ad Revenue |
| 14 | Podcast Audio Ad Calculator | Ad Revenue |
| 15 | Paid Newsletter / Substack Simulator | Audience Funnels |

### Phase v2.0 — Full suite (all 21 live)

| # | Tool | Category |
|---|---|---|
| 16 | Community Churn Rate Calculator | Audience Funnels |
| 17 | Expense & Gear Depreciation Calculator | Business Ops |
| 18 | Self-Employment Tax Withholding Estimator | Business Ops |
| 19 | Agency / Manager Commission Calculator | Business Ops |
| 20 | Hook Retention Value Estimator | Content Production |
| 21 | Repurposing Velocity Calculator | Content Production |

---

## 4. Design System — Nothing Dot Matrix Language

**Mandate: Follow Nothing's Dot Matrix design language faithfully. High-contrast, pixelated, grid-based, technical, minimal. No rounded softness. No gradients. Precision only.**

### 4.1 Typography

- **Primary display font:** `Silkscreen` (Google Fonts) — pixel/bitmap dot matrix, closest free equivalent to NDot. Use for headings, labels, tool names, numerical outputs.
- **Secondary mono font:** `Share Tech Mono` (Google Fonts) — clean technical mono for body copy, input labels, benchmark data, legal/small text.
- **Font scale:** strictly defined, not fluid — pixel-precise sizes matching the dot grid (12px, 16px, 24px, 32px, 48px, 64px).
- Never mix serif or humanist fonts. Mono + pixel only.

### 4.2 Color System

| Token | Value | Usage |
|---|---|---|
| `--cs-bg` | `#000000` | Page background |
| `--cs-surface` | `#0A0A0A` | Card / tool panel surface |
| `--cs-border` | `#1A1A1A` | Borders, grid lines |
| `--cs-fg` | `#FFFFFF` | Primary text, labels |
| `--cs-fg-muted` | `#666666` | Secondary text, placeholders |
| `--cs-fg-dim` | `#333333` | Disabled, hints |
| `--cs-accent` | `#FF0000` | Nothing red — active state, key values, CTAs, dot indicators |
| `--cs-accent-dim` | `#660000` | Hovered/dimmed red |
| `--cs-success` | `#FFFFFF` | Positive results (white, not green) |
| `--cs-warn` | `#FF0000` | Warnings (red) |

**Strict black → white spectrum, red accent for active/highlight states only.** No other colors.

### 4.3 Grid & Layout

- **Dot grid background texture** — subtle dot matrix pattern (CSS radial-gradient dots) on the page background. Evokes Nothing's design language.
- **8px base grid** — all spacing, sizing, and layout in multiples of 8px.
- **Sharp corners only** — `border-radius: 0`. Nothing's aesthetic is angular. No pill buttons, no rounded cards.
- **Visible borders** — components are delineated by hard pixel borders (`1px solid var(--cs-border)`), not shadows.
- **Monospace grid layout** — tool panels are grid-aligned, evenly spaced, technically precise.

### 4.4 Components

- **Input fields:** pixel-bordered, mono font, white caret, red focus ring (`2px solid var(--cs-accent)`).
- **Buttons:** sharp rectangle, uppercase label in Silkscreen. Primary = white bg / black text. Secondary = outline. Destructive = red.
- **Sliders:** custom styled to dot-matrix aesthetic — track is a dotted line, thumb is a small square.
- **Result cards:** high-contrast readout panels. Main result number in large Silkscreen, red accent dot beside it.
- **Tool cards (grid):** bordered, sharp, hover = `border-color: var(--cs-accent)`.
- **Navigation:** top bar — CreatorSuite wordmark in Silkscreen, tool category links in Share Tech Mono.
- **Dot indicators:** small filled red square `■` used as bullet / active indicator throughout. Nothing's signature.

### 4.5 Motion

- Minimal. Only functional animation.
- Result reveal: numeric outputs count up on calculate (fast, ~300ms).
- Transitions: instant or 100ms maximum. No easing curves — cuts only, matching the digital aesthetic.
- No decorative animations.

---

## 5. Tool Specifications (v1.0 MVP — build all 7 before any v1.1 work)

> Each tool follows the same structural pattern: **Inputs → Benchmark Enrichment → Calculate → Result Panel → PDF Export.**
> All tools are single-page (no multi-step wizard in v1). Inputs pre-fill from last session (anonymous) or history (signed in).

### 5.1 Sponsorship Rate Estimator
**Purpose:** Calculate a flat-fee sponsorship rate based on channel performance and niche.

**Inputs:**
- Monthly average views (number)
- Engagement rate % (number, with benchmark tooltip)
- Niche (dropdown — see §8 niche list)
- Platform (YouTube / TikTok / Instagram / Multi)
- Deliverable type (Dedicated video / Integration / Story / Reel / Post)

**Benchmark enrichment:** Average CPM ranges and engagement benchmarks per niche, loaded from the benchmark DB.

**Formula:**
- Base rate = (avg views × niche CPM factor) / 1000
- Engagement multiplier applied if engagement > niche average
- Deliverable multiplier: Dedicated = 1.5×, Integration = 1×, Story = 0.4×, Reel/Short = 0.6×

**Output:** Suggested flat fee (low / mid / high range), benchmark comparison, "your rate vs. average for this niche."

---

### 5.2 YouTube AdSense & RPM Predictor
**Purpose:** Simulate monthly AdSense revenue based on video length, views, and geography.

**Inputs:**
- Monthly video views (number)
- Average video length (under 8 min / over 8 min — mid-roll toggle)
- % US traffic (slider 0–100)
- Niche (dropdown)

**Benchmark enrichment:** RPM ranges by niche + geography from benchmark DB.

**Formula:**
- Base RPM = niche RPM × geography weight (US traffic % × US premium factor + RoW %)
- Mid-roll bonus: +40% RPM multiplier for videos >8min (mid-rolls enabled)
- Revenue = (views / 1000) × blended RPM

**Output:** Estimated monthly revenue, RPM used, mid-roll uplift shown separately.

---

### 5.3 UGC Rate Calculator
**Purpose:** Help micro-influencers price raw video assets for brand use.

**Inputs:**
- Number of video deliverables
- Usage rights type (Organic only / 30-day whitelist / 90-day whitelist / 12-month whitelist / Buyout)
- Platforms included (checkboxes: TikTok / Meta / YouTube / All)
- Revision rounds included (0 / 1 / 2 / unlimited)
- Exclusivity? (toggle — adds premium)

**Benchmark enrichment:** Market UGC rate ranges per usage tier.

**Formula:**
- Base per-video rate (from benchmark, by usage tier)
- Platform multiplier (multi-platform = +20%)
- Revision multiplier (each round = +10%)
- Exclusivity premium = +25%
- Deliverables × final rate

**Output:** Rate per video, package rate, usage rights breakdown.

---

### 5.4 Patreon / Membership Tier Planner
**Purpose:** Model total monthly recurring revenue across community tiers minus platform fees.

**Inputs:**
- Up to 5 tiers: name, price/month, estimated member count (dynamic add/remove rows)
- Platform (Patreon / YouTube Memberships / Substack / Other)
- Platform fee % (pre-filled by platform, editable)

**Formula:**
- Gross MRR = Σ (tier price × member count)
- Net MRR = Gross MRR × (1 - platform fee %)
- Annual projection = Net MRR × 12

**Output:** Per-tier breakdown, gross vs net MRR, annual projection, platform fee cost in $.

---

### 5.5 Digital Product (E-book / Course) Launch Calculator
**Purpose:** Predict launch revenue based on traffic, conversion, and checkout behavior.

**Inputs:**
- Sales page traffic (number)
- Sales page conversion rate % (with benchmark by product type)
- Product price ($)
- Checkout abandon rate % (with benchmark)
- Affiliate commission % (if any, optional)

**Benchmark enrichment:** Typical conversion rates and abandon rates by product type (e-book / mini-course / full course / workshop).

**Formula:**
- Reached checkout = traffic × conversion rate
- Completed purchase = reached checkout × (1 - abandon rate)
- Gross revenue = completed purchases × price
- Net revenue = Gross × (1 - affiliate %) if applicable

**Output:** Gross revenue, net revenue, # sales, # abandoned carts (opportunity), benchmark comparison.

---

### 5.6 Creator "Quit Your Job" Milestone Tracker
**Purpose:** Reverse-engineers a target survival income into required platform metrics.

**Inputs:**
- Monthly survival income target ($)
- Income sources toggle (which platforms/streams to include): YouTube AdSense / Sponsorships / UGC / Memberships / Digital Products / Affiliate
- For each enabled source: current estimated % of total income contribution

**Benchmark enrichment:** Average per-view/per-subscriber income rates by source and niche.

**Formula:**
- Allocate target income across selected sources by % contribution
- For each source, reverse-calculate required traffic/subscribers at benchmark rates
- e.g. YouTube AdSense at $3 RPM → need X views/month for Y income

**Output:** Per-source "you need X views / Y subscribers / Z members" to hit target. A "how far are you" gap if the user inputs current stats.

---

### 5.7 AI Output Cost Estimator
**Purpose:** Calculate token spend and monthly tool costs against content output speed to measure profitability.

**Inputs:**
- AI tools used (multi-select: ChatGPT Plus / Claude Pro / Gemini / Midjourney / ElevenLabs / Runway / Custom — with monthly cost pre-filled, editable)
- Estimated content pieces produced per month using AI
- Time saved per piece (hours)
- Hourly rate the creator values their time at ($)

**Formula:**
- Total AI tool cost / month = Σ tool subscriptions
- Time value saved = pieces × time saved × hourly rate
- Net AI ROI = time value saved - total AI cost
- Cost per content piece = total AI cost / pieces

**Output:** Total monthly AI spend, time value saved ($), net ROI, cost-per-piece, break-even content volume.

---

## 6. Layout & Navigation

### 6.1 Page structure
```
┌─────────────────────────────────────────────────────┐
│ TOP NAV: CreatorSuite [wordmark] · Categories · Auth │
├──────────────────────────────────┬──────────────────┤
│                                  │                  │
│   MAIN CONTENT AREA              │  AD SIDEBAR      │
│   (Tool grid / active tool)      │  (manual unit)   │
│                                  │                  │
│                                  │                  │
├──────────────────────────────────┴──────────────────┤
│ BETWEEN-SECTION AD (manual unit, full-width strip)   │
├─────────────────────────────────────────────────────┤
│ FOOTER: About · Privacy · AdSense disclosure        │
└─────────────────────────────────────────────────────┘
```

### 6.2 Routes
- `/` — Home: tool grid organized by category. Each card shows tool name, one-line description, category badge.
- `/tools/[slug]` — Individual tool page.
- `/rate-card` — Saved Rate Card (signed-in users: assembled multi-tool output document).
- `/history` — Estimate history (signed-in users).
- `/settings` — Auth, preferences.
- `/admin` — Protected admin dashboard (§7).

### 6.3 AdSense placement rules
- **Sidebar ad unit** — right column, desktop only, static 300×600 or 160×600.
- **Between-section ad** — full-width strip between the tool form and the results panel, 728×90 leaderboard. Only rendered after the user has interacted (not on page load).
- **NEVER** inside a form, inside a result card, inside the navigation, or in a modal.
- On mobile: sidebar collapses. One banner (320×50 or 320×100) below the result panel only.

---

## 7. Admin Dashboard (`/admin`)

- Protected route — accessible only to the app owner (check Supabase user role = `admin`).
- **Benchmark editor:** view, edit, and save benchmark values (CPM ranges, conversion rates, platform fees, niche multipliers) per niche and per tool. Changes write to Supabase `benchmarks` table; no code deploy needed.
- **Niche manager:** add/remove niches from the niche list.
- **Tool toggle:** enable/disable individual tools (for phased rollout without redeployment).
- Simple, functional UI — Dot Matrix aesthetic, but no ceremony. This is an internal tool.

---

## 8. Benchmark Data Layer

### 8.1 Niche list (13 niches at launch, expandable via admin)
Finance · Tech · Lifestyle · Gaming · Beauty & Fashion · Food & Cooking · Fitness & Health · Education · Travel · Sports · DIY & Crafts · Parenting · Business & Entrepreneurship

### 8.2 Benchmark tables (Supabase)
Each row = one benchmark value for one niche:

**`benchmarks_cpm`** — YouTube RPM ranges (low/mid/high) by niche + platform.
**`benchmarks_engagement`** — Average engagement rates by niche + platform.
**`benchmarks_conversion`** — Sales page conversion rates by product type.
**`benchmarks_ugc`** — UGC rate ranges by usage tier.
**`benchmarks_platform_fees`** — Platform fee percentages (Patreon, YouTube Memberships, etc.).
**`benchmarks_sponsorship`** — Flat-fee CPM factors by niche for sponsorship estimation.

### 8.3 Seed data (initial values — hardcoded in a migration, then editable)
Claude Code should populate realistic seed values at launch. Documented reference ranges per tool formula in §5 are the source. Benchmarks should reflect mid-2025 creator economy rates (the best available at build time), with a "last updated" timestamp shown to users.

---

## 9. PDF Export

- **Trigger:** "Export PDF" button in each tool's result panel. Only active after Calculate has been run.
- **Library:** `@react-pdf/renderer`.
- **Template per tool:** each tool has its own PDF layout. All share:
  - CreatorSuite logo/wordmark (top left) in Silkscreen-style text (web font may not render in react-pdf; use an embedded bitmap or SVG of the wordmark).
  - Tool name + export date (top right).
  - Black background, white text — Dot Matrix aesthetic carried into PDF.
  - Red accent for key result numbers.
  - User's inputs summarized, benchmark ranges noted, key outputs highlighted.
  - Footer: "Generated by CreatorSuite · creatorsuite.vercel.app · Estimates only — not financial advice."
- **Rate Card PDF:** the `/rate-card` page generates a multi-tool branded PDF combining the user's saved tool outputs into one professional document suitable for sending to brands.

---

## 10. Auth & Persistence Flow

### 10.1 Anonymous user
- Inputs saved to `localStorage` keyed by tool slug on every change.
- On return, inputs pre-filled from `localStorage`.
- Sign-in prompt shown non-intrusively (a muted banner, not a modal) after first Calculate — "Sign in to save your history and Rate Card."

### 10.2 Signed-in user
- Inputs saved to Supabase `estimates` table on Calculate (tool slug, inputs JSON, results JSON, timestamp).
- `/history` shows all past estimates per tool, named by date, reloadable.
- `/rate-card` shows the user's curated saved rate card — they can pin specific estimates here.
- `localStorage` pre-fill still works as a fast client-side layer; Supabase is source of truth.

### 10.3 Supabase schema (core tables)
```sql
users          -- managed by NextAuth adapter
estimates      -- user_id, tool_slug, inputs_json, results_json, created_at
rate_card      -- user_id, pinned_estimate_ids (array), updated_at
benchmarks_*   -- see §8.2
```
Row Level Security: users can only read/write their own rows.

---

## 11. Mobile Responsiveness

- **Mobile-first layout.** Tools must be fully usable on a phone.
- Tool grid: 1-column on mobile, 2-column on tablet, 3-column on desktop.
- Sidebar ad: hidden on mobile. One banner below result panel only.
- Form inputs: full-width, touch-friendly (min 44px tap targets).
- PDF export available on mobile (downloads to device).
- Navigation: hamburger menu on mobile, full top nav on desktop.

---

## 12. Engineering Conventions

- **TypeScript everywhere**, strict mode.
- **Shared types** in `types/` — `Tool`, `Benchmark`, `Estimate`, `RateCard`, `NicheSlug`.
- **Tool definitions** in `lib/tools/` — one file per tool exporting: `slug`, `name`, `category`, `inputs schema`, `calculate()` function, `PDF template`. Adding a new tool = one file + register in the tool index.
- **Benchmark access** via a single `getBenchmarks(niche, tool)` server function — never hardcoded in components.
- **No secrets in the client.** Supabase service key server-side only. Anon key client-side via env.
- **Environment variables:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET`.
- **`// CREATORSUITE-TODO`** for deferred decisions, tagged with phase.
- Every phase deploys to Vercel and is publicly accessible before the next phase starts.

---

## 13. Definition of Done — v1.0 MVP

- App deploys to `creatorsuite.vercel.app` from a public GitHub repo.
- All 7 MVP tools render, calculate correctly, and enrich with benchmark data.
- Anonymous users: last inputs persist via localStorage.
- Google sign-in works; signed-in users: estimates saved to Supabase, history page functional, rate card page functional.
- PDF export works for all 7 tools — branded, Dot Matrix aesthetic, downloads correctly.
- Admin dashboard live: benchmark values editable without redeployment.
- AdSense manual units placed per §6.3 — sidebar (desktop), between-section (post-interact), mobile banner.
- Dot Matrix design language applied consistently across all pages: Silkscreen + Share Tech Mono, black/white/red, dot grid texture, sharp corners, no gradients.
- Mobile responsive — all tools usable on 375px viewport.

---

## 14. Version Roadmap Summary

| Version | Tools live | Key additions |
|---|---|---|
| **v1.0** | 7 | MVP — core tools, auth, PDF, benchmarks, AdSense |
| **v1.1** | 11 | Affiliate ROI, Usage Rights, Multi-Platform Bundler, Blog RPM |
| **v1.2** | 15 | TikTok Rewards, Shorts/Reels, Podcast Ad, Newsletter/Substack |
| **v2.0** | 21 | All tools live — Churn, Depreciation, Tax, Commission, Hook Retention, Repurposing |

All 21 tools share the same architecture. Adding a tool in v1.1+ = one new file in `lib/tools/` + benchmark seed data. No structural changes to the app.

---

*End of CreatorSuite master specification. Build v1.0 first — all 7 tools, fully styled, deployed. Then add tools per phase without structural changes.*
