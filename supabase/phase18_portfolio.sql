-- =====================================================================
-- Skilloura — Portfolio (real client work, added by admin as projects
-- complete) moves into the unified Supabase system.
--
-- Scope note: the curated "concept demo" cards on /portfolio (restaurant,
-- gym, salon, etc. — each with its own interactive /portfolio/[slug] demo
-- page) stay as code in lib/portfolio.ts. They aren't admin-editable
-- content, they're designed marketing demos wired to specific interactive
-- components — moving them to a CRUD table would risk breaking the demo
-- pages for no benefit. Only the admin-managed "real project" list (the
-- old Portfolio Prisma table — 0 rows today, nothing to migrate) moves.
--
-- Admin-only content: no client/owner concept at all, so writes are
-- gated purely by is_admin() — no owner-based policy, no RPC needed.
-- =====================================================================

create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  project_title text not null,
  industry text not null,
  category text not null,
  problem text not null,
  solution text not null,
  features text[] not null default '{}',
  demo_link text,
  technology_used text,
  is_demo boolean not null default true,
  status text not null default 'active' check (status in ('active', 'hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.portfolio_items enable row level security;

drop policy if exists portfolio_select on public.portfolio_items;
create policy portfolio_select on public.portfolio_items for select
  using (status = 'active' or public.is_admin());

drop policy if exists portfolio_insert on public.portfolio_items;
create policy portfolio_insert on public.portfolio_items for insert
  with check (public.is_admin());

drop policy if exists portfolio_update on public.portfolio_items;
create policy portfolio_update on public.portfolio_items for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists portfolio_delete on public.portfolio_items;
create policy portfolio_delete on public.portfolio_items for delete
  using (public.is_admin());

-- =====================================================================
-- Done.
-- =====================================================================
