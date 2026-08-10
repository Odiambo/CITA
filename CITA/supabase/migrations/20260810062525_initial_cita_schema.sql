create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role text not null default 'participant' check (role in ('admin', 'exec_director', 'intake_admin', 'program_director', 'program_educator', 'data_officer', 'viewer', 'participant')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  source text not null unique,
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.participants (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  date_of_birth date,
  address text,
  zip text,
  education text check (education in ('High School', 'Trades/Licensed', 'Associates', 'Undergrad', 'Graduate+')),
  stage text not null default 'initial_inquiry' check (stage in ('initial_inquiry', 'screening', 'full_application', 'assessment', 'approval_denial', 'enrollment')),
  status text not null default 'active' check (status in ('active', 'approved', 'denied', 'withdrawn', 'on_hold')),
  referral_source text,
  program_interest text,
  screening_notes text,
  screening_eligible boolean,
  household_size integer check (household_size is null or household_size > 0),
  income_level text check (income_level in ('below_poverty', 'low_income', 'moderate_income', 'above_moderate')),
  employment_status text check (employment_status in ('employed', 'unemployed', 'part_time', 'self_employed', 'retired', 'disabled')),
  assessment_score numeric,
  assessment_notes text,
  priority_level text check (priority_level in ('low', 'medium', 'high', 'urgent')),
  decision text not null default 'pending' check (decision in ('pending', 'approved', 'denied')),
  decision_notes text,
  decision_date date,
  assigned_caseworker text,
  enrollment_date date,
  notes text,
  created_by_id uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.participant_stage_events (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references public.participants(id) on delete cascade,
  from_stage text,
  to_stage text not null,
  changed_by uuid references auth.users(id),
  changed_at timestamptz not null default now()
);

create table if not exists public.participant_notes (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references public.participants(id) on delete cascade,
  body text not null,
  note_type text not null default 'general',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.participant_assessments (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references public.participants(id) on delete cascade,
  score numeric,
  priority_level text check (priority_level in ('low', 'medium', 'high', 'urgent')),
  notes text,
  assessed_by uuid references auth.users(id),
  assessed_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references public.participants(id) on delete cascade,
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  status text not null default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled', 'no_show')),
  location text,
  notes text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references public.participants(id) on delete cascade,
  name text not null,
  url text not null,
  document_type text,
  status text not null default 'received' check (status in ('requested', 'received', 'verified', 'rejected')),
  uploaded_by uuid references auth.users(id),
  uploaded_at timestamptz not null default now()
);

create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id),
  actor_email text,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  before jsonb,
  after jsonb,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.dashboard_configurations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  data_points jsonb not null default '[]'::jsonb,
  zip_filters text[] not null default '{}',
  graph_options jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.external_data_feeds (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  source_type text not null,
  source_config jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'active', 'paused', 'error')),
  last_synced_at timestamptz,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.observability_events (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  severity text not null default 'info' check (severity in ('debug', 'info', 'warn', 'error', 'critical')),
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.programs enable row level security;
alter table public.referrals enable row level security;
alter table public.participants enable row level security;
alter table public.participant_stage_events enable row level security;
alter table public.participant_notes enable row level security;
alter table public.participant_assessments enable row level security;
alter table public.appointments enable row level security;
alter table public.documents enable row level security;
alter table public.audit_events enable row level security;
alter table public.dashboard_configurations enable row level security;
alter table public.external_data_feeds enable row level security;
alter table public.observability_events enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.programs, public.referrals to anon, authenticated;
grant select on all tables in schema public to authenticated;
grant insert, update, delete on public.participants, public.participant_stage_events, public.participant_notes, public.participant_assessments, public.appointments, public.documents, public.audit_events to authenticated;
grant insert, update, delete on public.dashboard_configurations, public.external_data_feeds, public.observability_events to authenticated;
grant update (full_name, email) on public.profiles to authenticated;

create index if not exists participants_stage_idx on public.participants(stage);
create index if not exists participants_status_idx on public.participants(status);
create index if not exists participants_email_idx on public.participants(lower(email));
create index if not exists participant_stage_events_participant_idx on public.participant_stage_events(participant_id, changed_at desc);
create index if not exists audit_events_entity_idx on public.audit_events(entity_type, entity_id, created_at desc);

create or replace function public.current_profile_role()
returns text
language sql
stable
security invoker
as $$ select role from public.profiles where id = (select auth.uid()) $$;

create or replace function public.has_any_role(allowed_roles text[])
returns boolean
language sql
stable
security invoker
as $$ select coalesce(public.current_profile_role() = any(allowed_roles), false) $$;

create policy "profiles read own role-managed users"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()) or public.has_any_role(array['admin', 'exec_director']));

