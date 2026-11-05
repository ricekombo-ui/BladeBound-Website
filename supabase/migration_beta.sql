-- Run ONLY on a separate beta Supabase project, never on the AMC project.
create table if not exists public.beta_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
create table if not exists public.beta_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  message text not null check (char_length(trim(message)) between 1 and 3000),
  created_at timestamptz not null default now()
);
alter table public.beta_members enable row level security;
alter table public.beta_feedback enable row level security;
revoke all on public.beta_members, public.beta_feedback from anon, authenticated;
grant select on public.beta_members to authenticated;
grant insert on public.beta_feedback to authenticated;
create policy beta_members_self on public.beta_members for select to authenticated using (user_id = auth.uid());
create policy beta_feedback_insert on public.beta_feedback for insert to authenticated with check (
  user_id = auth.uid() and exists (select 1 from public.beta_members where user_id = auth.uid())
);

-- The database enforces the quota even when the public API is called directly.
create or replace function public.limit_beta_feedback() returns trigger
language plpgsql security definer set search_path = pg_catalog, public as $$
begin
  perform pg_advisory_xact_lock(hashtextextended(new.user_id::text, 2026));
  if (select count(*) from public.beta_feedback where user_id = new.user_id and created_at > now() - interval '1 hour') >= 5 then
    raise exception 'feedback rate limit';
  end if;
  new.created_at := now();
  return new;
end;
$$;
revoke all on function public.limit_beta_feedback() from public;
create trigger beta_feedback_limit before insert on public.beta_feedback for each row execute function public.limit_beta_feedback();
