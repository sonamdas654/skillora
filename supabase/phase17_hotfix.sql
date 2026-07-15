-- =====================================================================
-- Skilloura — hotfix found via E2E audit testing.
--
-- respond_to_quote() and verify_payment() were failing on every real
-- call with: "column status is of type quote_status/payment_status but
-- expression is of type text". Root cause: `case when x then 'a' else
-- 'b' end` resolves to plain `text` (not the unknown-literal type a
-- single string gets), and Postgres has no implicit assignment cast
-- from text to a custom enum in a SQL UPDATE. Fix: cast the CASE
-- result explicitly. Safe to re-run.
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
    set status = (case when p_approve then 'approved' else 'change_requested' end)::public.quote_status,
        updated_at = now()
  where id = p_quote_id;

  if p_approve then
    update public.projects set status = 'advance_pending'::public.project_status, updated_at = now() where id = v_project;
  end if;

  perform public.notify_admins('Quote ' || (case when p_approve then 'approved' else 'change requested' end),
    coalesce(v_title,'A quote') || ' was ' || (case when p_approve then 'approved' else 'flagged for changes' end) || ' by the client.',
    'quote_approved', '/admin/dashboard/projects/' || v_project);

  insert into public.activity_logs (actor_id, entity_type, entity_id, action)
  values (auth.uid(), 'quote', p_quote_id, case when p_approve then 'quote_approved' else 'quote_change_requested' end);
end;
$$;
grant execute on function public.respond_to_quote(uuid, boolean) to authenticated;

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
    status = (case when p_verify then 'verified' else 'rejected' end)::public.payment_status,
    paid_at = case when p_verify then now() else null end,
    updated_at = now()
  where id = p_payment_id;

  if p_verify then
    update public.projects
      set status = (case when v_kind = 'final' then 'delivered' else 'in_progress' end)::public.project_status,
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
-- Done.
-- =====================================================================
