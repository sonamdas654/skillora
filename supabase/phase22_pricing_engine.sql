-- =====================================================================
-- Skilloura — Dynamic, database-driven pricing engine.
--
-- Replaces the static per-service form/pricing (lib/services.ts) as the
-- SOURCE OF TRUTH for the requirement-form calculator. Admin can create,
-- edit, activate/deactivate services/questions/options/rules/external
-- costs without touching code.
--
-- Split into two halves with very different trust levels:
--   1. pricing_services / pricing_fields / pricing_field_options /
--      pricing_rules / pricing_external_costs — CLIENT-FACING config.
--      Public can read active rows (needed to render the live form +
--      calculator); only admin can write.
--   2. pricing_cost_items — INTERNAL cost/profit data (developer hours,
--      hosting, GST, gateway fees...). Admin-only, full stop — no public
--      select policy at all, so it never leaks to a client-side query.
--      Seeded with zero rows: real labour rates/costs are the owner's
--      business numbers, not something to invent defaults for, except
--      well-known public facts (GST, typical gateway fee) added as a
--      starting point the owner can edit.
-- =====================================================================

create table if not exists public.pricing_services (
  id                  uuid primary key default gen_random_uuid(),
  slug                text unique not null,
  name                text not null,
  description         text,
  base_market_price   numeric not null default 0,
  base_skilloura_price numeric not null default 0,
  timeline            text,
  display_order       int not null default 0,
  active              boolean not null default true,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create table if not exists public.pricing_fields (
  id                uuid primary key default gen_random_uuid(),
  service_id        uuid not null references public.pricing_services(id) on delete cascade,
  field_key         text not null,
  label             text not null,
  field_type        text not null check (field_type in ('text','textarea','select','multiselect','radio','checkbox','date','number')),
  required          boolean not null default false,
  placeholder       text,
  display_order     int not null default 0,
  -- e.g. {"field":"website_type","in":["Ecommerce website"]} — evaluated
  -- client-side against the current answers to decide visibility.
  conditional_rule  jsonb,
  active            boolean not null default true,
  unique (service_id, field_key)
);
create index if not exists idx_pricing_fields_service on public.pricing_fields (service_id);

create table if not exists public.pricing_field_options (
  id                uuid primary key default gen_random_uuid(),
  field_id          uuid not null references public.pricing_fields(id) on delete cascade,
  option_label      text not null,
  option_value      text not null,
  market_price      numeric not null default 0,
  skilloura_price   numeric not null default 0,
  pricing_type      text not null default 'fixed'
                    check (pricing_type in ('fixed','per_item','per_range','percentage','multiplier','recurring','one_time')),
  quantity_unit     text,
  minimum_quantity  numeric,
  maximum_quantity  numeric,
  display_order     int not null default 0,
  active            boolean not null default true
);
create index if not exists idx_pricing_options_field on public.pricing_field_options (field_id);

create table if not exists public.pricing_rules (
  id                    uuid primary key default gen_random_uuid(),
  service_id            uuid not null references public.pricing_services(id) on delete cascade,
  label                 text not null,
  rule_type             text not null, -- e.g. 'complexity_multiplier' | 'urgency_charge' | 'custom_quote'
  condition             jsonb not null default '{}'::jsonb,
  market_adjustment     numeric not null default 0,
  skilloura_adjustment  numeric not null default 0,
  multiplier            numeric not null default 1,
  custom_quote_trigger  boolean not null default false,
  active                boolean not null default true
);
create index if not exists idx_pricing_rules_service on public.pricing_rules (service_id);

create table if not exists public.pricing_external_costs (
  id                uuid primary key default gen_random_uuid(),
  service_id        uuid not null references public.pricing_services(id) on delete cascade,
  item_name         text not null,
  cost_type         text not null, -- domain | hosting | plugin | api | ad_spend | app_store_fee | stock_assets | subscription | other
  estimated_cost    numeric not null default 0,
  recurring         boolean not null default false,
  discount_allowed  boolean not null default false,
  active            boolean not null default true
);
create index if not exists idx_pricing_extcost_service on public.pricing_external_costs (service_id);

-- Internal-only cost/profit engine. Never selectable by anon/authenticated
-- non-admins (no public policy at all, below).
create table if not exists public.pricing_cost_items (
  id                uuid primary key default gen_random_uuid(),
  service_id        uuid not null references public.pricing_services(id) on delete cascade,
  cost_item         text not null, -- "Developer hours", "Designer hours", "Hosting", "GST", ...
  cost_type         text not null check (cost_type in ('labor','overhead','tax','fee','one_time','recurring')),
  unit_cost         numeric not null default 0,
  estimated_units   numeric not null default 1,
  notes             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists idx_pricing_cost_service on public.pricing_cost_items (service_id);

-- ---------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------
alter table public.pricing_services enable row level security;
alter table public.pricing_fields enable row level security;
alter table public.pricing_field_options enable row level security;
alter table public.pricing_rules enable row level security;
alter table public.pricing_external_costs enable row level security;
alter table public.pricing_cost_items enable row level security;

do $$
declare t text;
begin
  foreach t in array array['pricing_services','pricing_fields','pricing_field_options','pricing_rules','pricing_external_costs']
  loop
    execute format('drop policy if exists %I_select on public.%I;', t, t);
    execute format('create policy %I_select on public.%I for select using (active = true or public.is_admin());', t, t);

    execute format('drop policy if exists %I_insert on public.%I;', t, t);
    execute format('create policy %I_insert on public.%I for insert with check (public.is_admin());', t, t);

    execute format('drop policy if exists %I_update on public.%I;', t, t);
    execute format('create policy %I_update on public.%I for update using (public.is_admin()) with check (public.is_admin());', t, t);

    execute format('drop policy if exists %I_delete on public.%I;', t, t);
    execute format('create policy %I_delete on public.%I for delete using (public.is_admin());', t, t);
  end loop;
end $$;

-- pricing_cost_items: admin-only for every operation, no public select at all.
drop policy if exists pricing_cost_items_all on public.pricing_cost_items;
create policy pricing_cost_items_all on public.pricing_cost_items for all
  using (public.is_admin())
  with check (public.is_admin());

-- =====================================================================
-- Done. Seeding + admin_edit_* RPCs live in phase23_pricing_seed.sql /
-- application code.
-- =====================================================================
