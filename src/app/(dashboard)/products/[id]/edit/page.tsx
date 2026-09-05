import { notFound } from "next/navigation";
import { updateProduct } from "../../actions";
import ProductForm from "@/components/ProductForm";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, BackLink } from "@/components/ui";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) notFound();

  const { data: cats } = await supabase.from("products").select("category");
  const categories = Array.from(
    new Set((cats ?? []).map((r) => r.category).filter(Boolean) as string[])
  ).sort();

  const action = updateProduct.bind(null, id);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4">
        <BackLink href={`/products/${id}`}>Back to product</BackLink>
      </div>
      <PageHeader
        title="Edit product"
        subtitle="Update product details. Stock quantity is managed through movements."
      />
      <ProductForm
        action={action}
        product={product as Product}
        submitLabel="Save changes"
        cancelHref={`/products/${id}`}
        categories={categories}
      />
    </div>
  );
}
