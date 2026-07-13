-- ============================================================
-- Migration: Daily check-in magic links
-- Run this in your Supabase SQL editor
-- ============================================================

alter table public.profiles add column if not exists email text;

update public.profiles p
set email = au.email
from auth.users au
where au.id = p.user_id and p.email is null;

create table if not exists public.checkin_tokens (
  id          uuid primary key default gen_random_uuid(),
  token       text not null unique,
  profile_id  uuid references public.profiles(id) on delete cascade not null,
  date        date not null default current_date,
  expires_at  timestamptz not null,
  used_at     timestamptz,
  created_at  timestamptz default now() not null,
  unique (profile_id, date)
);

alter table public.checkin_tokens enable row level security;

create policy "checkin_tokens_all" on public.checkin_tokens
  for all using (true);
