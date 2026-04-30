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
