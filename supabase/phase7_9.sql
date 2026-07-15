-- =====================================================================
-- Skilloura — Phase 7/8/9: Client Portal + Admin OS + Notifications
-- Safe to re-run.
-- =====================================================================

-- ---------- payments: proof-of-payment screenshot ----------------------
alter table public.payments
  add column if not exists screenshot_path text;

-- ---------- Storage bucket for project files / payment screenshots -----
insert into storage.buckets (id, name, public)
values ('project-files', 'project-files', false)
on conflict (id) do nothing;

-- Path convention: <client_id>/<anything>. Client can read/write their own
-- prefix; admins can read/write everything. is_admin() already defined.
drop policy if exists pf_select on storage.objects;
create policy pf_select on storage.objects for select
  using (
    bucket_id = 'project-files'
    and (public.is_admin() or (storage.foldername(name))[1] = auth.uid()::text)
  );

drop policy if exists pf_insert on storage.objects;
create policy pf_insert on storage.objects for insert
  with check (
    bucket_id = 'project-files'
    and (public.is_admin() or (storage.foldername(name))[1] = auth.uid()::text)
  );

drop policy if exists pf_update on storage.objects;
create policy pf_update on storage.objects for update
  using (
    bucket_id = 'project-files'
    and (public.is_admin() or (storage.foldername(name))[1] = auth.uid()::text)
  );

drop policy if exists pf_delete on storage.objects;
create policy pf_delete on storage.objects for delete
  using (bucket_id = 'project-files' and public.is_admin());

-- =====================================================================
-- Notification helper (internal — called by the RPCs below)
-- =====================================================================
create or replace function public.notify_user(
  p_user_id uuid, p_title text, p_body text, p_type text, p_link text
) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_user_id is null then return; end if;
  insert into public.notifications (user_id, title, body, type, link)
  values (p_user_id, p_title, p_body, p_type, p_link);
end;
$$;

