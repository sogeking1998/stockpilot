"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { recordMovement, type FormState } from "@/app/(dashboard)/products/actions";

function SubmitButton({ type }: { type: "in" | "out" }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={
        type === "in"
          ? "btn w-full bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500"
          : "btn w-full bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500"
      }
    >
      {pending
        ? "Recording…"
        : type === "in"
          ? "Record Stock In (+)"
          : "Record Stock Out (−)"}
    </button>
  );
}

export default function MovementForm({ productId }: { productId: string }) {
  const boundAction = recordMovement.bind(null, productId);
  const [state, formAction] = useActionState<FormState, FormData>(
    boundAction,
    {}
  );
  const [type, setType] = useState<"in" | "out">("in");
  const formRef = useRef<HTMLFormElement>(null);
  const [justSaved, setJustSaved] = useState(false);

  // Reset the form after a successful (error-free) submission.
  useEffect(() => {
    if (state && !state.error) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={(fd) => {
        setJustSaved(true);
        formAction(fd);
      }}
      className="space-y-4"
    >
      <input type="hidden" name="type" value={type} />

      <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setType("in")}
          className={`rounded-md px-3 py-2 text-sm font-medium transition ${
            type === "in"
              ? "bg-white text-emerald-700 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Stock In (+)
        </button>
        <button
          type="button"
          onClick={() => setType("out")}
          className={`rounded-md px-3 py-2 text-sm font-medium transition ${
            type === "out"
              ? "bg-white text-rose-700 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Stock Out (−)
        </button>
      </div>

      <div>
        <label htmlFor="quantity" className="label">
          Quantity
        </label>
        <input
          id="quantity"
          name="quantity"
          type="number"
          min="1"
          step="1"
          required
          className="input"
          placeholder="0"
        />
      </div>

      <div>
        <label htmlFor="note" className="label">
          Note <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <input
          id="note"
          name="note"
          className="input"
          placeholder={type === "in" ? "e.g. Restock from supplier" : "e.g. Sold in store"}
        />
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {justSaved && !state.error && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Movement recorded.
        </p>
      )}

      <SubmitButton type={type} />
    </form>
  );
}
