-- ============================================================
-- Migration: Hope & Fear Giveaway entries
-- Run this in your Supabase SQL editor
-- ============================================================

create table if not exists public.giveaway_entries (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  discord     text not null,
  youtube     text,
  email       text not null unique,
  zip_code    text not null,
  won         boolean not null default false,
  won_at      timestamptz,
  created_at  timestamptz default now() not null
);

alter table public.giveaway_entries enable row level security;

-- Public signup form can insert
create policy "giveaway_insert" on public.giveaway_entries
  for insert with check (true);

-- Only authenticated (AMC) users can read/update the pool — needed for the wheel
create policy "giveaway_read" on public.giveaway_entries
  for select using (auth.role() = 'authenticated');

create policy "giveaway_update" on public.giveaway_entries
  for update using (auth.role() = 'authenticated');
