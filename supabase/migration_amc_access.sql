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
