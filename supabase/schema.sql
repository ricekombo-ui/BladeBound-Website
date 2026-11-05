-- ============================================================
-- AMC — Adventuring Management Console
-- Run this in your Supabase SQL editor to set up the schema
-- ============================================================

-- ── Profiles ──────────────────────────────────────────────────────────────

create table if not exists public.profiles (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete cascade not null unique,
  name          text not null,
  role          text not null default 'member' check (role in ('admin', 'member')),
  avatar_color  text not null default '#d56047',
  email         text,
  created_at    timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "profiles_read" on public.profiles
  for select using (true);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = user_id);

-- ── Tasks (Pipeline) ──────────────────────────────────────────────────────

create table if not exists public.tasks (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  status      text not null default 'backlog'
              check (status in ('backlog','ready','in_progress','review','scheduled','published','repurpose')),
  type        text not null default 'yt'
              check (type in ('yt','infographic','frame_design','actual_play','community','admin','tech')),
  priority    text not null default 'high'
              check (priority in ('low','medium','high')),
  owner_id    uuid references public.profiles(id) on delete set null,
  due_date    date,
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);

alter table public.tasks enable row level security;
create policy "tasks_all" on public.tasks for all using (true);

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger tasks_updated_at
  before update on public.tasks
  for each row execute function public.handle_updated_at();

-- ── Task Subtasks (Checklists) ─────────────────────────────────────────────

create table if not exists public.task_subtasks (
  id          uuid primary key default gen_random_uuid(),
  task_id     uuid references public.tasks(id) on delete cascade not null,
  title       text not null,
  completed   boolean not null default false,
  order_index integer not null default 0,
  created_at  timestamptz default now() not null
);

alter table public.task_subtasks enable row level security;
create policy "task_subtasks_all" on public.task_subtasks for all using (true);

-- ── Task Assignees (Working On This) ───────────────────────────────────────

create table if not exists public.task_assignees (
  task_id     uuid references public.tasks(id) on delete cascade not null,
  profile_id  uuid references public.profiles(id) on delete cascade not null,
  primary key (task_id, profile_id)
);

alter table public.task_assignees enable row level security;
create policy "task_assignees_all" on public.task_assignees for all using (true);

-- ── Goals ─────────────────────────────────────────────────────────────────

create table if not exists public.goals (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  description    text,
  type           text not null default 'short'
                 check (type in ('short', 'long')),
  status         text not null default 'active'
                 check (status in ('active', 'completed', 'paused')),
  owner_id       uuid references public.profiles(id) on delete set null,
  target_date    date,
  progress_note  text,
  created_at     timestamptz default now() not null,
  updated_at     timestamptz default now() not null
);

alter table public.goals enable row level security;
create policy "goals_all" on public.goals for all using (true);

create trigger goals_updated_at
  before update on public.goals
  for each row execute function public.handle_updated_at();

-- ── Weekly Meetings ────────────────────────────────────────────────────────

create table if not exists public.weekly_meetings (
  id          uuid primary key default gen_random_uuid(),
  week_start  date not null unique,
  wins        text[] not null default '{}',
  blockers    text[] not null default '{}',
  notes       text,
  created_by  uuid references public.profiles(id) on delete set null,
  created_at  timestamptz default now() not null
);

alter table public.weekly_meetings enable row level security;
create policy "weekly_meetings_all" on public.weekly_meetings for all using (true);

create table if not exists public.weekly_priorities (
  id           uuid primary key default gen_random_uuid(),
  meeting_id   uuid references public.weekly_meetings(id) on delete cascade not null,
  title        text not null,
  owner_id     uuid references public.profiles(id) on delete set null,
  completed    boolean not null default false,
  order_index  integer not null default 0
);

alter table public.weekly_priorities enable row level security;
create policy "weekly_priorities_all" on public.weekly_priorities for all using (true);

-- ── Check-ins ─────────────────────────────────────────────────────────────

create table if not exists public.check_ins (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles(id) on delete cascade not null,
  date        date not null default current_date,
  energy      integer not null default 3 check (energy between 1 and 5),
  wins        text,
  blockers    text,
  plan        text,
  created_at  timestamptz default now() not null,
  unique (user_id, date)
);

