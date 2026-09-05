-- =============================================================================
-- StockPilot schema  â€”  run this in the Supabase SQL Editor (or `supabase db`).
--
-- Design rule: a product's stock quantity is NEVER stored or edited directly.
-- It is ALWAYS derived from the `stock_movements` ledger:
--     current_quantity = SUM(quantity WHERE type='in') - SUM(quantity WHERE type='out')
-- Row Level Security restricts every table so each user sees ONLY their own data.
-- =============================================================================

-- Safe to re-run: drop dependent objects first.
drop view if exists public.products_with_stock;
drop table if exists public.stock_movements;
drop table if exists public.products;
drop table if exists public.profiles;

-- -----------------------------------------------------------------------------
-- Tables
-- -----------------------------------------------------------------------------

create table public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.products (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null references auth.users (id) on delete cascade,
  name          text not null,
  sku           text,
  category      text,
  image_url     text,
  unit_price    numeric(12, 2) not null default 0 check (unit_price >= 0),
  reorder_level integer not null default 0 check (reorder_level >= 0),
  created_at    timestamptz not null default now()
);

create table public.stock_movements (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  type       text not null check (type in ('in', 'out')),
  quantity   integer not null check (quantity > 0),
  note       text,
  created_at timestamptz not null default now()
);

create index products_owner_id_idx        on public.products (owner_id);
create index stock_movements_product_idx  on public.stock_movements (product_id);
create index stock_movements_created_idx  on public.stock_movements (created_at desc);

-- -----------------------------------------------------------------------------
-- Derived-stock view
--   * `current_quantity` = derived live from the ledger (never stored).
--   * `total_movement`   = SUM of all in+out quantities (used by the chart).
--   * security_invoker=true => the querying user's RLS policies apply, so the
--     view can only ever surface that user's own products / movements.
-- -----------------------------------------------------------------------------

create view public.products_with_stock
with (security_invoker = true) as
select
  p.id,
  p.owner_id,
  p.name,
  p.sku,
  p.category,
  p.unit_price,
  p.reorder_level,
  p.created_at,
  coalesce(
    sum(case when m.type = 'in' then m.quantity
             when m.type = 'out' then -m.quantity
             else 0 end),
    0
  )::int as current_quantity,
  coalesce(sum(m.quantity), 0)::int as total_movement,
  p.image_url
from public.products p
left join public.stock_movements m on m.product_id = p.id
group by p.id;

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------

alter table public.profiles        enable row level security;
alter table public.products        enable row level security;
alter table public.stock_movements enable row level security;

-- profiles: a user can only see / create their own profile row.
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- products: full CRUD limited to rows the user owns.
create policy "products_select_own" on public.products
  for select using (auth.uid() = owner_id);
create policy "products_insert_own" on public.products
  for insert with check (auth.uid() = owner_id);
create policy "products_update_own" on public.products
  for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "products_delete_own" on public.products
  for delete using (auth.uid() = owner_id);

-- stock_movements: access is gated through the PARENT product's ownership.
create policy "movements_select_own" on public.stock_movements
  for select using (
    exists (
      select 1 from public.products p
      where p.id = stock_movements.product_id and p.owner_id = auth.uid()
    )
  );
create policy "movements_insert_own" on public.stock_movements
  for insert with check (
    exists (
      select 1 from public.products p
      where p.id = stock_movements.product_id and p.owner_id = auth.uid()
    )
  );
create policy "movements_delete_own" on public.stock_movements
  for delete using (
    exists (
      select 1 from public.products p
      where p.id = stock_movements.product_id and p.owner_id = auth.uid()
    )
  );

-- -----------------------------------------------------------------------------
-- Auto-create a profile row whenever a new auth user signs up.
-- -----------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

