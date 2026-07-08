-- ============================================================
-- Migration: Contact form messages
-- Run this in your Supabase SQL editor
-- ============================================================

create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  subject     text not null,
  message     text not null,
  created_at  timestamptz default now() not null
);

alter table public.contact_messages enable row level security;

-- Anyone (including anonymous visitors) can send a message
create policy "contact_insert" on public.contact_messages
  for insert with check (true);

-- Only authenticated users (the team) can read messages
create policy "contact_read" on public.contact_messages
  for select using (auth.role() = 'authenticated');
