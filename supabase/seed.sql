-- ============================================================
-- AMC Seed Data — BladeBound Production Board
-- Run AFTER schema.sql AND after creating the three auth users.
--
-- Step 1: Create users in Supabase Auth → Authentication → Users
--   daniel@bladebound.gg
--   aj@bladebound.gg
--   adam@bladebound.gg
--
-- Step 2: Replace the placeholder UUIDs below with real auth user IDs
-- Step 3: Run this file in the Supabase SQL editor
-- ============================================================

-- ── Profiles ──────────────────────────────────────────────────────────────
-- !! Replace these with the actual UUIDs from your Supabase Auth Users page !!

insert into public.profiles (user_id, name, role, avatar_color) values
  ('00000000-0000-0000-0000-000000000001', 'Daniel', 'admin',  '#d56047'),
  ('00000000-0000-0000-0000-000000000002', 'AJ',     'member', '#ae4641'),
  ('00000000-0000-0000-0000-000000000003', 'Adam',   'member', '#69354c')
on conflict (user_id) do nothing;

-- ── Tasks — mapped from Production Board ──────────────────────────────────

insert into public.tasks (title, description, status, type, priority) values
  -- Backlog
  ('TierList - Sage Touched',       null,   'backlog',    'yt',          'low'),
  ('Future Class Builds',           null,   'backlog',    'yt',          'low'),
  ('Future Campaign Frames',        null,   'backlog',    'frame_design','low'),
  ('New Show Ideas',                null,   'backlog',    'yt',          'low'),
  ('Community Content Ideas',       null,   'backlog',    'community',   'low'),

  -- Ready
  ('YT - Rogue - Sage Touched',          null, 'ready', 'yt',          'high'),
  ('Class Builds - Interview',           null, 'ready', 'yt',          'medium'),
  ('Gauntlet - Hope and Fear',           null, 'ready', 'actual_play', 'medium'),

  -- In Progress
  ('Rogue | Syndicate - Class Builds - Infographic', null, 'in_progress', 'infographic',  'high'),
  ('YT - Sorceror - Sage Touched',                   null, 'in_progress', 'yt',           'high'),
  ('Frame - Where the Line Break',                   null, 'in_progress', 'frame_design', 'high'),

  -- Review
  ('Rogue | Nightwalker - Class Builds - Infographic', null, 'review', 'infographic', 'medium'),

  -- Scheduled
  ('YT - Rogue - Sage Touched (Scheduled)', null, 'scheduled', 'yt', 'high'),

  -- Repurpose
  ('Clip into Shorts',        null, 'repurpose', 'yt',        'low'),
  ('Convert to Infographic',  null, 'repurpose', 'infographic','low'),
  ('Discord Post',            null, 'repurpose', 'community', 'low'),
  ('Reddit Post',             null, 'repurpose', 'community', 'low');

-- ── Subtasks ──────────────────────────────────────────────────────────────

-- Rogue | Syndicate - Infographic
insert into public.task_subtasks (task_id, title, completed, order_index)
select t.id, s.title, s.completed, s.idx
from public.tasks t
cross join (values
  ('Design Layout', false, 0),
  ('Write Copy',    false, 1),
  ('Final Polish',  false, 2)
) as s(title, completed, idx)
where t.title = 'Rogue | Syndicate - Class Builds - Infographic';

-- YT - Sorceror - Sage Touched
insert into public.task_subtasks (task_id, title, completed, order_index)
select t.id, s.title, s.completed, s.idx
from public.tasks t
cross join (values
  ('Outline',     false, 0),
  ('Record',      false, 1),
  ('Edit',        false, 2),
  ('Thumbnail',   false, 3),
  ('Upload Prep', false, 4)
) as s(title, completed, idx)
where t.title = 'YT - Sorceror - Sage Touched';

-- Frame - Where the Line Break
insert into public.task_subtasks (task_id, title, completed, order_index)
select t.id, s.title, s.completed, s.idx
from public.tasks t
cross join (values
  ('Core Mechanic Pass', false, 0),
  ('Adversaries',        false, 1),
  ('Environments',       false, 2),
  ('Formatting',         false, 3)
) as s(title, completed, idx)
where t.title = 'Frame - Where the Line Break';

-- Rogue | Nightwalker - Infographic (Review)
insert into public.task_subtasks (task_id, title, completed, order_index)
select t.id, s.title, s.completed, s.idx
from public.tasks t
cross join (values
  ('QA Pass',       false, 0),
  ('Branding Check',false, 1),
  ('Export',        false, 2)
) as s(title, completed, idx)
where t.title = 'Rogue | Nightwalker - Class Builds - Infographic';

-- YT - Rogue - Sage Touched (Scheduled)
insert into public.task_subtasks (task_id, title, completed, order_index)
select t.id, s.title, s.completed, s.idx
from public.tasks t
cross join (values
  ('Final Upload',       false, 0),
  ('Title + Description',false, 1),
  ('Thumbnail Locked',   false, 2),
  ('Scheduled Date Set', false, 3)
) as s(title, completed, idx)
where t.title = 'YT - Rogue - Sage Touched (Scheduled)';

-- ── Goals ─────────────────────────────────────────────────────────────────

