"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { type ProductWithStock, isLowStock } from "@/lib/types";
import { formatCurrency, formatNumber } from "@/lib/format";
import ProductImage from "@/components/ProductImage";
import AppIcon from "@/components/AppIcon";

export default function ProductsTable({ products }: { products: ProductWithStock[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [stock, setStock] = useState("all");
  const categories = useMemo(() => Array.from(new Set(products.map(p => p.category).filter((c): c is string => Boolean(c)))).sort(), [products]);
  const filtered = useMemo(() => products.filter(p => (category === "all" || p.category === category) && (stock === "all" || (stock === "low" ? isLowStock(p) : !isLowStock(p))) && `${p.name} ${p.sku ?? ""}`.toLowerCase().includes(query.trim().toLowerCase())), [products, query, category, stock]);
  return <div className="catalog">
    <div className="catalog-toolbar"><div className="catalog-search"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/></svg><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Find a product by name or SKU…" aria-label="Search products" /></div><select value={category} onChange={e => setCategory(e.target.value)} aria-label="Filter by category"><option value="all">All categories</option>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select><select value={stock} onChange={e => setStock(e.target.value)} aria-label="Filter by stock status"><option value="all">All stock levels</option><option value="low">Low stock</option><option value="healthy">Healthy stock</option></select></div>
    <div className="catalog-results"><p role="status"><strong>{filtered.length}</strong> {filtered.length === 1 ? "product" : "products"}{filtered.length !== products.length && ` of ${products.length}`}</p><span><AppIcon name="grid" />Your catalog, at a glance</span></div>
    {filtered.length ? <div className="catalog-grid">{filtered.map(p => <article className="catalog-card" key={p.id}><div className="catalog-card-visual"><Link href={`/products/${p.id}`} aria-label={`View ${p.name}`}><ProductImage src={p.image_url} name={p.name} /></Link><span className={`catalog-status ${isLowStock(p) ? "low" : ""}`}><i />{isLowStock(p) ? "Low stock" : "Healthy stock"}</span></div><div className="catalog-card-body"><div className="catalog-category">{p.category || "Uncategorized"}</div><Link href={`/products/${p.id}`} className="catalog-product-name"><h2>{p.name}</h2></Link><p className="catalog-sku">{p.sku ? `SKU · ${p.sku}` : "No SKU assigned"}</p><div className="catalog-numbers"><div><span>Unit price</span><strong>{formatCurrency(p.unit_price)}</strong></div><div><span>In stock</span><strong className={isLowStock(p) ? "catalog-low-count" : ""}>{formatNumber(p.current_quantity)}<small> units</small></strong></div></div><p className="catalog-reorder">Reorder at {formatNumber(p.reorder_level)} units</p><div className="catalog-card-actions"><Link href={`/products/${p.id}`}>View product <span aria-hidden="true">↗</span></Link><Link href={`/products/${p.id}/edit`} aria-label={`Edit ${p.name}`}>Edit</Link></div></div></article>)}</div> : <div className="workspace-empty"><AppIcon name="box" /><h2>No products found</h2><p>Try another search or clear your filters.</p><button type="button" className="landing-primary" onClick={() => { setQuery(""); setCategory("all"); setStock("all"); }}>Clear filters</button></div>}
  </div>;
}
