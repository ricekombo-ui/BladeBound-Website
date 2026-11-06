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