-- Notify every admin (used when a client does something admins must see).
create or replace function public.notify_admins(
  p_title text, p_body text, p_type text, p_link text
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare r record;
begin
  for r in select id from public.user_profiles where role = 'admin' loop
    perform public.notify_user(r.id, p_title, p_body, p_type, p_link);
  end loop;
end;
$$;

-- =====================================================================
-- 1. Admin: convert a project request into a project
-- =====================================================================
create or replace function public.convert_request_to_project(
  p_request_id uuid, p_title text
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_req public.project_requests%rowtype;
  v_project_id uuid;
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;

  select * into v_req from public.project_requests where id = p_request_id;
  if v_req.id is null then raise exception 'request not found'; end if;
  if v_req.client_id is null then raise exception 'request has no linked client account yet'; end if;

  insert into public.projects (client_id, request_id, title, description, service_category, status)
  values (v_req.client_id, v_req.id, coalesce(p_title, v_req.service_category, 'New project'),
          v_req.description, v_req.service_category, 'request_received')
  returning id into v_project_id;

  update public.project_requests set status = 'converted', updated_at = now() where id = p_request_id;

  perform public.notify_user(v_req.client_id, 'Your project has started',
    'We have started your project: ' || coalesce(p_title, v_req.service_category, ''),
    'request_received', '/client/dashboard/projects/' || v_project_id);

  insert into public.activity_logs (actor_id, entity_type, entity_id, action)
  values (auth.uid(), 'project', v_project_id, 'converted_from_request');

  return v_project_id;
end;
$$;
grant execute on function public.convert_request_to_project(uuid, text) to authenticated;

-- =====================================================================
-- 2. Admin: update project status
-- =====================================================================
create or replace function public.update_project_status(
  p_project_id uuid, p_status public.project_status, p_progress int
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare v_client uuid;
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;

  update public.projects
    set status = p_status,
        progress = coalesce(p_progress, progress),
        updated_at = now()
  where id = p_project_id
  returning client_id into v_client;

  perform public.notify_user(v_client, 'Project update',
    'Your project status changed to: ' || p_status::text,
    'project_status', '/client/dashboard/projects/' || p_project_id);

  insert into public.activity_logs (actor_id, entity_type, entity_id, action, meta)
  values (auth.uid(), 'project', p_project_id, 'status_changed', jsonb_build_object('status', p_status));
end;
$$;
grant execute on function public.update_project_status(uuid, public.project_status, int) to authenticated;

-- =====================================================================
-- 3. Admin: publish a quote (create or update, set status=sent)
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
-- 4. Client: approve or reject a quote
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
    set status = case when p_approve then 'approved' else 'rejected' end, updated_at = now()
  where id = p_quote_id;

  if p_approve then
    update public.projects set status = 'advance_pending', updated_at = now() where id = v_project;
  end if;

  perform public.notify_admins('Quote ' || (case when p_approve then 'approved' else 'rejected' end),
    coalesce(v_title,'A quote') || ' was ' || (case when p_approve then 'approved' else 'rejected' end) || ' by the client.',
    'quote_approved', '/admin/dashboard/projects/' || v_project);

  insert into public.activity_logs (actor_id, entity_type, entity_id, action)
  values (auth.uid(), 'quote', p_quote_id, case when p_approve then 'quote_approved' else 'quote_rejected' end);
end;
$$;
grant execute on function public.respond_to_quote(uuid, boolean) to authenticated;

-- =====================================================================
-- 5. Admin: create a payment request (invoice)
-- =====================================================================
create or replace function public.create_payment_request(
  p_project_id uuid, p_amount numeric, p_currency text, p_due_date date
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

  insert into public.payments (project_id, client_id, invoice_number, amount, currency, status, due_date)
  values (p_project_id, v_client, 'INV-' || to_char(now(),'YYYYMMDD') || '-' || substr(gen_random_uuid()::text,1,4),
    p_amount, coalesce(p_currency,'INR'), 'pending', p_due_date)
  returning id into v_id;

  perform public.notify_user(v_client, 'Payment request',
    'A payment of ' || coalesce(p_currency,'INR') || ' ' || p_amount || ' is requested.',
    'payment_request', '/client/dashboard/projects/' || p_project_id);

  return v_id;
end;
$$;
grant execute on function public.create_payment_request(uuid, numeric, text, date) to authenticated;

-- =====================================================================
-- 6. Client: submit payment proof (screenshot + reference)
-- =====================================================================
create or replace function public.submit_payment_proof(
  p_payment_id uuid, p_method text, p_reference text, p_screenshot_path text
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare v_client uuid; v_project uuid;
begin
  select client_id, project_id into v_client, v_project from public.payments where id = p_payment_id;
  if v_client is null then raise exception 'payment not found'; end if;
  if v_client <> auth.uid() then raise exception 'not authorized'; end if;

  update public.payments set
    method = p_method, reference = p_reference, screenshot_path = p_screenshot_path,
    status = 'submitted', updated_at = now()
  where id = p_payment_id;

  perform public.notify_admins('Payment submitted',
    'A client submitted payment proof for review.', 'payment_submitted',
    '/admin/dashboard/projects/' || v_project);

  insert into public.activity_logs (actor_id, entity_type, entity_id, action)
  values (auth.uid(), 'payment', p_payment_id, 'payment_submitted');
end;
$$;
grant execute on function public.submit_payment_proof(uuid, text, text, text) to authenticated;

-- =====================================================================
-- 7. Admin: verify or reject payment
-- =====================================================================
create or replace function public.verify_payment(
  p_payment_id uuid, p_verify boolean
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare v_client uuid; v_project uuid;
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;

  select client_id, project_id into v_client, v_project from public.payments where id = p_payment_id;
  if v_client is null then raise exception 'payment not found'; end if;

  update public.payments set
    status = case when p_verify then 'verified' else 'rejected' end,
    paid_at = case when p_verify then now() else null end,
    updated_at = now()
  where id = p_payment_id;

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
-- 8. Admin: share a preview link
-- =====================================================================
create or replace function public.share_preview_link(
  p_project_id uuid, p_label text, p_url text
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

  insert into public.preview_links (project_id, client_id, label, url)
  values (p_project_id, v_client, p_label, p_url)
  returning id into v_id;

  update public.projects set status = 'preview_shared', updated_at = now() where id = p_project_id;

  perform public.notify_user(v_client, 'Preview ready',
    'A preview of your project is ready to view.', 'preview_shared',
    '/client/dashboard/projects/' || p_project_id);

  return v_id;
end;
$$;
grant execute on function public.share_preview_link(uuid, text, text) to authenticated;

-- =====================================================================
-- 9. Client: submit a revision request
-- =====================================================================
create or replace function public.submit_revision(
  p_project_id uuid, p_items jsonb, p_notes text
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare v_client uuid; v_round int; v_id uuid;
begin
  select client_id into v_client from public.projects where id = p_project_id;
  if v_client is null then raise exception 'project not found'; end if;
  if v_client <> auth.uid() then raise exception 'not authorized'; end if;

  select coalesce(max(round_number),0) + 1 into v_round from public.revisions where project_id = p_project_id;

  insert into public.revisions (project_id, client_id, round_number, items, notes, status)
  values (p_project_id, v_client, v_round, p_items, p_notes, 'submitted')
  returning id into v_id;

  update public.projects set status = 'revision', updated_at = now() where id = p_project_id;

  perform public.notify_admins('Revision requested',
    'A client requested a revision (round ' || v_round || ').', 'revision_submitted',
    '/admin/dashboard/projects/' || p_project_id);

  return v_id;
end;
$$;
grant execute on function public.submit_revision(uuid, jsonb, text) to authenticated;

-- =====================================================================
-- 10. Admin: respond to / complete a revision
-- =====================================================================
create or replace function public.respond_to_revision(
  p_revision_id uuid, p_status public.revision_status
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare v_client uuid; v_project uuid;
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;

  select client_id, project_id into v_client, v_project from public.revisions where id = p_revision_id;
  if v_client is null then raise exception 'revision not found'; end if;

  update public.revisions set
    status = p_status,
    completed_at = case when p_status = 'completed' then now() else completed_at end
  where id = p_revision_id;

  if p_status = 'completed' then
    update public.projects set status = 'delivered', updated_at = now() where id = v_project;
  end if;

  perform public.notify_user(v_client, 'Revision update',
    'Your revision request is now: ' || p_status::text, 'revision_completed',
    '/client/dashboard/projects/' || v_project);
end;
$$;
grant execute on function public.respond_to_revision(uuid, public.revision_status) to authenticated;

-- =====================================================================
-- 11. Files: register uploaded file metadata (bytes already in Storage)
-- =====================================================================
create or replace function public.register_file(
  p_project_id uuid, p_name text, p_storage_path text,
  p_size_bytes bigint, p_mime_type text, p_kind text
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare v_client uuid; v_id uuid;
begin
  select client_id into v_client from public.projects where id = p_project_id;
  if v_client is null then raise exception 'project not found'; end if;
  if v_client <> auth.uid() and not public.is_admin() then raise exception 'not authorized'; end if;

  insert into public.files (project_id, client_id, uploaded_by, name, storage_path, size_bytes, mime_type, kind)
  values (p_project_id, v_client, auth.uid(), p_name, p_storage_path, p_size_bytes, p_mime_type,
    coalesce(p_kind, case when public.is_admin() then 'delivery' else 'upload' end))
  returning id into v_id;

  if public.is_admin() then
    perform public.notify_user(v_client, 'New file delivered',
      p_name || ' has been uploaded for your project.', 'handover_uploaded',
      '/client/dashboard/projects/' || p_project_id);
  else
    perform public.notify_admins('Client uploaded a file',
      p_name || ' was uploaded by the client.', 'file_uploaded',
      '/admin/dashboard/projects/' || p_project_id);
  end if;

  return v_id;
end;
$$;
grant execute on function public.register_file(uuid, text, text, bigint, text, text) to authenticated;

-- =====================================================================
-- 12. Messages: send + notify the other side
-- =====================================================================
create or replace function public.send_message(
  p_project_id uuid, p_body text
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare v_client uuid; v_id uuid;
begin
  select client_id into v_client from public.projects where id = p_project_id;
  if v_client is null then raise exception 'project not found'; end if;
  if v_client <> auth.uid() and not public.is_admin() then raise exception 'not authorized'; end if;

  insert into public.messages (project_id, client_id, sender_id, body)
  values (p_project_id, v_client, auth.uid(), p_body)
  returning id into v_id;

  if public.is_admin() then
    perform public.notify_user(v_client, 'New message from Skilloura',
      left(p_body, 120), 'project_update', '/client/dashboard/projects/' || p_project_id);
  else
    perform public.notify_admins('New message from client',
      left(p_body, 120), 'project_update', '/admin/dashboard/projects/' || p_project_id);
  end if;

  return v_id;
end;
$$;
grant execute on function public.send_message(uuid, text) to authenticated;

-- =====================================================================
-- 13. Close a project
-- =====================================================================
create or replace function public.close_project(p_project_id uuid) returns void
language plpgsql
security definer
set search_path = public
as $$
declare v_client uuid;
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;
  update public.projects set status = 'closed', progress = 100, updated_at = now()
  where id = p_project_id
  returning client_id into v_client;

  perform public.notify_user(v_client, 'Project closed',
    'Your project has been marked complete. Thank you!', 'project_closed',
    '/client/dashboard/projects/' || p_project_id);
end;
$$;
grant execute on function public.close_project(uuid) to authenticated;

-- =====================================================================
-- 14. account_created notification (fires from handle_new_user trigger)
-- =====================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text;
begin
  v_role := coalesce(new.raw_user_meta_data->>'role', 'client');

  insert into public.user_profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    v_role::public.user_role
  )
  on conflict (id) do nothing;

  if v_role = 'client' then
    insert into public.client_profiles (user_id, whatsapp)
    values (new.id, new.raw_user_meta_data->>'whatsapp')
    on conflict (user_id) do nothing;

    perform public.notify_user(new.id, 'Welcome to Skilloura',
      'Your account is ready. Track your projects here anytime.', 'account_created',
      '/client/dashboard');
  end if;

  return new;
end;
$$;

-- =====================================================================
-- 15. request_received notification (fires from submit_project_request)
-- =====================================================================
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
    status           = case when p_partial then pr.status else 'submitted'::public.project_request_status end,
    updated_at       = now();

  if not p_partial then
    perform public.notify_admins('New project request',
      coalesce(p_name,'A visitor') || ' requested ' || coalesce(p_service,'a project') || '.',
      'request_received', '/admin/dashboard/leads');
    if v_uid is not null then
      perform public.notify_user(v_uid, 'Request received',
        'We received your project request and will review it shortly.',
        'request_received', '/client/dashboard');
    end if;
  end if;

  return p_ref;
end;
$$;
grant execute on function public.submit_project_request(
  uuid, text, text, text, text, text, text, text, text, boolean
) to anon, authenticated;

-- =====================================================================
-- Done.
-- =====================================================================
