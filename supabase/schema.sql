-- =====================================================================
-- Skilloura — Supabase schema (Phase 2)
-- Unified Auth + Client Portal + Admin Business OS
-- Safe to re-run: uses IF NOT EXISTS / DROP POLICY IF EXISTS.
-- Run this in Supabase → SQL Editor.
-- =====================================================================

-- ---------- Helper: is the current user an admin? --------------------
-- SECURITY DEFINER so it bypasses RLS (no recursion when used in policies).
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------- Helper: keep updated_at fresh ----------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =====================================================================
-- 1. user_profiles  (one row per auth user)
-- =====================================================================
create table if not exists public.user_profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  full_name   text default '',
  phone       text,
  avatar_url  text,
  role        text not null default 'client' check (role in ('client','admin')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Auto-create a profile when a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'client')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- =====================================================================
-- 2. client_profiles  (business details for a client)
-- =====================================================================
create table if not exists public.client_profiles (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.user_profiles(id) on delete cascade,
  business_name text,
  city_country  text,
  whatsapp      text,
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (user_id)
);

-- =====================================================================
-- 3. project_requests  (incoming requirement submissions)
-- =====================================================================
create table if not exists public.project_requests (
  id               uuid primary key default gen_random_uuid(),
  client_id        uuid references public.user_profiles(id) on delete set null,
  service_category text,
  service_type     text,
  description      text,
  budget_range     text,
  deadline         text,
  status           text not null default 'new'
                     check (status in ('new','reviewed','quoted','converted','closed')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- =====================================================================
-- 4. projects
-- =====================================================================
create table if not exists public.projects (
  id               uuid primary key default gen_random_uuid(),
  client_id        uuid not null references public.user_profiles(id) on delete cascade,
  request_id       uuid references public.project_requests(id) on delete set null,
  title            text not null,
  description      text,
  service_category text,
  status           text not null default 'requested'
                     check (status in ('requested','quoted','in_progress','preview','revision','delivered','closed','cancelled')),
  progress         int not null default 0 check (progress between 0 and 100),
  start_date       date,
  delivery_date    date,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists idx_projects_client on public.projects(client_id);

-- =====================================================================
-- 5. quotes
-- =====================================================================
create table if not exists public.quotes (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid references public.projects(id) on delete cascade,
  client_id    uuid not null references public.user_profiles(id) on delete cascade,
  quote_number text,
  title        text,
  scope        jsonb default '[]'::jsonb,
  amount       numeric(12,2) not null default 0,
  currency     text not null default 'INR',
  revisions    int default 2,
  payment_terms text,
  status       text not null default 'draft'
                 check (status in ('draft','sent','accepted','rejected','expired')),
  valid_until  date,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists idx_quotes_client on public.quotes(client_id);

-- =====================================================================
-- 6. payments
-- =====================================================================
create table if not exists public.payments (
  id             uuid primary key default gen_random_uuid(),
  project_id     uuid references public.projects(id) on delete cascade,
  client_id      uuid not null references public.user_profiles(id) on delete cascade,
  invoice_number text,
  amount         numeric(12,2) not null default 0,
  currency       text not null default 'INR',
  method         text,
  reference      text,
  status         text not null default 'pending'
                   check (status in ('pending','partial','paid','refunded')),
  due_date       date,
  paid_at        timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists idx_payments_client on public.payments(client_id);

-- =====================================================================
-- 7. revisions
-- =====================================================================
create table if not exists public.revisions (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references public.projects(id) on delete cascade,
  client_id    uuid not null references public.user_profiles(id) on delete cascade,
  round_number int not null default 1,
  items        jsonb default '[]'::jsonb,
  notes        text,
  status       text not null default 'requested'
                 check (status in ('requested','in_progress','completed')),
  created_at   timestamptz not null default now(),
  completed_at timestamptz
);

-- =====================================================================
-- 8. preview_links
-- =====================================================================
create table if not exists public.preview_links (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  client_id  uuid not null references public.user_profiles(id) on delete cascade,
  label      text,
  url        text not null,
  is_active  boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

-- =====================================================================
-- 9. files  (metadata; bytes live in Supabase Storage)
-- =====================================================================
create table if not exists public.files (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid references public.projects(id) on delete cascade,
  client_id    uuid not null references public.user_profiles(id) on delete cascade,
  uploaded_by  uuid references public.user_profiles(id) on delete set null,
  name         text not null,
  storage_path text not null,
  size_bytes   bigint,
  mime_type    text,
  kind         text not null default 'delivery' check (kind in ('delivery','upload')),
  created_at   timestamptz not null default now()
);
create index if not exists idx_files_client on public.files(client_id);

-- =====================================================================
-- 10. messages  (client <-> admin)
-- =====================================================================
create table if not exists public.messages (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  client_id  uuid not null references public.user_profiles(id) on delete cascade,
  sender_id  uuid not null references public.user_profiles(id) on delete cascade,
  body       text not null,
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_messages_client on public.messages(client_id);

-- =====================================================================
-- 11. activity_logs  (audit trail — admin only)
-- =====================================================================
create table if not exists public.activity_logs (
  id          uuid primary key default gen_random_uuid(),
  actor_id    uuid references public.user_profiles(id) on delete set null,
  entity_type text,
  entity_id   uuid,
  action      text,
  meta        jsonb default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

-- =====================================================================
-- 12. notifications
-- =====================================================================
create table if not exists public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.user_profiles(id) on delete cascade,
  title      text not null,
  body       text,
  type       text default 'info',
  link       text,
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_notifications_user on public.notifications(user_id);

-- =====================================================================
-- updated_at triggers
-- =====================================================================
do $$
declare t text;
begin
  foreach t in array array[
    'user_profiles','client_profiles','project_requests','projects',
    'quotes','payments'
  ]
  loop
    execute format('drop trigger if exists set_updated_at on public.%I;', t);
    execute format('create trigger set_updated_at before update on public.%I
                    for each row execute function public.set_updated_at();', t);
  end loop;
end $$;

-- =====================================================================
-- ROW LEVEL SECURITY
-- Clients see/edit only their own rows; admins see/edit everything.
-- =====================================================================
alter table public.user_profiles   enable row level security;
alter table public.client_profiles enable row level security;
alter table public.project_requests enable row level security;
alter table public.projects        enable row level security;
alter table public.quotes          enable row level security;
alter table public.payments        enable row level security;
alter table public.revisions       enable row level security;
alter table public.preview_links   enable row level security;
alter table public.files           enable row level security;
alter table public.messages        enable row level security;
alter table public.activity_logs   enable row level security;
alter table public.notifications   enable row level security;

-- ----- user_profiles -----
drop policy if exists up_select on public.user_profiles;
create policy up_select on public.user_profiles for select
  using (auth.uid() = id or public.is_admin());
drop policy if exists up_update on public.user_profiles;
create policy up_update on public.user_profiles for update
  using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

-- ----- client_profiles -----
drop policy if exists cp_all on public.client_profiles;
create policy cp_all on public.client_profiles for all
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

-- Generic owner-based policies for client-owned tables.
-- (client_id = auth.uid() OR admin)
do $$
declare t text;
begin
  foreach t in array array[
    'project_requests','projects','quotes','payments','revisions',
    'preview_links','files','messages'
  ]
  loop
    execute format('drop policy if exists %I_select on public.%I;', t, t);
    execute format('create policy %I_select on public.%I for select
                    using (client_id = auth.uid() or public.is_admin());', t, t);

    execute format('drop policy if exists %I_insert on public.%I;', t, t);
    execute format('create policy %I_insert on public.%I for insert
                    with check (client_id = auth.uid() or public.is_admin());', t, t);

    execute format('drop policy if exists %I_update on public.%I;', t, t);
    execute format('create policy %I_update on public.%I for update
                    using (client_id = auth.uid() or public.is_admin())
                    with check (client_id = auth.uid() or public.is_admin());', t, t);

    execute format('drop policy if exists %I_delete on public.%I;', t, t);
    execute format('create policy %I_delete on public.%I for delete
                    using (public.is_admin());', t, t);
  end loop;
end $$;

-- ----- notifications (user-owned) -----
drop policy if exists notif_select on public.notifications;
create policy notif_select on public.notifications for select
  using (user_id = auth.uid() or public.is_admin());
drop policy if exists notif_update on public.notifications;
create policy notif_update on public.notifications for update
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());
drop policy if exists notif_insert on public.notifications;
create policy notif_insert on public.notifications for insert
  with check (public.is_admin() or user_id = auth.uid());

-- ----- activity_logs (admin only can read; anyone authed can insert own) -----
drop policy if exists log_select on public.activity_logs;
create policy log_select on public.activity_logs for select
  using (public.is_admin());
drop policy if exists log_insert on public.activity_logs;
create policy log_insert on public.activity_logs for insert
  with check (actor_id = auth.uid() or public.is_admin());

-- =====================================================================
-- Done. Every table now has RLS: clients are limited to their own rows,
-- admins have full access. Bytes for `files` go in Supabase Storage.
-- =====================================================================
