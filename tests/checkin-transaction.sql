do $$
declare p1 uuid; p2 uuid; t1 uuid := gen_random_uuid(); t2 uuid := gen_random_uuid(); s1 uuid := gen_random_uuid(); tok text := 'test-' || gen_random_uuid()::text; blocked boolean;
begin
  select id into p1 from public.profiles order by id limit 1;
  select id into p2 from public.profiles where id <> p1 order by id limit 1;
  if p1 is null or p2 is null then raise exception 'Need two team profiles for transactional test'; end if;
  insert into public.tasks(id,title,status,owner_id) values(t1,'security fixture','backlog',p1),(t2,'security fixture','backlog',p2);
  insert into public.task_subtasks(id,task_id,title,completed) values(s1,t1,'security fixture',false);
  insert into public.checkin_tokens(token,profile_id,date,expires_at) values(tok,p1,'2999-01-01',now()+interval '1 hour');
  blocked:=false;
  begin perform public.submit_daily_checkin(tok,jsonb_build_array(jsonb_build_object('taskId',t1,'status','ready'),jsonb_build_object('taskId',t2,'status','ready')),'[]'::jsonb,'{"energy":3}'::jsonb); exception when others then blocked:=true; end;
  if not blocked or (select status from public.tasks where id=t1) <> 'backlog' or (select used_at from public.checkin_tokens where token=tok) is not null then raise exception 'Cross-user protection or rollback failed'; end if;
  perform public.submit_daily_checkin(tok,jsonb_build_array(jsonb_build_object('taskId',t1,'status','ready')),jsonb_build_array(jsonb_build_object('subtaskId',s1,'completed',true)),'{"energy":3}'::jsonb);
  if (select status from public.tasks where id=t1) <> 'ready' or not (select completed from public.task_subtasks where id=s1) then raise exception 'Valid update failed'; end if;
  blocked:=false; begin perform public.submit_daily_checkin(tok,'[]'::jsonb,'[]'::jsonb,'{"energy":3}'::jsonb); exception when others then blocked:=true; end;
  if not blocked then raise exception 'Replay was accepted'; end if;
  if has_function_privilege('anon','public.submit_daily_checkin(text,jsonb,jsonb,jsonb)','execute') or has_function_privilege('authenticated','public.submit_daily_checkin(text,jsonb,jsonb,jsonb)','execute') then raise exception 'RPC exposed'; end if;
end $$;
rollback;