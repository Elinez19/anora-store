"use client";

import { useState } from "react";
import { updateStockAction } from "@/lib/admin-actions";

interface StockQuickEditProps {
  productId: string;
  initialStock: number;
  initialMadeToOrder: boolean;
  initialStockDetail?: string | null;
}

export function StockQuickEdit({
  productId,
  initialStock,
  initialMadeToOrder,
  initialStockDetail,
}: StockQuickEditProps) {
  const [stock, setStock] = useState(initialStock);
  const [madeToOrder, setMadeToOrder] = useState(initialMadeToOrder);
  const [detail, setDetail] = useState(initialStockDetail || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  async function handleSave() {
    setIsLoading(true);
    setSavedSuccess(false);

    const res = await updateStockAction(productId, stock, madeToOrder, detail);
    setIsLoading(false);

    if (res.success) {
      setSavedSuccess(true);
      setTimeout(() => {
        setIsEditing(false);
        setSavedSuccess(false);
      }, 1000);
    } else {
      alert(res.error || "Failed to update stock");
    }
  }

  if (!isEditing) {
    return (
      <div className="flex items-center gap-2">
        <span
          className={`font-mono text-xs font-semibold px-2 py-0.5 rounded-full ${
            madeToOrder
              ? "bg-purple-100 text-purple-800 border border-purple-200"
              : stock === 0
              ? "bg-rose-100 text-rose-700 border border-rose-200"
              : stock <= 3
              ? "bg-amber-100 text-amber-800 border border-amber-200"
              : "bg-emerald-100 text-emerald-800 border border-emerald-200"
          }`}
        >
          {madeToOrder ? "Made to Order" : `${stock} units`}
        </span>
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="text-zinc-400 hover:text-zinc-950 p-1 rounded hover:bg-zinc-100 transition-colors"
          title="Quick Edit Stock"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-3 bg-zinc-900 text-white rounded-xl border border-zinc-700 shadow-xl min-w-[220px]">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono text-zinc-400">Inventory Adjust</span>
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="text-zinc-400 hover:text-white text-xs"
        >
          ✕
        </button>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-[11px] text-zinc-400 w-16">Units:</label>
        <input
          type="number"
          min={0}
          value={stock}
          onChange={(e) => setStock(Math.max(0, parseInt(e.target.value) || 0))}
          className="w-20 px-2 py-1 bg-zinc-950 border border-zinc-700 rounded text-xs text-white font-mono"
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="text-[11px] text-zinc-400 w-16">Notice:</label>
        <input
          type="text"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder="e.g. Dispatched in 24h"
          className="flex-1 px-2 py-1 bg-zinc-950 border border-zinc-700 rounded text-xs text-white"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={`mto-${productId}`}
          checked={madeToOrder}
          onChange={(e) => setMadeToOrder(e.target.checked)}
          className="rounded border-zinc-700 text-cyan-500 focus:ring-0 w-3.5 h-3.5"
        />
        <label htmlFor={`mto-${productId}`} className="text-[11px] text-zinc-300">
          Made to order
        </label>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          disabled={isLoading}
          onClick={handleSave}
          className="flex-1 py-1 rounded bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-colors disabled:opacity-50"
        >
          {isLoading ? "Saving..." : savedSuccess ? "✓ Done" : "Save"}
        </button>
      </div>
    </div>
  );
}
