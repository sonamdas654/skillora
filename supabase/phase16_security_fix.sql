-- =====================================================================
-- Skilloura — CRITICAL SECURITY FIX (post-launch audit finding)
--
-- Found via live testing: the generic "owner-based" RLS policies from
-- Phase 2 granted clients direct INSERT/UPDATE on projects, quotes,
-- payments, revisions, preview_links, files, messages and
-- project_requests for ANY column on their own rows. A client could
-- therefore call the Supabase REST API directly (bypassing the app
-- entirely) and:
--   - mark their own payment as "verified" without ever paying
--   - mark their own quote as "approved" at any price they choose
--   - fabricate a project_request with status='converted'
--   - via user_profiles' identical UPDATE policy, self-promote role
--     from 'client' to 'admin' (full account takeover)
--
-- All legitimate client mutations already go through SECURITY DEFINER
-- RPCs (owned by `postgres`, which has rolbypassrls=true — verified
-- live), so they are UNAFFECTED by removing the direct write grants
-- below. Safe to re-run.
-- =====================================================================

-- ---------- 1. user_profiles: block client self-escalation -------------
create or replace function public.protect_user_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() and (new.role is distinct from old.role or new.status is distinct from old.status) then
    raise exception 'not authorized to change role or status';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_role_status on public.user_profiles;
create trigger protect_role_status
before update on public.user_profiles
for each row execute function public.protect_user_profile_role();

-- ---------- 2. Business tables: clients get SELECT only -----------------
-- (writes happen exclusively through the SECURITY DEFINER RPCs)
do $$
declare t text;
begin
  foreach t in array array[
    'projects', 'quotes', 'payments', 'revisions',
    'preview_links', 'files', 'messages', 'project_requests'
  ]
  loop
    execute format('drop policy if exists %I_insert on public.%I;', t, t);
    execute format('create policy %I_insert on public.%I for insert
                    with check (public.is_admin());', t, t);

    execute format('drop policy if exists %I_update on public.%I;', t, t);
    execute format('create policy %I_update on public.%I for update
                    using (public.is_admin())
                    with check (public.is_admin());', t, t);
    -- select/delete policies from Phase 2 (owner read, admin-only delete) are unchanged.
  end loop;
end $$;

-- ---------- 3. activity_logs / notifications: admin-only insert --------
-- (RPCs write these as `postgres`, bypassing RLS, so client grants aren't needed)
drop policy if exists log_insert on public.activity_logs;
create policy log_insert on public.activity_logs for insert
  with check (public.is_admin());

drop policy if exists notif_insert on public.notifications;
create policy notif_insert on public.notifications for insert
  with check (public.is_admin());

-- =====================================================================
-- Done.
-- =====================================================================
