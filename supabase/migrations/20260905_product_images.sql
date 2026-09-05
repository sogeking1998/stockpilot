-- Add product images without deleting products or stock history.
begin;
alter table public.products add column if not exists image_url text;
create or replace view public.products_with_stock
with (security_invoker = true) as
select p.id, p.owner_id, p.name, p.sku, p.category, p.unit_price,
  p.reorder_level, p.created_at,
  coalesce(sum(case when m.type = 'in' then m.quantity when m.type = 'out' then -m.quantity else 0 end), 0)::int as current_quantity,
  coalesce(sum(m.quantity), 0)::int as total_movement,
  p.image_url
from public.products p
left join public.stock_movements m on m.product_id = p.id
group by p.id;
commit;
