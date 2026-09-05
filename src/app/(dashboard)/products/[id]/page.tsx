import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import { demoProductPhoto } from "@/lib/demo-product-photos";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BackLink, LowStockBadge, MovementBadge, CategoryPill } from "@/components/ui";
import MovementForm from "@/components/MovementForm";
import DeleteProductButton from "@/components/DeleteProductButton";
import { formatCurrency, formatNumber, formatDateTime } from "@/lib/format";
import { isLowStock } from "@/lib/types";
import type { ProductWithStock, StockMovement } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: productData } = await supabase
    .from("products_with_stock")
    .select("*")
    .eq("id", id)
    .single();

  if (!productData) notFound();
  const product = productData as ProductWithStock;

  const { data: movementData } = await supabase
    .from("stock_movements")
    .select("*")
    .eq("product_id", id)
    .order("created_at", { ascending: false });

  const movements = (movementData ?? []) as StockMovement[];
  const totalIn = movements
    .filter((m) => m.type === "in")
    .reduce((s, m) => s + m.quantity, 0);
  const totalOut = movements
    .filter((m) => m.type === "out")
    .reduce((s, m) => s + m.quantity, 0);
  const stockValue = product.current_quantity * product.unit_price;
  const low = isLowStock(product);

  const stats = [
    { label: "In stock", value: formatNumber(product.current_quantity) },
    { label: "Stock value", value: formatCurrency(stockValue) },
    { label: "Total in", value: `+${formatNumber(totalIn)}` },
    { label: "Total out", value: `âˆ’${formatNumber(totalOut)}` },
  ];

  return (
    <div>
      <div className="mb-4">
        <BackLink href="/products">Back to products</BackLink>
      </div>

      {(product.image_url || demoProductPhoto(product.name)) && <div className="product-detail-photo"><ProductImage src={product.image_url} name={product.name} /></div>}
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {product.name}
            </h1>
            <LowStockBadge low={low} />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span>
              SKU:{" "}
              {product.sku || <span className="text-slate-300">â€”</span>}
            </span>
            <span className="text-slate-300">Â·</span>
            <CategoryPill category={product.category} />
            <span className="text-slate-300">Â·</span>
            <span>{formatCurrency(product.unit_price)} / unit</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/products/${id}/edit`} className="btn-secondary">
            Edit
          </Link>
          <DeleteProductButton productId={id} productName={product.name} />
        </div>
      </div>

      {low && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <span aria-hidden>âš ï¸</span>
          Stock is at or below the reorder level of{" "}
          {formatNumber(product.reorder_level)}. Time to restock.
        </div>
      )}

      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              {s.label}
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Movement history */}
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            <div className="border-b border-slate-100 px-4 py-3">
              <h2 className="text-sm font-semibold text-slate-900">
                Movement history
              </h2>
              <p className="text-xs text-slate-400">
                Newest first Â· the audit trail behind the current quantity.
              </p>
            </div>
            {movements.length === 0 ? (
              <div className="px-4 py-12 text-center text-sm text-slate-500">
                No movements yet. Record a stock-in to get started.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3 text-right">Quantity</th>
                      <th className="px-4 py-3">Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {movements.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50">
                        <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                          {formatDateTime(m.created_at)}
                        </td>
                        <td className="px-4 py-3">
                          <MovementBadge type={m.type} />
                        </td>
                        <td
                          className={`px-4 py-3 text-right font-semibold ${
                            m.type === "in" ? "text-emerald-600" : "text-rose-600"
                          }`}
                        >
                          {m.type === "in" ? "+" : "âˆ’"}
                          {formatNumber(m.quantity)}
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          {m.note || <span className="text-slate-300">â€”</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Record movement */}
        <div>
          <div className="card sticky top-20 p-5">
            <h2 className="text-sm font-semibold text-slate-900">
              Record movement
            </h2>
            <p className="mb-4 text-xs text-slate-400">
              Add stock in or out. The quantity recomputes from the ledger.
            </p>
            <MovementForm productId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}

