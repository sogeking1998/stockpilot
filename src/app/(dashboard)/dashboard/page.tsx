import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import TopProductsChart from "@/components/TopProductsChart";
import AppIcon from "@/components/AppIcon";
import { formatCurrency, formatNumber } from "@/lib/format";
import { isLowStock, type ProductWithStock } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products_with_stock").select("*").order("name", { ascending: true });
  if (error) return <div className="workspace-empty"><AppIcon name="bell" /><h1>We couldn’t load your inventory</h1><p>Please refresh the page to try again.</p></div>;
  const products = (data ?? []) as ProductWithStock[];
  const totalUnits = products.reduce((sum, p) => sum + p.current_quantity, 0);
  const totalValue = products.reduce((sum, p) => sum + p.current_quantity * p.unit_price, 0);
  const lowStock = products.filter(isLowStock).sort((a, b) => a.current_quantity - b.current_quantity);
  const topMovers = [...products].filter(p => p.total_movement > 0).sort((a, b) => b.total_movement - a.total_movement).slice(0, 5);
  const cards = [
    { label: "Total products", value: formatNumber(products.length), hint: `${formatNumber(totalUnits)} units across your inventory`, icon: "box" as const },
    { label: "Total stock value", value: formatCurrency(totalValue), hint: "Based on current quantity × unit price", icon: "wallet" as const },
    { label: "Low-stock items", value: formatNumber(lowStock.length), hint: lowStock.length ? "At or below their reorder level" : "Everything is above its reorder level", icon: "bell" as const, alert: lowStock.length > 0 },
  ];
  return <div className="dashboard-view">
    <div className="dashboard-heading"><div><p className="section-eyebrow">YOUR BUSINESS, IN FOCUS</p><h1>Your store, at a glance.</h1><p>A little clarity for your next move. Here’s where your inventory stands.</p></div><Link href="/products/new" className="landing-primary"><AppIcon name="plus" />New product</Link></div>
    {products.length === 0 ? <div className="workspace-empty"><AppIcon name="box" /><h2>A fresh start for your shelves.</h2><p>Add your first product, then record stock movements to bring your dashboard to life.</p><Link href="/products/new" className="landing-primary"><AppIcon name="plus" />Add your first product</Link></div> : <>
      <div className="dashboard-metrics">{cards.map(card => <article className={`dashboard-metric ${card.alert ? "attention" : ""}`} key={card.label}><div className="metric-heading"><h2>{card.label}</h2><span className="dashboard-metric-icon"><AppIcon name={card.icon} /></span></div><strong>{card.value}</strong><p>{card.alert && <span className="attention-dot" />}{card.hint}</p></article>)}</div>
      <div className="dashboard-panels">
        <section className="dashboard-panel movement-panel"><div className="dashboard-panel-heading"><div><span className="section-eyebrow">INVENTORY ACTIVITY</span><h2>Your most active products</h2><p>Top 5 products by total stock in and stock out.</p></div><span className="dashboard-chip">All time</span></div>{topMovers.length ? <TopProductsChart labels={topMovers.map(p => p.name)} values={topMovers.map(p => p.total_movement)} /> : <div className="dashboard-chart-empty">Record a stock movement to see your most active products.</div>}<div className="chart-caption"><span><i />Total units moved</span><span>Stock in + stock out</span></div></section>
        <section className="dashboard-panel restock-panel"><div className="dashboard-panel-heading"><div><span className="section-eyebrow">KEEP YOUR SHELVES READY</span><h2>Time for a restock <span className="restock-count">{lowStock.length}</span></h2><p>A heads-up on products running low.</p></div></div>{lowStock.length === 0 ? <div className="dashboard-healthy"><AppIcon name="check" /><h3>You’re in good stock.</h3><p>All products are above their reorder level.</p></div> : <ul className="restock-list">{lowStock.slice(0, 8).map(p => <li key={p.id}><Link href={`/products/${p.id}`}><span className="restock-product-icon"><AppIcon name="box" /></span><div><h3>{p.name}</h3><p><strong>{formatNumber(p.current_quantity)}</strong> in stock<span>·</span>Reorder at {formatNumber(p.reorder_level)}</p></div><span className="restock-badge">Low stock</span><span className="restock-arrow" aria-hidden="true">↗</span></Link></li>)}</ul>}<Link href="/products" className="dashboard-panel-link">View all products <span aria-hidden="true">→</span></Link></section>
      </div>
      <div className="dashboard-note"><span className="dashboard-note-icon"><AppIcon name="check" /></span><div><strong>Every movement tells the story.</strong><p>Your stock quantities are calculated from recorded stock in and stock out.</p></div><Link href="/products">Manage inventory <span aria-hidden="true">→</span></Link></div>
    </>}
    <footer className="workspace-footer"><span>StockPilot <span> / </span> A little order. A lot of possibility.</span><span>Made for your everyday.</span></footer>
  </div>;
}
