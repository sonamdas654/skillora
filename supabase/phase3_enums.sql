-- =====================================================================
-- Skilloura — Phase 3 migration: convert existing text+check columns to
-- exact Postgres ENUM types on the ALREADY-CREATED live database.
-- Safe to re-run. Maps any existing rows' old values to the new vocabulary
-- before changing the column type, so no data is lost.
-- =====================================================================

-- ---------- 1. Create the enum types (idempotent) ---------------------
do $$ begin
  create type public.user_role as enum ('client','admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.user_status as enum ('active','inactive','blocked');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.project_request_status as enum
    ('draft','submitted','under_review','quote_prepared','converted','closed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.project_status as enum
    ('request_received','quote_sent','advance_pending','in_progress',
     'preview_shared','revision','final_payment_pending','delivered','closed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.quote_status as enum
    ('draft','sent','viewed','change_requested','approved','rejected','expired');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_status as enum
    ('pending','submitted','verified','rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.revision_status as enum
    ('submitted','under_review','accepted','completed','not_in_scope');
exception when duplicate_object then null; end $$;

-- ---------- 2. user_profiles.role -> enum ------------------------------
alter table public.user_profiles drop constraint if exists user_profiles_role_check;
alter table public.user_profiles alter column role drop default;
alter table public.user_profiles
  alter column role type public.user_role using role::text::public.user_role;
alter table public.user_profiles alter column role set default 'client';

-- ---------- 3. user_profiles.status (new column) -----------------------
alter table public.user_profiles
  add column if not exists status public.user_status not null default 'active';

-- ---------- 4. project_requests.status -> enum -------------------------
update public.project_requests set status = case status::text
  when 'new'       then 'submitted'
  when 'reviewed'  then 'under_review'
  when 'quoted'    then 'quote_prepared'
  when 'converted' then 'converted'
  when 'closed'    then 'closed'
  else status::text
end
where status::text not in
  ('draft','submitted','under_review','quote_prepared','converted','closed');

alter table public.project_requests drop constraint if exists project_requests_status_check;
alter table public.project_requests alter column status drop default;
alter table public.project_requests
  alter column status type public.project_request_status using status::text::public.project_request_status;
alter table public.project_requests alter column status set default 'draft';

-- ---------- 5. projects.status -> enum ----------------------------------
update public.projects set status = case status::text
  when 'requested'   then 'request_received'
  when 'quoted'       then 'quote_sent'
  when 'in_progress'  then 'in_progress'
  when 'preview'       then 'preview_shared'
  when 'revision'      then 'revision'
  when 'delivered'     then 'delivered'
  when 'closed'        then 'closed'
  when 'cancelled'     then 'closed'
  else status::text
end
where status::text not in
  ('request_received','quote_sent','advance_pending','in_progress',
   'preview_shared','revision','final_payment_pending','delivered','closed');

alter table public.projects drop constraint if exists projects_status_check;
alter table public.projects alter column status drop default;
alter table public.projects
  alter column status type public.project_status using status::text::public.project_status;
alter table public.projects alter column status set default 'request_received';

-- ---------- 6. quotes.status -> enum ------------------------------------
update public.quotes set status = case status::text
  when 'accepted' then 'approved'
  else status::text
end
where status::text not in
  ('draft','sent','viewed','change_requested','approved','rejected','expired');

alter table public.quotes drop constraint if exists quotes_status_check;
alter table public.quotes alter column status drop default;
alter table public.quotes
  alter column status type public.quote_status using status::text::public.quote_status;
alter table public.quotes alter column status set default 'draft';

-- ---------- 7. payments.status -> enum ----------------------------------
update public.payments set status = case status::text
  when 'partial'  then 'submitted'
  when 'paid'     then 'verified'
  when 'refunded' then 'rejected'
  else status::text
end
where status::text not in ('pending','submitted','verified','rejected');

alter table public.payments drop constraint if exists payments_status_check;
alter table public.payments alter column status drop default;
alter table public.payments
  alter column status type public.payment_status using status::text::public.payment_status;
alter table public.payments alter column status set default 'pending';

-- ---------- 8. revisions.status -> enum ---------------------------------
update public.revisions set status = case status::text
  when 'requested'   then 'submitted'
  when 'in_progress' then 'under_review'
  else status::text
end
where status::text not in
  ('submitted','under_review','accepted','completed','not_in_scope');

alter table public.revisions drop constraint if exists revisions_status_check;
alter table public.revisions alter column status drop default;
alter table public.revisions
  alter column status type public.revision_status using status::text::public.revision_status;
alter table public.revisions alter column status set default 'submitted';

-- =====================================================================
-- Done. All status columns now use exact, fixed Postgres enum types.
-- is_admin() and RLS policies compare against these via literal casts and
-- are unaffected by this change.
-- =====================================================================
