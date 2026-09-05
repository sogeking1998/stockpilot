import { createProduct } from "../actions";
import ProductForm from "@/components/ProductForm";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, BackLink } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("category");
  const categories = Array.from(
    new Set((data ?? []).map((r) => r.category).filter(Boolean) as string[])
  ).sort();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4">
        <BackLink href="/products">Back to products</BackLink>
      </div>
      <PageHeader
        title="New product"
        subtitle="Add an item to your catalog. Stock starts at zero and grows from movements."
      />
      <ProductForm
        action={createProduct}
        submitLabel="Create product"
        cancelHref="/products"
        categories={categories}
      />
    </div>
  );
}