insert into public.goals (title, description, type, status, owner_id, target_date, progress_note) values
  ('Complete Sage Touched Season 1',
   'Finish all 14 class breakdowns with consistent quality and SEO-optimized titles.',
   'short', 'active',
   (select id from public.profiles where name = 'Daniel'),
   '2026-06-30',
   'Episode 11 live. 3 remaining.'),

  ('Reach 1,000 YouTube subscribers',
   'Organic growth through consistent uploads and community engagement.',
   'short', 'active',
   null,
   '2026-07-01',
   'At 640. Growing ~40/month.'),

  ('Launch BladeBound Patreon to 50 supporters',
   'Build sustainable revenue base to fund better production.',
   'long', 'active',
   (select id from public.profiles where name = 'Daniel'),
   '2026-12-31',
   'Currently at 12. Need stronger CTA integration.'),

  ('Run 5 Campaign Frame Gauntlet one-shots',
   'Cover each official campaign frame with a live one-shot.',
   'long', 'active',
   (select id from public.profiles where name = 'AJ'),
   '2026-09-01',
   'Age of Umbra done. 4 remaining.'),

  ('Build active Discord community to 200 members',
   'Create an engaged space for Daggerheart players.',
   'long', 'active',
   (select id from public.profiles where name = 'Adam'),
   '2026-12-31',
   'At 87 members. Monthly events launching Q3.');

-- ── Weekly Meeting ────────────────────────────────────────────────────────

insert into public.weekly_meetings (week_start, wins, blockers, notes, created_by) values
  (date_trunc('week', current_date)::date,
   array['Sage Touched Ep 11 hit 800 views in first 48h', 'AJ finished Age of Umbra rough cut', 'Discord passed 85 members'],
   array['Patreon CTA integration still pending', 'Waiting on Adam for StartPlaying update'],
   'Good momentum week. Need to tighten pipeline for June content.',
   (select id from public.profiles where name = 'Daniel'))
on conflict (week_start) do nothing;

insert into public.weekly_priorities (meeting_id, title, owner_id, completed, order_index)
select m.id, p.title,
  (select id from public.profiles where name = p.owner_name),
  p.completed, p.order_index
from public.weekly_meetings m
cross join (values
  ('Record Ep 12 intro segment',               'Daniel', false, 0),
  ('Finish Age of Umbra edit',                 'AJ',     true,  1),
  ('Post Discord community event announcement','Adam',   false, 2),
  ('Draft Patreon post for week',              'Daniel', false, 3),
  ('Review StartPlaying page',                 'Adam',   false, 4)
) as p(title, owner_name, completed, order_index)
where m.week_start = date_trunc('week', current_date)::date;

-- ── Check-ins ─────────────────────────────────────────────────────────────

insert into public.check_ins (user_id, date, energy, wins, blockers, plan) values
  ((select id from public.profiles where name = 'Daniel'),
   current_date, 4,
   'Good recording session this morning.',
   'Audio interface acting up.',
   'Finish Sorceror outline. Review Nightwalker infographic.'),
  ((select id from public.profiles where name = 'AJ'),
   current_date, 3,
   'Nightwalker cut locked.',
   'Render times brutal.',
   'Export Nightwalker. Start Sorceror edit.'),
  ((select id from public.profiles where name = 'Adam'),
   current_date, 4,
   'Discord engagement up this week.',
   null,
   'Post event details. Draft Reddit post.')
on conflict (user_id, date) do nothing;

-- ── Decisions ─────────────────────────────────────────────────────────────

insert into public.decisions (title, context, decision_text, made_by, date, tags) values
  ('Use Daggerheart as primary game system',
   'Evaluated multiple TTRPG systems. Daggerheart has early-mover advantage and aligns with our narrative-first approach.',
   'BladeBound will focus exclusively on Daggerheart content for at least 12 months.',
   (select id from public.profiles where name = 'Daniel'),
   '2026-01-10',
   array['strategy', 'content']),

  ('Shorts-first community growth strategy',
   'YouTube algorithm heavily favors shorts for new channel discovery. Long-form serves the existing audience.',
   'Commit to 3 shorts per week minimum for Q2 and Q3.',
   (select id from public.profiles where name = 'Daniel'),
   '2026-02-15',
   array['strategy', 'content', 'growth']),

  ('Patreon over Ko-fi for supporter model',
   'Ko-fi is simpler but Patreon has better tooling for tiered benefits and community building.',
   'Launch on Patreon with three tiers. Revisit after 6 months.',
   (select id from public.profiles where name = 'Daniel'),
   '2026-03-01',
   array['revenue', 'strategy']),

  ('AJ leads all video editing',
   'Daniel recording + writing, AJ editing, Adam community + logistics. Minimize context switching.',
   'AJ owns the edit pipeline. Daniel reviews final cuts before publish.',
   null,
   '2026-03-20',
   array['operations', 'team']),

  ('Max 3 items in In Progress at all times',
   'Context switching kills output quality. Hard limit enforces focus.',
   'Nothing enters In Progress without a checklist. Hard cap of 3 items.',
   (select id from public.profiles where name = 'Daniel'),
   '2026-04-01',
   array['operations', 'pipeline']);
