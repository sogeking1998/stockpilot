"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import { validProductImage } from "@/lib/product-image";

export type FormState = { error?: string };

function parseProduct(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const sku = String(formData.get("sku") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const unit_price = Number(String(formData.get("unit_price") ?? "").trim() || 0);
  const reorder_level = parseInt(
    String(formData.get("reorder_level") ?? "").trim() || "0",
    10
  );
  const image_url = String(formData.get("image_url") ?? "").trim();
  return { name, sku, category, unit_price, reorder_level, image_url };
}

function validateProduct(p: ReturnType<typeof parseProduct>): string | null {
  if (!validProductImage(p.image_url)) return "Use an HTTPS image URL or a JPG, PNG, or WebP upload under 500 KB.";
  if (!p.name) return "Product name is required.";
  if (!Number.isFinite(p.unit_price) || p.unit_price < 0)
    return "Unit price must be zero or more.";
  if (!Number.isInteger(p.reorder_level) || p.reorder_level < 0)
    return "Reorder level must be a whole number, zero or more.";
  return null;
}

export async function createProduct(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const p = parseProduct(formData);
  const invalid = validateProduct(p);
  if (invalid) return { error: invalid };

  const { error } = await supabase.from("products").insert({
    owner_id: user.id,
    ...(p.image_url || formData.get("image_changed") === "true" ? { image_url: p.image_url || null } : {}),
    name: p.name,
    sku: p.sku || null,
    category: p.category || null,
    unit_price: p.unit_price,
    reorder_level: p.reorder_level,
  });
  if (error) return { error: error.message.includes("image_url") ? "Image storage needs a database update. Run supabase/migrations/20260905_product_images.sql in the Supabase SQL Editor, then save again." : error.message };

  revalidatePath("/products");
  revalidatePath("/dashboard");
  redirect("/products");
}

export async function updateProduct(
  id: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const p = parseProduct(formData);
  const invalid = validateProduct(p);
  if (invalid) return { error: invalid };

  const { error } = await supabase
    .from("products")
    .update({
      ...(p.image_url || formData.get("image_changed") === "true" ? { image_url: p.image_url || null } : {}),
    name: p.name,
      sku: p.sku || null,
      category: p.category || null,
      unit_price: p.unit_price,
      reorder_level: p.reorder_level,
    })
    .eq("id", id);
  if (error) return { error: error.message.includes("image_url") ? "Image storage needs a database update. Run supabase/migrations/20260905_product_images.sql in the Supabase SQL Editor, then save again." : error.message };

  revalidatePath("/products");
  revalidatePath(`/products/${id}`);
  revalidatePath("/dashboard");
  redirect(`/products/${id}`);
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/products");
  revalidatePath("/dashboard");
  redirect("/products");
}

export async function recordMovement(
  productId: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const type = String(formData.get("type") ?? "");
  const quantity = parseInt(String(formData.get("quantity") ?? ""), 10);
  const note = String(formData.get("note") ?? "").trim();

  if (type !== "in" && type !== "out")
    return { error: "Choose stock in or stock out." };
  if (!Number.isInteger(quantity) || quantity <= 0)
    return { error: "Quantity must be a whole number greater than zero." };

  // Guard: don't let a stock-out drive the derived quantity negative.
  if (type === "out") {
    const { data: row } = await supabase
      .from("products_with_stock")
      .select("current_quantity")
      .eq("id", productId)
      .single();
    if (row && quantity > row.current_quantity) {
      return {
        error: `Only ${row.current_quantity} in stock â€” can't remove ${quantity}.`,
      };
    }
  }

  const { error } = await supabase.from("stock_movements").insert({
    product_id: productId,
    type,
    quantity,
    note: note || null,
  });
  if (error) return { error: error.message.includes("image_url") ? "Image storage needs a database update. Run supabase/migrations/20260905_product_images.sql in the Supabase SQL Editor, then save again." : error.message };

  revalidatePath(`/products/${productId}`);
  revalidatePath("/products");
  revalidatePath("/dashboard");
  return {};
}

