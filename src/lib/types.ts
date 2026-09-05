// Shared domain types. These mirror the Supabase schema in supabase/schema.sql.

export type MovementType = "in" | "out";

export interface Product {
  id: string;
  owner_id: string;
  name: string;
  image_url?: string | null;
  sku: string | null;
  category: string | null;
  unit_price: number;
  reorder_level: number;
  created_at: string;
}

// Row shape returned by the `products_with_stock` view.
export interface ProductWithStock extends Product {
  current_quantity: number;
  total_movement: number;
}

export interface StockMovement {
  id: string;
  product_id: string;
  type: MovementType;
  quantity: number;
  note: string | null;
  created_at: string;
}

export function isLowStock(p: Pick<ProductWithStock, "current_quantity" | "reorder_level">) {
  return p.current_quantity <= p.reorder_level;
}

