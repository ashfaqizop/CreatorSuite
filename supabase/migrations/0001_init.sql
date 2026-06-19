-- =============================================================================
-- CreatorSuite — schema (§10.3). Run this in the Supabase SQL editor.
--
-- Auth uses stateless JWT sessions (no Supabase adapter), so EVERYTHING lives
-- in the `public` schema — no `next_auth` schema to expose. user_id is the
-- Google account id (text). Safe to re-run: it resets the app tables.
-- =============================================================================

create extension if not exists "uuid-ossp";

-- Clean up any earlier adapter-based attempt (no real data yet).
drop schema if exists next_auth cascade;
drop table if exists public.estimates cascade;
drop table if exists public.rate_card cascade;

-- Estimate history (§10.2) — user_id = Google account id (token.sub).
create table public.estimates (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null,
  tool_slug text not null,
  inputs_json jsonb not null default '{}',
  results_json jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index estimates_user_idx on public.estimates (user_id, created_at desc);

-- Saved Rate Card (§10.2).
create table public.rate_card (
  user_id text primary key,
  pinned_estimate_ids uuid[] not null default '{}',
  updated_at timestamptz not null default now()
);

-- Editable benchmark bundle (§8.2 — one JSONB document for the MVP).
create table if not exists public.benchmarks (
  id int primary key,
  bundle jsonb not null default '{}',
  updated_at timestamptz not null default now()
);
insert into public.benchmarks (id, bundle) values (1, '{}')
  on conflict (id) do nothing;

-- Tool enable/disable toggles (§7).
create table if not exists public.tool_settings (
  slug text primary key,
  enabled boolean not null default true,
  updated_at timestamptz not null default now()
);

-- Admin role assignments (§7). Owner email can also be set via ADMIN_EMAILS env.
create table if not exists public.app_roles (
  email text primary key,
  role text not null default 'admin'
);

-- -----------------------------------------------------------------------------
-- Row Level Security. The server uses the service-role key (bypasses RLS) and
-- scopes every query by user_id. RLS here blocks direct anon-key access:
--   * estimates / rate_card / app_roles: no anon policy → anon cannot read.
--   * benchmarks / tool_settings: world-readable (served publicly).
-- -----------------------------------------------------------------------------
alter table public.estimates enable row level security;
alter table public.rate_card enable row level security;
alter table public.app_roles enable row level security;
alter table public.benchmarks enable row level security;
alter table public.tool_settings enable row level security;

drop policy if exists "benchmarks_read" on public.benchmarks;
create policy "benchmarks_read" on public.benchmarks for select using (true);

drop policy if exists "tool_settings_read" on public.tool_settings;
create policy "tool_settings_read" on public.tool_settings for select using (true);