create policy "profiles self update non-role fields"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create or replace function public.update_user_role(target_user_id uuid, next_role text)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare updated_profile public.profiles;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;
  if not exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'exec_director')) then
    raise exception 'Only admin and exec_director can update roles';
  end if;
  if next_role not in ('admin', 'exec_director', 'intake_admin', 'program_director', 'program_educator', 'data_officer', 'viewer', 'participant') then
    raise exception 'Invalid role';
  end if;
  update public.profiles set role = next_role, updated_at = now() where id = target_user_id returning * into updated_profile;
  if updated_profile.id is null then
    raise exception 'Profile not found';
  end if;
  insert into public.audit_events(actor_id, action, entity_type, entity_id, after)
  values (auth.uid(), 'profile.role_updated', 'profile', target_user_id, to_jsonb(updated_profile));
  return updated_profile;
end;
$$;
revoke all on function public.update_user_role(uuid, text) from public;
grant execute on function public.update_user_role(uuid, text) to authenticated;

create policy "reference data readable" on public.programs for select to anon, authenticated using (active = true);
create policy "referrals readable" on public.referrals for select to anon, authenticated using (active = true);

create policy "participants read authorized"
  on public.participants for select to authenticated
  using (
    lower(email) = lower((auth.jwt() ->> 'email'))
    or public.has_any_role(array['admin', 'exec_director', 'intake_admin', 'program_director', 'program_educator', 'data_officer', 'viewer'])
  );
create policy "participants insert operational editors"
  on public.participants for insert to authenticated
  with check (public.has_any_role(array['intake_admin', 'program_director', 'program_educator']));
create policy "participants update operational or participant self-service"
  on public.participants for update to authenticated
  using (public.has_any_role(array['intake_admin', 'program_director', 'program_educator']) or lower(email) = lower((auth.jwt() ->> 'email')))
  with check (public.has_any_role(array['intake_admin', 'program_director', 'program_educator']) or lower(email) = lower((auth.jwt() ->> 'email')));

create or replace function public.enforce_participant_update_permissions()
returns trigger
language plpgsql
security invoker
as $$
begin
  if public.has_any_role(array['intake_admin', 'program_director', 'program_educator']) then
    new.updated_at = now();
    return new;
  end if;
  if lower(old.email) = lower(auth.jwt() ->> 'email') then
    if new.stage is distinct from old.stage
      or new.status is distinct from old.status
      or new.screening_notes is distinct from old.screening_notes
      or new.screening_eligible is distinct from old.screening_eligible
      or new.assessment_score is distinct from old.assessment_score
      or new.assessment_notes is distinct from old.assessment_notes
      or new.priority_level is distinct from old.priority_level
      or new.decision is distinct from old.decision
      or new.decision_notes is distinct from old.decision_notes
      or new.decision_date is distinct from old.decision_date
      or new.assigned_caseworker is distinct from old.assigned_caseworker
      or new.enrollment_date is distinct from old.enrollment_date
      or new.notes is distinct from old.notes
      or new.created_by_id is distinct from old.created_by_id then
      raise exception 'Participants can only update self-service application fields';
    end if;
    new.updated_at = now();
    return new;
  end if;
  raise exception 'Not authorized to update participant';
end;
$$;
drop trigger if exists enforce_participant_update_permissions on public.participants;
create trigger enforce_participant_update_permissions before update on public.participants for each row execute function public.enforce_participant_update_permissions();

create policy "stage events read authorized" on public.participant_stage_events for select to authenticated
  using (public.has_any_role(array['admin', 'exec_director', 'intake_admin', 'program_director', 'program_educator', 'data_officer', 'viewer']) or exists (select 1 from public.participants p where p.id = participant_id and lower(p.email) = lower((auth.jwt() ->> 'email'))));
create policy "stage events insert operational editors" on public.participant_stage_events for insert to authenticated
  with check (public.has_any_role(array['intake_admin', 'program_director', 'program_educator']));

create policy "notes read staff only" on public.participant_notes for select to authenticated
  using (public.has_any_role(array['admin', 'exec_director', 'intake_admin', 'program_director', 'program_educator', 'data_officer', 'viewer']));
create policy "notes write operational editors" on public.participant_notes for insert to authenticated
  with check (public.has_any_role(array['intake_admin', 'program_director', 'program_educator']));
create policy "notes update operational editors" on public.participant_notes for update to authenticated
  using (public.has_any_role(array['intake_admin', 'program_director', 'program_educator']))
  with check (public.has_any_role(array['intake_admin', 'program_director', 'program_educator']));

create policy "assessments read staff only" on public.participant_assessments for select to authenticated
  using (public.has_any_role(array['admin', 'exec_director', 'intake_admin', 'program_director', 'program_educator', 'data_officer', 'viewer']));
create policy "assessments write operational editors" on public.participant_assessments for insert to authenticated
  with check (public.has_any_role(array['intake_admin', 'program_director', 'program_educator']));
create policy "assessments update operational editors" on public.participant_assessments for update to authenticated
  using (public.has_any_role(array['intake_admin', 'program_director', 'program_educator']))
  with check (public.has_any_role(array['intake_admin', 'program_director', 'program_educator']));

