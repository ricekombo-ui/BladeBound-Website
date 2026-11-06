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

-- Secure transactional check-in.
-- Secure daily-check-in foundation. Does not populate email addresses or send mail.
begin;
alter table public.profiles add column if not exists email text;
create table if not exists public.task_assignees (
  task_id uuid not null references public.tasks(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  primary key (task_id, profile_id)
);
alter table public.task_assignees enable row level security;
drop policy if exists task_assignees_all on public.task_assignees;
create policy task_assignees_all on public.task_assignees for all to authenticated using (public.is_amc_member()) with check (public.is_amc_member());
revoke all on public.task_assignees from anon;
grant select,insert,update,delete on public.task_assignees to authenticated;
grant all on public.task_assignees to service_role;

create table if not exists public.checkin_tokens (
  id uuid primary key default gen_random_uuid(),
  token text not null unique,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  date date not null default current_date,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now(),
  unique (profile_id, date)
);
alter table public.checkin_tokens enable row level security;
drop policy if exists checkin_tokens_all on public.checkin_tokens;
revoke all on public.checkin_tokens from public, anon, authenticated;
grant all on public.checkin_tokens to service_role;

alter function public.handle_updated_at() set search_path = pg_catalog, public;

-- One transaction locks and consumes a valid token, checks every requested task,
-- and applies the complete check-in. Exceptions roll back all changes.
create or replace function public.submit_daily_checkin(p_token text, p_tasks jsonb, p_subtasks jsonb, p_checkin jsonb)
returns void language plpgsql security definer set search_path = pg_catalog, public as $$
declare link public.checkin_tokens%rowtype; item jsonb; task_uuid uuid; subtask_uuid uuid; task_status text; energy_value integer;
begin
  if p_token is null or length(p_token) < 20 or length(p_token) > 128 then raise exception 'Invalid request'; end if;
  if jsonb_typeof(p_tasks) <> 'array' or jsonb_typeof(p_subtasks) <> 'array' or jsonb_typeof(p_checkin) <> 'object' then raise exception 'Invalid request'; end if;
  if jsonb_array_length(p_tasks) > 200 or jsonb_array_length(p_subtasks) > 500 then raise exception 'Invalid request'; end if;
  select * into link from public.checkin_tokens where token = p_token for update;
  if not found or link.used_at is not null or link.expires_at <= now() then raise exception 'Invalid or expired link'; end if;
  if jsonb_typeof(p_checkin->'energy') <> 'number' or (p_checkin->>'energy') !~ '^[1-5]$' then raise exception 'Invalid energy'; end if;
  energy_value := (p_checkin->>'energy')::integer;
  if length(coalesce(p_checkin->>'wins','')) > 5000 or length(coalesce(p_checkin->>'blockers','')) > 5000 or length(coalesce(p_checkin->>'plan','')) > 5000 then raise exception 'Text too long'; end if;
  for item in select value from jsonb_array_elements(p_tasks) loop
    task_uuid := (item->>'taskId')::uuid; task_status := item->>'status';
    if task_uuid is null or task_status is null or task_status not in ('backlog','ready','in_progress','review','scheduled','published','repurpose') then raise exception 'Invalid task'; end if;
    update public.tasks t set status = task_status where t.id = task_uuid and (t.owner_id = link.profile_id or exists (select 1 from public.task_assignees a where a.task_id=t.id and a.profile_id=link.profile_id));
    if not found then raise exception 'Task not assigned'; end if;
  end loop;
  for item in select value from jsonb_array_elements(p_subtasks) loop
    subtask_uuid := (item->>'subtaskId')::uuid;
    if subtask_uuid is null or jsonb_typeof(item->'completed') <> 'boolean' then raise exception 'Invalid subtask'; end if;
    update public.task_subtasks s set completed=(item->>'completed')::boolean where s.id=subtask_uuid and exists (select 1 from public.tasks t where t.id=s.task_id and (t.owner_id=link.profile_id or exists (select 1 from public.task_assignees a where a.task_id=t.id and a.profile_id=link.profile_id)));
    if not found then raise exception 'Subtask not assigned'; end if;
  end loop;
  insert into public.check_ins(user_id,date,energy,wins,blockers,plan) values (link.profile_id,link.date,energy_value,nullif(p_checkin->>'wins',''),nullif(p_checkin->>'blockers',''),nullif(p_checkin->>'plan',''))
  on conflict (user_id,date) do update set energy=excluded.energy,wins=excluded.wins,blockers=excluded.blockers,plan=excluded.plan;
  update public.checkin_tokens set used_at=now() where id=link.id;
end $$;
revoke all on function public.submit_daily_checkin(text,jsonb,jsonb,jsonb) from public, anon, authenticated;
grant execute on function public.submit_daily_checkin(text,jsonb,jsonb,jsonb) to service_role;
commit;
