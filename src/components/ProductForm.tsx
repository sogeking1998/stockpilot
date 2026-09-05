"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import type { FormState } from "@/app/(dashboard)/products/actions";
import type { Product } from "@/lib/types";

import ProductImage from "@/components/ProductImage";
import { validProductImage } from "@/lib/product-image";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary">
      {pending ? "Savingâ€¦" : label}
    </button>
  );
}

export default function ProductForm({
  action,
  product,
  submitLabel,
  cancelHref,
  categories = [],
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  product?: Product;
  submitLabel: string;
  cancelHref: string;
  categories?: string[];
}) {
  const [state, formAction] = useActionState<FormState, FormData>(action, {});
  const [imageUrl, setImageUrl] = useState(product?.image_url ?? "");
  const [imageChanged, setImageChanged] = useState(false);
  const [imageError, setImageError] = useState("");
  function readImage(file?: File) {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 500 * 1024) {
      setImageError("Choose a JPG, PNG, or WebP image under 500 KB."); return;
    }
    const reader = new FileReader();
    reader.onload = () => { setImageUrl(String(reader.result)); setImageChanged(true); setImageError(""); };
    reader.onerror = () => setImageError("Couldn’t read this image. Please try another file.");
    reader.readAsDataURL(file);
  }

  return (
    <form action={formAction} className="card space-y-5 p-6">
      <div className="product-photo-editor">
        <ProductImage useDemo={false} src={validProductImage(imageUrl) ? imageUrl : null} name={product?.name || "Product preview"} />
        <div><h2>Give your product a face.</h2><p>Add a photo to make your catalog easier to browse.</p>
          <label htmlFor="image_file" className="photo-upload-label">Upload photo</label>
          <input id="image_file" type="file" accept="image/jpeg,image/png,image/webp" onChange={e => { readImage(e.target.files?.[0]); e.target.value = ""; }} />
          <label htmlFor="image_link" className="label">Or paste an image link</label>
          <input id="image_link" type="url" className="input" value={imageUrl.startsWith("data:") ? "" : imageUrl} placeholder="https://example.com/product.jpg" onChange={e => { setImageUrl(e.target.value); setImageChanged(true); setImageError(""); }} />
          <input type="hidden" name="image_url" value={imageUrl} /><input type="hidden" name="image_changed" value={String(imageChanged)} />
          <p>JPG, PNG, or WebP · Up to 500 KB</p>
          {imageUrl && <button type="button" className="photo-remove" onClick={() => { setImageUrl(""); setImageChanged(true); setImageError(""); }}>Remove photo</button>}
          {imageError && <p role="alert" className="text-red-700">{imageError}</p>}
        </div>
      </div>
      <div>
        <label htmlFor="name" className="label">
          Product name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={product?.name ?? ""}
          className="input"
          placeholder="e.g. Ceramic Coffee Mug"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="sku" className="label">
            SKU
          </label>
          <input
            id="sku"
            name="sku"
            defaultValue={product?.sku ?? ""}
            className="input"
            placeholder="e.g. MUG-001"
          />
        </div>
        <div>
          <label htmlFor="category" className="label">
            Category
          </label>
          <input
            id="category"
            name="category"
            list="category-options"
            defaultValue={product?.category ?? ""}
            className="input"
            placeholder="e.g. Kitchenware"
          />
          <datalist id="category-options">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="unit_price" className="label">
            Unit price (USD)
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
              $
            </span>
            <input
              id="unit_price"
              name="unit_price"
              type="number"
              min="0"
              step="0.01"
              defaultValue={product?.unit_price ?? 0}
              className="input pl-7"
              placeholder="0.00"
            />
          </div>
        </div>
        <div>
          <label htmlFor="reorder_level" className="label">
            Reorder level
          </label>
          <input
            id="reorder_level"
            name="reorder_level"
            type="number"
            min="0"
            step="1"
            defaultValue={product?.reorder_level ?? 0}
            className="input"
            placeholder="0"
          />
          <p className="mt-1 text-xs text-slate-400">
            Flag as low stock when quantity drops to this level.
          </p>
        </div>
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
        <Link href={cancelHref} className="btn-secondary">
          Cancel
        </Link>
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}

