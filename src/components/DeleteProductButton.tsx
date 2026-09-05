"use client";

import { useState, useTransition } from "react";
import { deleteProduct } from "@/app/(dashboard)/products/actions";

export default function DeleteProductButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteProduct(productId);
    });
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="btn-danger"
      >
        Delete
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-sm text-slate-500 sm:inline">
        Delete “{productName}”?
      </span>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="btn bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
      >
        {isPending ? "Deleting…" : "Confirm"}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        disabled={isPending}
        className="btn-secondary"
      >
        Cancel
      </button>
    </div>
  );
}