create policy "appointments read staff or own" on public.appointments for select to authenticated
  using (public.has_any_role(array['admin', 'exec_director', 'intake_admin', 'program_director', 'program_educator', 'data_officer', 'viewer']) or exists (select 1 from public.participants p where p.id = participant_id and lower(p.email) = lower((auth.jwt() ->> 'email'))));
create policy "appointments write operational editors" on public.appointments for insert to authenticated
  with check (public.has_any_role(array['intake_admin', 'program_director', 'program_educator']));
create policy "appointments update operational editors" on public.appointments for update to authenticated
  using (public.has_any_role(array['intake_admin', 'program_director', 'program_educator']))
  with check (public.has_any_role(array['intake_admin', 'program_director', 'program_educator']));

create policy "documents read staff or own" on public.documents for select to authenticated
  using (public.has_any_role(array['admin', 'exec_director', 'intake_admin', 'program_director', 'program_educator', 'data_officer', 'viewer']) or exists (select 1 from public.participants p where p.id = participant_id and lower(p.email) = lower((auth.jwt() ->> 'email'))));
create policy "documents write operational editors" on public.documents for insert to authenticated
  with check (public.has_any_role(array['intake_admin', 'program_director', 'program_educator']));
create policy "documents update operational editors" on public.documents for update to authenticated
  using (public.has_any_role(array['intake_admin', 'program_director', 'program_educator']))
  with check (public.has_any_role(array['intake_admin', 'program_director', 'program_educator']));

create policy "audit events read leadership and data" on public.audit_events for select to authenticated
  using (public.has_any_role(array['admin', 'exec_director', 'data_officer']));
create policy "audit events insert authenticated" on public.audit_events for insert to authenticated
  with check ((select auth.uid()) is not null);

create policy "dashboard configurations data officer only" on public.dashboard_configurations for all to authenticated
  using (public.has_any_role(array['data_officer'])) with check (public.has_any_role(array['data_officer']));
create policy "external feeds data officer only" on public.external_data_feeds for all to authenticated
  using (public.has_any_role(array['data_officer'])) with check (public.has_any_role(array['data_officer']));
create policy "observability data officer only" on public.observability_events for all to authenticated
  using (public.has_any_role(array['data_officer'])) with check (public.has_any_role(array['data_officer']));

create or replace view public.pipeline_metrics with (security_invoker = true) as
select stage, status, program_interest, zip, count(*)::int as participant_count
from public.participants
where public.has_any_role(array['exec_director', 'data_officer'])
group by stage, status, program_interest, zip;

create or replace view public.caseworker_workload with (security_invoker = true) as
select assigned_caseworker, count(*)::int as assigned_count
from public.participants
where assigned_caseworker is not null
and public.has_any_role(array['exec_director', 'data_officer'])
group by assigned_caseworker;

create or replace function public.get_dashboard_summary()
returns jsonb language sql stable as $$
  select case when public.has_any_role(array['exec_director', 'data_officer']) then jsonb_build_object(
    'total_participants', count(*),
    'active_cases', count(*) filter (where status = 'active'),
    'approved', count(*) filter (where decision = 'approved'),
    'enrolled', count(*) filter (where stage = 'enrollment'),
    'stalled_participants', count(*) filter (where status = 'active' and updated_at < now() - interval '14 days')
  ) else jsonb_build_object('error', 'not_authorized') end
  from public.participants;
$$;

create or replace function public.get_predictive_readiness()
returns jsonb language sql stable as $$
  select case when public.has_any_role(array['data_officer']) then jsonb_build_object(
    'participant_count', count(*),
    'stage_event_count', (select count(*) from public.participant_stage_events),
    'assessment_count', (select count(*) from public.participant_assessments),
    'appointment_count', (select count(*) from public.appointments),
    'data_completeness', coalesce(round(avg((
      (case when program_interest is not null then 1 else 0 end) +
      (case when referral_source is not null then 1 else 0 end) +
      (case when income_level is not null then 1 else 0 end) +
      (case when employment_status is not null then 1 else 0 end) +
      (case when priority_level is not null then 1 else 0 end)
    )::numeric / 5), 2), 0)
  ) else jsonb_build_object('error', 'not_authorized') end
  from public.participants;
$$;

grant select on public.pipeline_metrics, public.caseworker_workload to authenticated;
grant execute on function public.get_dashboard_summary() to authenticated;
grant execute on function public.get_predictive_readiness() to authenticated;

insert into public.programs (name, description) values
  ('Strong Start', 'Foundational support program for participants entering stable housing and employment.'),
  ('Community Shower', 'Safe, accessible shower facilities and hygiene resources.'),
  ('Hygiene Program', 'Essential hygiene kits and personal care support.')
on conflict (name) do nothing;

insert into public.referrals (source, description) values
  ('self', 'Participant self-referral'),
  ('agency', 'Partner agency referral'),
  ('community', 'Community referral'),
  ('healthcare', 'Healthcare referral'),
  ('legal', 'Legal or court referral'),
  ('other', 'Other referral source')
on conflict (source) do nothing;
