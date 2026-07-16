-- =====================================================================
-- Skilloura — restore the per-service smart-form intake that existed in
-- the old system (lib/services.ts already has a full formFields[] question
-- set per service category — it was just never wired into the new
-- get-started flow after the Supabase migration). Adds a place to store
-- those answers.
-- =====================================================================

alter table public.project_requests
  add column if not exists form_answers jsonb not null default '{}'::jsonb;

-- Adding a parameter changes the function's signature — Postgres would treat
-- this as an overload rather than a replace, which is ambiguous to call.
-- Drop the old 10-arg version explicitly first.
drop function if exists public.submit_project_request(
  uuid, text, text, text, text, text, text, text, text, boolean
);

create or replace function public.submit_project_request(
  p_ref           uuid,
  p_name          text,
  p_email         text,
  p_phone         text,
  p_service       text,
  p_service_type  text,
  p_description   text,
  p_budget        text,
  p_deadline      text,
  p_partial       boolean,
  p_form_answers  jsonb default '{}'::jsonb
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
    service_category, service_type, description, budget_range, deadline,
    form_answers, status
  ) values (
    p_ref, v_uid, p_name, nullif(p_email,''), p_phone,
    p_service, p_service_type, p_description, p_budget, p_deadline,
    coalesce(p_form_answers, '{}'::jsonb), v_status
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
    form_answers     = coalesce(excluded.form_answers, pr.form_answers),
    status           = case when p_partial then pr.status else 'submitted'::public.project_request_status end,
    updated_at       = now();

  return p_ref;
end;
$$;

grant execute on function public.submit_project_request(
  uuid, text, text, text, text, text, text, text, text, boolean, jsonb
) to anon, authenticated;

-- =====================================================================
-- Done.
-- =====================================================================
