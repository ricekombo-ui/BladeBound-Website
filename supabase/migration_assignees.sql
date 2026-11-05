-- ============================================================
-- Migration: Add multi-assignee support to tasks
-- Run this in your Supabase SQL editor
-- ============================================================

create table if not exists public.task_assignees (
  task_id    uuid references public.tasks(id) on delete cascade not null,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  primary key (task_id, profile_id)
);

alter table public.task_assignees enable row level security;
-- Requires public.is_amc_member() from migration_amc_access.sql.
create policy "task_assignees_all" on public.task_assignees for all to authenticated using (public.is_amc_member()) with check (public.is_amc_member());
revoke all on public.task_assignees from anon;
