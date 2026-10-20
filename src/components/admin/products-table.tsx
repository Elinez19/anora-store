"use client";

import Link from "next/link";
import { useState, useTransition, useEffect, useRef } from "react";
import { formatCents } from "@/lib/format";
import { StockQuickEdit } from "@/components/admin/stock-quick-edit";
import {
  deleteProductAction,
  deleteProductsAction,
} from "@/lib/admin-actions";

export interface AdminProductItem {
  id: string;
  name: string;
  slug: string;
  sku: string;
  colour: string;
  priceCents: number;
  compareAtCents: number | null;
  badge: string | null;
  stockQuantity: number;
  madeToOrder: boolean;
  stockDetail: string | null;
  category: {
    name: string;
  };
  images: Array<{
    url: string;
  }>;
}

interface ProductsTableProps {
  products: AdminProductItem[];
}

export function ProductsTable({ products }: ProductsTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const headerCheckboxRef = useRef<HTMLInputElement>(null);

  const allSelected =
    products.length > 0 && products.every((p) => selectedIds.has(p.id));
  const isIndeterminate =
    !allSelected && products.some((p) => selectedIds.has(p.id));

  // Sync indeterminate state for header checkbox
  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  // Close dropdown on outside click or escape
  useEffect(() => {
    if (!activeDropdownId) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest("[data-actions-menu]")) {
        setActiveDropdownId(null);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveDropdownId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeDropdownId]);

  const handleToggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(products.map((p) => p.id)));
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleCopyLink = async (slug: string, id: string) => {
    try {
      const url = `${window.location.origin}/products/${slug}`;
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      console.error("Failed to copy link", e);
    }
  };

  const handleDeleteSingle = (id: string, name: string) => {
    setActiveDropdownId(null);
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    startTransition(async () => {
      const res = await deleteProductAction(id);
      if (res?.error) {
        alert(res.error);
      } else {
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    });
  };

  const handleBulkDelete = () => {
    const count = selectedIds.size;
    if (count === 0) return;

    if (
      !confirm(
        `Are you sure you want to delete ${count} selected product${
          count === 1 ? "" : "s"
        }? This action cannot be undone.`
      )
    ) {
      return;
    }

    startTransition(async () => {
      const res = await deleteProductsAction(Array.from(selectedIds));
      if (res?.error) {
        alert(res.error);
      } else {
        setSelectedIds(new Set());
      }
    });
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-zinc-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.9)] overflow-hidden text-zinc-950 relative">
      {/* Selection Summary Strip when items are selected */}
      {selectedIds.size > 0 && (
        <div className="bg-zinc-50 border-b border-zinc-200/90 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs text-zinc-700 animate-in fade-in duration-150">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-zinc-950 font-sans">
              {selectedIds.size} of {products.length} product
              {products.length === 1 ? "" : "s"} selected
            </span>
            {selectedIds.size < products.length && (
              <button
                type="button"
                onClick={() =>
                  setSelectedIds(new Set(products.map((p) => p.id)))
                }
                className="text-zinc-500 hover:text-zinc-950 underline font-mono text-[11px] transition"
              >
                Select all {products.length}
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setSelectedIds(new Set())}
              className="text-xs text-zinc-500 hover:text-zinc-950 transition font-medium"
            >
              Clear selection
            </button>
            <button
              type="button"
              onClick={handleBulkDelete}
              disabled={isPending}
              className="px-3 py-1 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 font-semibold text-xs flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <span>Delete ({selectedIds.size})</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="overflow-x-auto min-h-[320px]">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/60 font-mono text-[11px] uppercase text-zinc-500 select-none">
              {/* Checkbox Header */}
              <th className="py-3.5 px-4 w-12 text-center">
                <input
                  ref={headerCheckboxRef}
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleToggleAll}
                  aria-label="Select all products"
                  className="w-4 h-4 rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950 focus:ring-offset-0 cursor-pointer accent-zinc-950 transition align-middle"
                />
              </th>
              <th className="py-3.5 px-4">Product Details</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Price</th>
              <th className="py-3.5 px-4">Stock Level</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 font-medium">
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-zinc-400">
                  No products matched your search criteria.
                </td>
              </tr>
            ) : (
              products.map((p, index) => {
                const thumbnail = p.images[0]?.url;
                const isSelected = selectedIds.has(p.id);
                const isDropdownOpen = activeDropdownId === p.id;
                // If row is among the last 2 and table has several items, open dropdown upwards to avoid clipping
                const openUpward =
                  index >= products.length - 2 && products.length > 2;

                return (
                  <tr
                    key={p.id}
                    className={`transition-colors ${
                      isSelected
                        ? "bg-zinc-100/70 border-l-2 border-l-zinc-950"
                        : "hover:bg-zinc-50/80 border-l-2 border-l-transparent"
                    }`}
                  >
                    {/* Row Checkbox Cell */}
                    <td
                      className="py-4 px-4 w-12 text-center cursor-pointer"
                      onClick={() => handleToggleRow(p.id)}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleToggleRow(p.id);
                        }}
                        aria-label={`Select ${p.name}`}
                        className="w-4 h-4 rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950 focus:ring-offset-0 cursor-pointer accent-zinc-950 transition align-middle"
                      />
                    </td>

                    {/* Product Preview */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3.5">
                        {thumbnail ? (
                          <img
                            src={thumbnail}
                            alt={p.name}
                            className="w-12 h-12 rounded-xl object-cover bg-zinc-100 border border-zinc-200 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400 font-mono text-[10px]">
                            No img
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-zinc-950 truncate max-w-[280px]">
                              {p.name}
                            </span>
                            {p.badge && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-rose-50 text-rose-600 border border-rose-200">
                                {p.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-2 mt-0.5">
                            <span>SKU: {p.sku}</span>
                            <span>•</span>
                            <span>{p.colour}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 text-zinc-600">
                      <span className="px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-800 text-[11px] font-mono">
                        {p.category.name}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-4 px-4 font-mono font-bold text-zinc-950">
                      {formatCents(p.priceCents)}
                      {p.compareAtCents && (
                        <div className="text-[10px] line-through text-zinc-400 font-normal">
                          {formatCents(p.compareAtCents)}
                        </div>
                      )}
                    </td>

                    {/* Stock Level with Quick Edit */}
                    <td className="py-4 px-4">
                      <StockQuickEdit
                        productId={p.id}
                        initialStock={p.stockQuantity}
                        initialMadeToOrder={p.madeToOrder}
                        initialStockDetail={p.stockDetail}
                      />
                    </td>

                    {/* Actions: 3 Dots with Dropdown */}
                    <td className="py-4 px-4 text-right">
                      <div
                        className="relative inline-block text-left"
                        data-actions-menu
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdownId(
                              isDropdownOpen ? null : p.id
                            );
                          }}
                          className={`p-2 rounded-xl transition-all ${
                            isDropdownOpen
                              ? "bg-zinc-950 text-white shadow-sm"
                              : "text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100"
                          }`}
                          aria-label={`Actions for ${p.name}`}
                          aria-expanded={isDropdownOpen}
                        >
                          {/* 3 Dots Vertical Icon */}
                          <svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <circle cx="12" cy="5" r="1.75" />
                            <circle cx="12" cy="12" r="1.75" />
                            <circle cx="12" cy="19" r="1.75" />
                          </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                          <div
                            className={`absolute right-0 ${
                              openUpward
                                ? "bottom-full mb-1.5"
                                : "top-full mt-1.5"
                            } w-52 rounded-xl bg-white/98 backdrop-blur-xl border border-zinc-200/90 shadow-[0_12px_36px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.06)] py-1.5 z-50 text-xs font-medium text-zinc-700 animate-in fade-in zoom-in-95 duration-100 text-left`}
                          >
                            {/* Edit Product */}
                            <Link
                              href={`/admin/products/${p.id}/edit`}
                              className="flex items-center gap-2.5 px-3.5 py-2 hover:bg-zinc-100/80 text-zinc-800 transition"
                              onClick={() => setActiveDropdownId(null)}
                            >
                              <svg
                                className="w-4 h-4 text-zinc-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.75}
                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                />
                              </svg>
                              <span>Edit Product</span>
                            </Link>

                            {/* View on Storefront */}
                            <Link
                              href={`/products/${p.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2.5 px-3.5 py-2 hover:bg-zinc-100/80 text-zinc-800 transition"
                              onClick={() => setActiveDropdownId(null)}
                            >
                              <svg
                                className="w-4 h-4 text-zinc-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.75}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                              <span>View on Store</span>
                            </Link>

                            {/* Copy Product Link */}
                            <button
                              type="button"
                              onClick={() => handleCopyLink(p.slug, p.id)}
                              className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-zinc-100/80 text-zinc-800 transition text-left"
                            >
                              <svg
                                className="w-4 h-4 text-zinc-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.75}
                                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                />
                              </svg>
                              <span>
                                {copiedId === p.id
                                  ? "Link Copied!"
                                  : "Copy Product URL"}
                              </span>
                            </button>

                            {/* Divider */}
                            <div className="my-1 border-t border-zinc-100" />

                            {/* Delete Product */}
                            <button
                              type="button"
                              onClick={() => handleDeleteSingle(p.id, p.name)}
                              className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-rose-50 text-rose-600 hover:text-rose-700 transition text-left font-medium"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.75}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              <span>Delete Product</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Floating Bottom Selection Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-zinc-950/95 backdrop-blur-xl text-white px-5 py-3 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.35)] border border-zinc-800 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-wide">
              {selectedIds.size} {selectedIds.size === 1 ? "item" : "items"}{" "}
              selected
            </span>
          </div>

          <div className="h-4 w-px bg-zinc-800" />

          <button
            type="button"
            onClick={handleToggleAll}
            className="text-xs text-zinc-400 hover:text-white transition font-medium cursor-pointer"
          >
            {allSelected ? "Deselect All" : "Select All"}
          </button>

          <button
            type="button"
            onClick={handleBulkDelete}
            disabled={isPending}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-2 transition active:scale-95 disabled:opacity-50 shadow-sm cursor-pointer"
          >
            {isPending ? (
              <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            )}
            <span>Delete Selected</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedIds(new Set())}
            className="p-1 rounded-lg text-zinc-400 hover:text-white transition cursor-pointer"
            title="Clear selection"
            aria-label="Clear selection"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
