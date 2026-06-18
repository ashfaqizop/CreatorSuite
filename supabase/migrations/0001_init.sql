-- =============================================================================
-- CreatorSuite — initial schema (§10.3)
-- Run this in the Supabase SQL editor. Sections:
--   1. NextAuth (Auth.js) Supabase adapter schema + tables
--   2. Application tables (estimates, rate_card, benchmarks, tool_settings, app_roles)
--   3. Row Level Security
-- =============================================================================

create extension if not exists "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. NextAuth adapter schema (per Auth.js Supabase adapter docs)
-- -----------------------------------------------------------------------------
create schema if not exists next_auth;
grant usage on schema next_auth to service_role;
grant all on schema next_auth to postgres;

create table if not exists next_auth.users (
  id uuid not null default uuid_generate_v4(),
  name text,
  email text,
  "emailVerified" timestamptz,
  image text,
  constraint users_pkey primary key (id),
  constraint email_unique unique (email)
);
grant all on table next_auth.users to postgres, service_role;

create or replace function next_auth.uid() returns uuid
  language sql stable
as $$
  select coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;

create table if not exists next_auth.sessions (
  id uuid not null default uuid_generate_v4(),
  expires timestamptz not null,
  "sessionToken" text not null,
  "userId" uuid,
  constraint sessions_pkey primary key (id),
  constraint sessions_sessiontoken_unique unique ("sessionToken"),
  constraint "sessions_userId_fkey" foreign key ("userId")
    references next_auth.users (id) on delete cascade
);
grant all on table next_auth.sessions to postgres, service_role;

create table if not exists next_auth.accounts (
  id uuid not null default uuid_generate_v4(),
  type text not null,
  provider text not null,
  "providerAccountId" text not null,
  refresh_token text,
  access_token text,
  expires_at bigint,
  token_type text,
  scope text,
  id_token text,
  session_state text,
  oauth_token_secret text,
  oauth_token text,
  "userId" uuid,
  constraint accounts_pkey primary key (id),
  constraint "accounts_userId_fkey" foreign key ("userId")
    references next_auth.users (id) on delete cascade
);
grant all on table next_auth.accounts to postgres, service_role;

create table if not exists next_auth.verification_tokens (
  identifier text,
  token text,
  expires timestamptz not null,
  constraint verification_tokens_pkey primary key (token),
  constraint token_unique unique (token),
  constraint token_identifier_unique unique (token, identifier)
);
grant all on table next_auth.verification_tokens to postgres, service_role;

-- -----------------------------------------------------------------------------
-- 2. Application tables (public schema)
-- -----------------------------------------------------------------------------
create table if not exists public.estimates (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references next_auth.users (id) on delete cascade,
  tool_slug text not null,
  inputs_json jsonb not null default '{}',
  results_json jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index if not exists estimates_user_idx on public.estimates (user_id, created_at desc);

create table if not exists public.rate_card (
  user_id uuid primary key references next_auth.users (id) on delete cascade,
  pinned_estimate_ids uuid[] not null default '{}',
  updated_at timestamptz not null default now()
);

-- Editable benchmark bundle (§8.2 stored as one JSONB document for the MVP).
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
-- 3. Row Level Security — users read/write only their own rows (§10.3)
-- -----------------------------------------------------------------------------
alter table public.estimates enable row level security;
alter table public.rate_card enable row level security;
alter table public.benchmarks enable row level security;
alter table public.tool_settings enable row level security;
alter table public.app_roles enable row level security;

drop policy if exists "estimates_own" on public.estimates;
create policy "estimates_own" on public.estimates
  for all using (next_auth.uid() = user_id) with check (next_auth.uid() = user_id);

drop policy if exists "rate_card_own" on public.rate_card;
create policy "rate_card_own" on public.rate_card
  for all using (next_auth.uid() = user_id) with check (next_auth.uid() = user_id);

-- Benchmarks + tool settings are world-readable (served publicly), writes go
-- through the service role only (no anon write policy).
drop policy if exists "benchmarks_read" on public.benchmarks;
create policy "benchmarks_read" on public.benchmarks for select using (true);

drop policy if exists "tool_settings_read" on public.tool_settings;
create policy "tool_settings_read" on public.tool_settings for select using (true);

-- app_roles: no anon access; service role bypasses RLS.

-- NOTE: the app server uses the service role key (bypasses RLS) and scopes every
-- query by user_id, so writes work without a separate JWT integration. RLS above
-- protects against direct anon-key access.
