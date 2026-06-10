-- ============================================================
-- Migration: Newsletter subscribers (email capture)
-- Run this in your Supabase SQL editor
-- ============================================================

create table if not exists public.newsletter_subscribers (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  source      text,                -- which page/form captured them
  created_at  timestamptz default now() not null
);

alter table public.newsletter_subscribers enable row level security;

-- Anyone (including anonymous visitors) can subscribe
create policy "newsletter_insert" on public.newsletter_subscribers
  for insert with check (true);

-- Only authenticated users (the team) can read the list
create policy "newsletter_read" on public.newsletter_subscribers
  for select using (auth.role() = 'authenticated');
