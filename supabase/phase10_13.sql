-- =====================================================================
-- Skilloura — Phase 10-13: private files, correct status transitions,
-- approve-preview flow, and admin manual override (with audit trail).
-- Safe to re-run.
-- =====================================================================

-- ---------- Phase 10/11: payment "kind" (advance vs final) -------------
alter table public.payments
  add column if not exists kind text not null default 'advance' check (kind in ('advance', 'final'));

-- ---------- Phase 13: file visibility -----------------------------------
alter table public.files
  add column if not exists visible_to_client boolean not null default true;

-- Clients only ever see files marked visible; admins see everything.
drop policy if exists files_select on public.files;
create policy files_select on public.files for select
  using (public.is_admin() or (client_id = auth.uid() and visible_to_client = true));

-- =====================================================================
-- Phase 11 fix: publish_quote must also move the project to quote_sent
-- =====================================================================
create or replace function public.publish_quote(
  p_quote_id uuid, p_project_id uuid, p_title text, p_scope jsonb,
  p_amount numeric, p_currency text, p_revisions int,
  p_payment_terms text, p_valid_until date
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_client uuid;
  v_id uuid;
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;

  select client_id into v_client from public.projects where id = p_project_id;
  if v_client is null then raise exception 'project not found'; end if;

  if p_quote_id is null then
    insert into public.quotes (project_id, client_id, quote_number, title, scope, amount,
      currency, revisions, payment_terms, status, valid_until)
    values (p_project_id, v_client, 'Q-' || to_char(now(), 'YYYYMMDD') || '-' || substr(gen_random_uuid()::text,1,4),
      p_title, p_scope, p_amount, coalesce(p_currency,'INR'), coalesce(p_revisions,2),
      p_payment_terms, 'sent', p_valid_until)
    returning id into v_id;
  else
    update public.quotes set
      title = p_title, scope = p_scope, amount = p_amount,
      currency = coalesce(p_currency,'INR'), revisions = coalesce(p_revisions,2),
      payment_terms = p_payment_terms, status = 'sent', valid_until = p_valid_until,
      updated_at = now()
    where id = p_quote_id
    returning id into v_id;
  end if;

  update public.project_requests set status = 'quote_prepared', updated_at = now()
  where id = (select request_id from public.projects where id = p_project_id);

  update public.projects set status = 'quote_sent', updated_at = now() where id = p_project_id;

  perform public.notify_user(v_client, 'Your quote is ready',
    'A quote for "' || coalesce(p_title,'your project') || '" is ready to review.',
    'quote_ready', '/client/dashboard/projects/' || p_project_id);

  insert into public.activity_logs (actor_id, entity_type, entity_id, action)
  values (auth.uid(), 'quote', v_id, 'quote_published');

  return v_id;
end;
$$;
grant execute on function public.publish_quote(
  uuid, uuid, text, jsonb, numeric, text, int, text, date
) to authenticated;

-- =====================================================================
-- Phase 11 fix: "Request changes" must set change_requested, not rejected
-- =====================================================================
create or replace function public.respond_to_quote(
  p_quote_id uuid, p_approve boolean
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare v_project uuid; v_client uuid; v_title text;
begin
  select project_id, client_id, title into v_project, v_client, v_title
  from public.quotes where id = p_quote_id;

  if v_client is null then raise exception 'quote not found'; end if;
  if v_client <> auth.uid() and not public.is_admin() then raise exception 'not authorized'; end if;

  update public.quotes
    set status = case when p_approve then 'approved' else 'change_requested' end, updated_at = now()
  where id = p_quote_id;

  if p_approve then
    update public.projects set status = 'advance_pending', updated_at = now() where id = v_project;
  end if;

  perform public.notify_admins('Quote ' || (case when p_approve then 'approved' else 'change requested' end),
    coalesce(v_title,'A quote') || ' was ' || (case when p_approve then 'approved' else 'flagged for changes' end) || ' by the client.',
    'quote_approved', '/admin/dashboard/projects/' || v_project);

  insert into public.activity_logs (actor_id, entity_type, entity_id, action)
  values (auth.uid(), 'quote', p_quote_id, case when p_approve then 'quote_approved' else 'quote_change_requested' end);
end;
$$;
grant execute on function public.respond_to_quote(uuid, boolean) to authenticated;

-- =====================================================================
-- Phase 11 fix: create_payment_request needs a kind (advance/final)
-- =====================================================================
drop function if exists public.create_payment_request(uuid, numeric, text, date);

create or replace function public.create_payment_request(
  p_project_id uuid, p_amount numeric, p_currency text, p_due_date date, p_kind text
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare v_client uuid; v_id uuid;
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;
  select client_id into v_client from public.projects where id = p_project_id;
  if v_client is null then raise exception 'project not found'; end if;

  insert into public.payments (project_id, client_id, invoice_number, amount, currency, status, due_date, kind)
  values (p_project_id, v_client, 'INV-' || to_char(now(),'YYYYMMDD') || '-' || substr(gen_random_uuid()::text,1,4),
    p_amount, coalesce(p_currency,'INR'), 'pending', p_due_date, coalesce(p_kind,'advance'))
  returning id into v_id;

  perform public.notify_user(v_client, 'Payment request',
    'A payment of ' || coalesce(p_currency,'INR') || ' ' || p_amount || ' is requested.',
    'payment_request', '/client/dashboard/projects/' || p_project_id);

  return v_id;
end;
$$;
grant execute on function public.create_payment_request(uuid, numeric, text, date, text) to authenticated;

-- =====================================================================
-- Phase 11 fix: verify_payment must move project status by payment kind
-- =====================================================================
create or replace function public.verify_payment(
  p_payment_id uuid, p_verify boolean
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare v_client uuid; v_project uuid; v_kind text;
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;

  select client_id, project_id, kind into v_client, v_project, v_kind from public.payments where id = p_payment_id;
  if v_client is null then raise exception 'payment not found'; end if;

  update public.payments set
    status = case when p_verify then 'verified' else 'rejected' end,
    paid_at = case when p_verify then now() else null end,
    updated_at = now()
  where id = p_payment_id;

  if p_verify then
    update public.projects
      set status = case when v_kind = 'final' then 'delivered' else 'in_progress' end,
          updated_at = now()
    where id = v_project;
  end if;

  perform public.notify_user(v_client,
    case when p_verify then 'Payment verified' else 'Payment rejected' end,
    case when p_verify then 'Your payment has been verified. Work will proceed.'
         else 'Your payment proof could not be verified. Please resubmit.' end,
    'payment_verified', '/client/dashboard/projects/' || v_project);

  insert into public.activity_logs (actor_id, entity_type, entity_id, action)
  values (auth.uid(), 'payment', p_payment_id, case when p_verify then 'payment_verified' else 'payment_rejected' end);
end;
$$;
grant execute on function public.verify_payment(uuid, boolean) to authenticated;

-- =====================================================================
-- Phase 11: Approve Preview -> project final_payment_pending
-- =====================================================================
create or replace function public.approve_preview(p_project_id uuid) returns void
language plpgsql
security definer
set search_path = public
as $$
declare v_client uuid;
begin
  select client_id into v_client from public.projects where id = p_project_id;
  if v_client is null then raise exception 'project not found'; end if;
  if v_client <> auth.uid() then raise exception 'not authorized'; end if;

  update public.projects set status = 'final_payment_pending', updated_at = now() where id = p_project_id;

  perform public.notify_admins('Preview approved',
    'The client approved the preview. Final payment can now be requested.',
    'preview_shared', '/admin/dashboard/projects/' || p_project_id);

  insert into public.activity_logs (actor_id, entity_type, entity_id, action)
  values (auth.uid(), 'project', p_project_id, 'preview_approved');
end;
$$;
grant execute on function public.approve_preview(uuid) to authenticated;

-- =====================================================================
-- Phase 13: Admin manual override (every edit is logged old -> new)
-- =====================================================================
create or replace function public.admin_edit_project(
  p_project_id uuid, p_title text, p_description text,
  p_status public.project_status, p_progress int
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare v_old public.projects%rowtype; v_new public.projects%rowtype;
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;
  select * into v_old from public.projects where id = p_project_id;
  if v_old.id is null then raise exception 'project not found'; end if;

  update public.projects set
    title = coalesce(p_title, title), description = coalesce(p_description, description),
    status = coalesce(p_status, status), progress = coalesce(p_progress, progress), updated_at = now()
  where id = p_project_id
  returning * into v_new;

  insert into public.activity_logs (actor_id, entity_type, entity_id, action, meta)
  values (auth.uid(), 'project', p_project_id, 'manual_override',
    jsonb_build_object('old', to_jsonb(v_old), 'new', to_jsonb(v_new), 'edited_at', now()));

  if v_old.status is distinct from v_new.status then
    perform public.notify_user(v_new.client_id, 'Project updated',
      'Your project status was updated to: ' || v_new.status::text, 'project_status',
      '/client/dashboard/projects/' || p_project_id);
  end if;
end;
$$;
grant execute on function public.admin_edit_project(uuid, text, text, public.project_status, int) to authenticated;

create or replace function public.admin_edit_payment(
  p_payment_id uuid, p_amount numeric, p_status public.payment_status,
  p_method text, p_reference text, p_due_date date
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare v_old public.payments%rowtype; v_new public.payments%rowtype;
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;
  select * into v_old from public.payments where id = p_payment_id;
  if v_old.id is null then raise exception 'payment not found'; end if;

  update public.payments set
    amount = coalesce(p_amount, amount), status = coalesce(p_status, status),
    method = coalesce(p_method, method), reference = coalesce(p_reference, reference),
    due_date = coalesce(p_due_date, due_date), updated_at = now()
  where id = p_payment_id
  returning * into v_new;

  insert into public.activity_logs (actor_id, entity_type, entity_id, action, meta)
  values (auth.uid(), 'payment', p_payment_id, 'manual_override',
    jsonb_build_object('old', to_jsonb(v_old), 'new', to_jsonb(v_new), 'edited_at', now()));
end;
$$;
grant execute on function public.admin_edit_payment(uuid, numeric, public.payment_status, text, text, date) to authenticated;

create or replace function public.admin_edit_quote(
  p_quote_id uuid, p_title text, p_amount numeric, p_scope jsonb,
  p_status public.quote_status, p_revisions int, p_payment_terms text, p_valid_until date
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare v_old public.quotes%rowtype; v_new public.quotes%rowtype;
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;
  select * into v_old from public.quotes where id = p_quote_id;
  if v_old.id is null then raise exception 'quote not found'; end if;

  update public.quotes set
    title = coalesce(p_title, title), amount = coalesce(p_amount, amount),
    scope = coalesce(p_scope, scope), status = coalesce(p_status, status),
    revisions = coalesce(p_revisions, revisions), payment_terms = coalesce(p_payment_terms, payment_terms),
    valid_until = coalesce(p_valid_until, valid_until), updated_at = now()
  where id = p_quote_id
  returning * into v_new;

  insert into public.activity_logs (actor_id, entity_type, entity_id, action, meta)
  values (auth.uid(), 'quote', p_quote_id, 'manual_override',
    jsonb_build_object('old', to_jsonb(v_old), 'new', to_jsonb(v_new), 'edited_at', now()));
end;
$$;
grant execute on function public.admin_edit_quote(uuid, text, numeric, jsonb, public.quote_status, int, text, date) to authenticated;

create or replace function public.admin_edit_client(
  p_user_id uuid, p_full_name text, p_phone text,
  p_business_name text, p_city_country text, p_whatsapp text, p_status public.user_status
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare v_old_up public.user_profiles%rowtype; v_new_up public.user_profiles%rowtype;
declare v_old_cp public.client_profiles%rowtype; v_new_cp public.client_profiles%rowtype;
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;
  select * into v_old_up from public.user_profiles where id = p_user_id;
  if v_old_up.id is null then raise exception 'client not found'; end if;
  select * into v_old_cp from public.client_profiles where user_id = p_user_id;

  update public.user_profiles set
    full_name = coalesce(p_full_name, full_name), phone = coalesce(p_phone, phone),
    status = coalesce(p_status, status), updated_at = now()
  where id = p_user_id
  returning * into v_new_up;

  update public.client_profiles set
    business_name = coalesce(p_business_name, business_name),
    city_country = coalesce(p_city_country, city_country),
    whatsapp = coalesce(p_whatsapp, whatsapp), updated_at = now()
  where user_id = p_user_id
  returning * into v_new_cp;

  insert into public.activity_logs (actor_id, entity_type, entity_id, action, meta)
  values (auth.uid(), 'client', p_user_id, 'manual_override',
    jsonb_build_object('old', to_jsonb(v_old_up) || jsonb_build_object('client_profile', to_jsonb(v_old_cp)),
                        'new', to_jsonb(v_new_up) || jsonb_build_object('client_profile', to_jsonb(v_new_cp)),
                        'edited_at', now()));
end;
$$;
grant execute on function public.admin_edit_client(uuid, text, text, text, text, text, public.user_status) to authenticated;

create or replace function public.admin_edit_preview_link(
  p_id uuid, p_label text, p_url text, p_is_active boolean
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare v_old public.preview_links%rowtype; v_new public.preview_links%rowtype;
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;
  select * into v_old from public.preview_links where id = p_id;
  if v_old.id is null then raise exception 'preview link not found'; end if;

  update public.preview_links set
    label = coalesce(p_label, label), url = coalesce(p_url, url),
    is_active = coalesce(p_is_active, is_active)
  where id = p_id
  returning * into v_new;

  insert into public.activity_logs (actor_id, entity_type, entity_id, action, meta)
  values (auth.uid(), 'preview_link', p_id, 'manual_override',
    jsonb_build_object('old', to_jsonb(v_old), 'new', to_jsonb(v_new), 'edited_at', now()));
end;
$$;
grant execute on function public.admin_edit_preview_link(uuid, text, text, boolean) to authenticated;

create or replace function public.admin_edit_file_visibility(
  p_file_id uuid, p_visible boolean
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare v_old public.files%rowtype; v_new public.files%rowtype;
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;
  select * into v_old from public.files where id = p_file_id;
  if v_old.id is null then raise exception 'file not found'; end if;

  update public.files set visible_to_client = p_visible where id = p_file_id returning * into v_new;

  insert into public.activity_logs (actor_id, entity_type, entity_id, action, meta)
  values (auth.uid(), 'file', p_file_id, 'manual_override',
    jsonb_build_object('old', to_jsonb(v_old), 'new', to_jsonb(v_new), 'edited_at', now()));
end;
$$;
grant execute on function public.admin_edit_file_visibility(uuid, boolean) to authenticated;

create or replace function public.admin_edit_revision(
  p_revision_id uuid, p_status public.revision_status, p_notes text
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare v_old public.revisions%rowtype; v_new public.revisions%rowtype;
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;
  select * into v_old from public.revisions where id = p_revision_id;
  if v_old.id is null then raise exception 'revision not found'; end if;

  update public.revisions set
    status = coalesce(p_status, status), notes = coalesce(p_notes, notes),
    completed_at = case when p_status = 'completed' then now() else completed_at end
  where id = p_revision_id
  returning * into v_new;

  insert into public.activity_logs (actor_id, entity_type, entity_id, action, meta)
  values (auth.uid(), 'revision', p_revision_id, 'manual_override',
    jsonb_build_object('old', to_jsonb(v_old), 'new', to_jsonb(v_new), 'edited_at', now()));
end;
$$;
grant execute on function public.admin_edit_revision(uuid, public.revision_status, text) to authenticated;

-- =====================================================================
-- Done.
-- =====================================================================
