import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ProductsTable from "@/components/ProductsTable";
import AppIcon from "@/components/AppIcon";
import { type ProductWithStock, isLowStock } from "@/lib/types";
export const dynamic = "force-dynamic";
export default async function ProductsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products_with_stock").select("*").order("name", { ascending: true });
  if (error) return <div className="workspace-empty"><h1>We couldn’t load your products</h1><p>Refresh the page to try again.</p></div>;
  const products = (data ?? []) as ProductWithStock[];
  return <div><div className="dashboard-heading"><div><p className="section-eyebrow">A PLACE FOR EVERY PRODUCT</p><h1>Meet your inventory.</h1><p>Your products, beautifully organized. Keep every shelf in focus.</p></div><Link href="/products/new" className="landing-primary"><AppIcon name="plus" />New product</Link></div><div className="catalog-overview"><span><AppIcon name="box" /><strong>{products.length}</strong> products in your catalog</span><span><AppIcon name="bell" /><strong>{products.filter(isLowStock).length}</strong> need a restock</span><span>Every count backed by your stock history</span></div>{products.length ? <ProductsTable products={products} /> : <div className="workspace-empty"><AppIcon name="box" /><h2>Make room for your first product.</h2><p>Add a photo and a few details to start building your catalog.</p><Link href="/products/new" className="landing-primary">Add your first product</Link></div>}</div>;
}