alter table public.check_ins enable row level security;
create policy "check_ins_all" on public.check_ins for all using (true);

-- ── Decisions ─────────────────────────────────────────────────────────────

create table if not exists public.decisions (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  context        text,
  decision_text  text not null,
  made_by        uuid references public.profiles(id) on delete set null,
  date           date not null default current_date,
  tags           text[] not null default '{}',
  created_at     timestamptz default now() not null
);

alter table public.decisions enable row level security;
create policy "decisions_all" on public.decisions for all using (true);

-- ── Daily Check-in Links (magic links) ─────────────────────────────────────

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
create policy "checkin_tokens_all" on public.checkin_tokens for all using (true);

-- ── Hope & Fear Giveaway ────────────────────────────────────────────────────

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
create policy "giveaway_insert" on public.giveaway_entries for insert with check (true);
create policy "giveaway_read" on public.giveaway_entries for select using (auth.role() = 'authenticated');
create policy "giveaway_update" on public.giveaway_entries for update using (auth.role() = 'authenticated');

-- Apply the same AMC security policy hardening on fresh installs.

-- Apply AMC security policy hardening on fresh installs.
-- Restrict AMC data to people with an existing team profile.
-- The owner must back up all affected tables before applying this migration.
begin;

create or replace function public.is_amc_member()
returns boolean language sql stable security definer
set search_path = pg_catalog, public
as $$ select exists (select 1 from public.profiles where user_id = auth.uid()) $$;
revoke all on function public.is_amc_member() from public, anon;
grant execute on function public.is_amc_member() to authenticated;

-- Some installations have not applied the later assignee or daily-token migrations.
do $$
declare item record;
begin
  for item in select * from (values
    ('tasks','tasks_all'), ('task_subtasks','task_subtasks_all'),
    ('task_assignees','task_assignees_all'), ('goals','goals_all'),
    ('weekly_meetings','weekly_meetings_all'), ('weekly_priorities','weekly_priorities_all'),
    ('check_ins','check_ins_all'), ('decisions','decisions_all'),
    ('checkin_tokens','checkin_tokens_all')
  ) as x(table_name, policy_name) loop
    if to_regclass('public.' || item.table_name) is not null then
      execute format('drop policy if exists %I on public.%I', item.policy_name, item.table_name);
      execute format('create policy %I on public.%I for all to authenticated using (public.is_amc_member()) with check (public.is_amc_member())', item.policy_name, item.table_name);
      execute format('revoke all on public.%I from anon', item.table_name);
    end if;
  end loop;
end $$;

drop policy if exists profiles_read on public.profiles;
create policy profiles_read on public.profiles for select to authenticated using (public.is_amc_member());
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update to authenticated using (user_id = auth.uid() and public.is_amc_member()) with check (user_id = auth.uid() and public.is_amc_member());
revoke all on public.profiles from anon;
-- A member cannot promote themselves by changing role or changing the linked user.
revoke update on public.profiles from authenticated;
grant update (name, avatar_color) on public.profiles to authenticated;

-- Public submission policies remain in place; only staff may read or manage entries.
do $$
declare item record;
begin
  for item in select * from (values
    ('giveaway_entries','giveaway_read','select'),
    ('giveaway_entries','giveaway_update','update'),
    ('contact_messages','contact_read','select'),
    ('newsletter_subscribers','newsletter_read','select')
  ) as x(table_name, policy_name, operation) loop
    if to_regclass('public.' || item.table_name) is not null then
      execute format('drop policy if exists %I on public.%I', item.policy_name, item.table_name);
      if item.operation = 'update' then
        execute format('create policy %I on public.%I for update to authenticated using (public.is_amc_member()) with check (public.is_amc_member())', item.policy_name, item.table_name);
      else
        execute format('create policy %I on public.%I for select to authenticated using (public.is_amc_member())', item.policy_name, item.table_name);
      end if;
    end if;
  end loop;
end $$;
commit;
