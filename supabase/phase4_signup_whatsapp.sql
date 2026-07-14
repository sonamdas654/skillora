-- =====================================================================
-- Skilloura — Phase 4 migration: capture WhatsApp number at signup into
-- client_profiles. Safe to re-run (create or replace).
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
  end if;

  return new;
end;
$$;
