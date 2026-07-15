-- =====================================================================
-- Skilloura — Blog moves into the unified Supabase system.
--
-- Previously the public /blog pages read from a static code file
-- (lib/blog.ts) and a separate, never-wired-up Prisma BlogPost table (0
-- rows) sat behind the old admin, editable but invisible on the live site.
-- This migration makes Supabase the single source of truth: all 20
-- existing posts are copied in (status='published') and the public pages
-- + a new admin editor both read/write here from now on.
--
-- Structured SEO/GEO fields (key_takeaways, cost_table, faqs, sources,
-- related_slugs) are stored as jsonb — same shape as the old BlogPost
-- TypeScript interface, just persisted instead of hardcoded.
-- =====================================================================

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  meta_description text not null,
  date date not null default current_date,
  read_minutes int not null default 5,
  category text not null,
  content text not null,
  key_takeaways jsonb not null default '[]',
  cost_table jsonb not null default '[]',
  faqs jsonb not null default '[]',
  service_cta_slug text,
  service_cta_label text,
  demo_slug text,
  demo_label text,
  related_slugs jsonb not null default '[]',
  sources jsonb not null default '[]',
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.blog_posts enable row level security;

drop policy if exists blog_select on public.blog_posts;
create policy blog_select on public.blog_posts for select
  using (status = 'published' or public.is_admin());

drop policy if exists blog_insert on public.blog_posts;
create policy blog_insert on public.blog_posts for insert
  with check (public.is_admin());

drop policy if exists blog_update on public.blog_posts;
create policy blog_update on public.blog_posts for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists blog_delete on public.blog_posts;
create policy blog_delete on public.blog_posts for delete
  using (public.is_admin());

-- =====================================================================
-- Done.
-- =====================================================================
