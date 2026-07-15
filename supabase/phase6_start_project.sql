-- =====================================================================
-- Skilloura — Phase 6: Start Project flow (guest requests + attach on login)
-- Safe to re-run.
-- =====================================================================

-- ---------- 1. Guest contact columns on project_requests --------------
alter table public.project_requests
  add column if not exists guest_name  text,
  add column if not exists guest_email text,
  add column if not exists guest_phone text;

create index if not exists idx_pr_guest_email
  on public.project_requests (lower(guest_email));

-- ---------- 2. Submit a request (guest OR logged-in) ------------------
-- SECURITY DEFINER so the table is never directly writable by anon — all
-- writes go through this controlled function. Upserts by a client-provided
-- ref, so the "partial" (email/phone) and "full" submit are the SAME row
-- (no duplicate lead). If the caller is logged in, it's attached to them.
create or replace function public.submit_project_request(
  p_ref          uuid,
  p_name         text,
  p_email        text,
  p_phone        text,
  p_service      text,
  p_service_type text,
  p_description  text,
  p_budget       text,
  p_deadline     text,
  p_partial      boolean
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_status public.project_request_status :=
    case when p_partial then 'draft' else 'submitted' end;
begin
  insert into public.project_requests as pr (
    id, client_id, guest_name, guest_email, guest_phone,
    service_category, service_type, description, budget_range, deadline, status
  ) values (
    p_ref, v_uid, p_name, nullif(p_email,''), p_phone,
    p_service, p_service_type, p_description, p_budget, p_deadline, v_status
  )
  on conflict (id) do update set
    client_id        = coalesce(pr.client_id, v_uid),
    guest_name       = excluded.guest_name,
    guest_email      = excluded.guest_email,
    guest_phone      = excluded.guest_phone,
    service_category = excluded.service_category,
    service_type     = excluded.service_type,
    description      = excluded.description,
    budget_range     = excluded.budget_range,
    deadline         = excluded.deadline,
    -- once submitted, never fall back to draft
    status           = case when p_partial then pr.status else 'submitted'::public.project_request_status end,
    updated_at       = now();

  return p_ref;
end;
$$;

grant execute on function public.submit_project_request(
  uuid, text, text, text, text, text, text, text, text, boolean
) to anon, authenticated;

-- ---------- 3. Attach matching guest requests after login -------------
-- Called by a logged-in, email-verified user. Attaches any unclaimed
-- requests whose guest_email matches their verified account email.
create or replace function public.claim_my_requests()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email     text;
  v_confirmed timestamptz;
  v_count     int;
begin
  select email, email_confirmed_at into v_email, v_confirmed
  from auth.users where id = auth.uid();

  -- Only attach for a verified email — protects against claiming by an
  -- unverified/spoofed address.
  if v_email is null or v_confirmed is null then
    return 0;
  end if;

  update public.project_requests
    set client_id = auth.uid(), updated_at = now()
  where client_id is null
    and lower(guest_email) = lower(v_email);

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

grant execute on function public.claim_my_requests() to authenticated;

-- =====================================================================
-- Done. Guests submit via submit_project_request() (no direct table write);
-- after they sign up and confirm their email, claim_my_requests() attaches
-- their earlier request(s) by verified email.
-- =====================================================================
