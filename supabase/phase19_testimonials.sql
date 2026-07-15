-- =====================================================================
-- Skilloura — Testimonials move into the unified Supabase system.
--
-- The review-invite link itself is a stateless signed JWT (lib/reviewToken.ts,
-- unaffected by this migration — it never touches the database). The link's
-- unique `jti` is only written to a row once a client actually submits a
-- review, so there is nothing to migrate for outstanding/unused invite
-- links; only already-submitted testimonials move (1 pending row today).
--
-- This table is the one place in the whole system where an ANONYMOUS visitor
-- must be able to INSERT (a client filling the review form isn't logged in).
-- That is safe here only because the RLS check pins status to 'pending' no
-- matter what the client sends — an anon submitter can never get their own
-- review directly onto the public site, and the invite_token unique
-- constraint stops the same link being used twice.
-- =====================================================================

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_business text,
  rating int not null check (rating between 1 and 5),
  review text not null,
  status text not null default 'pending' check (status in ('pending', 'active', 'hidden')),
  invite_token text unique,
  created_at timestamptz not null default now()
);

alter table public.testimonials enable row level security;

drop policy if exists testimonials_select on public.testimonials;
create policy testimonials_select on public.testimonials for select
  using (status = 'active' or public.is_admin());

-- Anonymous review-link submission: anyone can insert, but ONLY as 'pending'.
drop policy if exists testimonials_insert_public on public.testimonials;
create policy testimonials_insert_public on public.testimonials for insert
  to anon, authenticated
  with check (status = 'pending');

-- Admin adding a real review directly (no invite link) — any status.
drop policy if exists testimonials_insert_admin on public.testimonials;
create policy testimonials_insert_admin on public.testimonials for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists testimonials_update on public.testimonials;
create policy testimonials_update on public.testimonials for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists testimonials_delete on public.testimonials;
create policy testimonials_delete on public.testimonials for delete
  using (public.is_admin());

-- Anon visitors need to know "has this exact invite link already been used"
-- without being able to read any testimonial content (most are pending —
-- someone else's unapproved review). A SECURITY DEFINER function returns
-- only a boolean, bypassing RLS instead of widening the select policy
-- (which would otherwise leak every pending reviewer's text to anon).
create or replace function public.review_token_used(p_invite_token text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists(select 1 from public.testimonials where invite_token = p_invite_token);
$$;
grant execute on function public.review_token_used(text) to anon, authenticated;

-- =====================================================================
-- Done.
-- =====================================================================
