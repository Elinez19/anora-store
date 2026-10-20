"use client";

import Link from "next/link";
import { useState, useTransition, useEffect } from "react";
import { deleteCategoryAction, saveCategoryAction } from "@/lib/admin-actions";

export interface AdminCategoryItem {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  imageAlt: string | null;
  position: number;
  pieceCount: number;
  createdAt?: Date;
}

interface CollectionsTableProps {
  categories: AdminCategoryItem[];
}

export function CollectionsTable({ categories }: CollectionsTableProps) {
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<AdminCategoryItem | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Close dropdown on click outside or escape key
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

  // Handle link copy
  const handleCopyLink = async (slug: string, id: string) => {
    try {
      const url = `${window.location.origin}/collections/${slug}`;
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      console.error("Failed to copy collection link", e);
    }
  };

  // Handle single collection delete
  const handleDelete = (cat: AdminCategoryItem) => {
    setActiveDropdownId(null);

    if (cat.pieceCount > 0) {
      alert(
        `Cannot delete collection "${cat.name}" because it currently has ${cat.pieceCount} product${
          cat.pieceCount === 1 ? "" : "s"
        } assigned. Please reassign or delete these products first.`
      );
      return;
    }

    if (!confirm(`Are you sure you want to delete collection "${cat.name}"? This action cannot be undone.`)) {
      return;
    }

    startTransition(async () => {
      const res = await deleteCategoryAction(cat.id);
      if (res?.error) {
        alert(res.error);
      }
    });
  };

  // Handle edit category form submission
  const handleSaveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEditError(null);
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await saveCategoryAction(formData);
      if (res?.error) {
        setEditError(res.error);
      } else {
        setEditingCategory(null);
      }
    } catch (err) {
      console.error("Failed to update collection", err);
      setEditError("An unexpected error occurred while saving the collection.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-zinc-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.9)] text-zinc-950 relative">
        {/* Table / List Header */}
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-base text-zinc-950 font-sans">
              Active Store Categories ({categories.length})
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-400 bg-zinc-50 px-2.5 py-1 rounded-md border border-zinc-100">
            Position Ordered
          </span>
        </div>

        {/* Collection Rows */}
        <div className="divide-y divide-zinc-100">
          {categories.length === 0 ? (
            <div className="p-8 text-center text-zinc-400 text-xs font-mono">
              No categories configured yet. Use the form to create your first collection.
            </div>
          ) : (
            categories.map((cat, index) => {
              const isDropdownOpen = activeDropdownId === cat.id;
              // If row is among the bottom items, open dropdown upward to prevent viewport / boundary clipping
              const openUpward = index >= categories.length - 2 && categories.length > 2;

              return (
                <div
                  key={cat.id}
                  className={`p-5 flex items-center justify-between gap-4 transition-colors ${
                    index === categories.length - 1 ? "rounded-b-2xl" : ""
                  } ${isDropdownOpen ? "bg-zinc-50/90" : "hover:bg-zinc-50/80"}`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {cat.imageUrl ? (
                      <img
                        src={cat.imageUrl}
                        alt={cat.name}
                        className="w-14 h-14 rounded-xl object-cover bg-zinc-100 border border-zinc-200 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center font-mono text-xs text-zinc-400 flex-shrink-0">
                        No hero
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-zinc-950 truncate">
                          {cat.name}
                        </span>
                        <span className="font-mono text-[10px] text-zinc-400 truncate">
                          /{cat.slug}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono mt-1">
                        <span>Position: #{cat.position}</span>
                        <span>•</span>
                        <span className="font-semibold text-zinc-800">
                          {cat.pieceCount} {cat.pieceCount === 1 ? "product" : "products"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions 3-Dots Button & Dropdown Menu */}
                  <div className="relative inline-block text-left flex-shrink-0" data-actions-menu>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdownId(isDropdownOpen ? null : cat.id);
                      }}
                      className={`p-2 rounded-xl transition-all ${
                        isDropdownOpen
                          ? "bg-zinc-950 text-white shadow-sm"
                          : "text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100"
                      }`}
                      aria-label={`Actions for ${cat.name}`}
                      aria-expanded={isDropdownOpen}
                    >
                      {/* 3 Dots Vertical Icon */}
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="5" r="1.75" />
                        <circle cx="12" cy="12" r="1.75" />
                        <circle cx="12" cy="19" r="1.75" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div
                        className={`absolute right-0 ${
                          openUpward ? "bottom-full mb-1.5" : "top-full mt-1.5"
                        } w-52 rounded-xl bg-white/98 backdrop-blur-xl border border-zinc-200/90 shadow-[0_12px_36px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.06)] py-1.5 z-50 text-xs font-medium text-zinc-700 animate-in fade-in zoom-in-95 duration-100 text-left`}
                      >
                        {/* Edit Collection */}
                        <button
                          type="button"
                          onClick={() => {
                            setActiveDropdownId(null);
                            setEditingCategory(cat);
                          }}
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
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                          <span>Edit Collection</span>
                        </button>

                        {/* View on Storefront */}
                        <Link
                          href={`/collections/${cat.slug}`}
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

                        {/* Copy Collection URL */}
                        <button
                          type="button"
                          onClick={() => handleCopyLink(cat.slug, cat.id)}
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
                            {copiedId === cat.id ? "Link Copied!" : "Copy Collection URL"}
                          </span>
                        </button>

                        {/* View Products in Catalog */}
                        <Link
                          href={`/admin/products?categoryId=${cat.id}`}
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
                              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            />
                          </svg>
                          <span>View Products ({cat.pieceCount})</span>
                        </Link>

                        {/* Divider */}
                        <div className="my-1 border-t border-zinc-100" />

                        {/* Delete Collection */}
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => handleDelete(cat)}
                          className={`w-full flex items-center gap-2.5 px-3.5 py-2 transition text-left font-medium ${
                            cat.pieceCount > 0
                              ? "text-zinc-400 hover:bg-zinc-50"
                              : "hover:bg-rose-50 text-rose-600 hover:text-rose-700"
                          }`}
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
                          <span>Delete Collection</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 text-zinc-950 animate-in zoom-in-95 duration-150 relative"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div>
                <h3 className="font-bold text-base text-zinc-950 font-sans">
                  Edit Collection
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Update {editingCategory.name} details, banner image, and display order.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 transition"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 pt-4">
              <input type="hidden" name="id" value={editingCategory.id} />

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-600 mb-1.5 font-medium">
                  Category Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingCategory.name}
                  placeholder="e.g. Laptops"
                  className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-950"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-600 mb-1.5 font-medium">
                  URL Slug *
                </label>
                <input
                  type="text"
                  name="slug"
                  required
                  defaultValue={editingCategory.slug}
                  placeholder="e.g. laptops"
                  className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-950"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-600 mb-1.5 font-medium">
                  Hero Image URL
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  defaultValue={editingCategory.imageUrl || ""}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-950"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-600 mb-1.5 font-medium">
                  Image Alt Description
                </label>
                <input
                  type="text"
                  name="imageAlt"
                  defaultValue={editingCategory.imageAlt || ""}
                  placeholder="High-performance laptops and mobile workstations"
                  className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-950"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-600 mb-1.5 font-medium">
                  Position Index
                </label>
                <input
                  type="number"
                  name="position"
                  defaultValue={editingCategory.position}
                  className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-950"
                />
              </div>

              {editError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600">
                  {editError}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-zinc-950 text-white font-semibold text-xs hover:bg-zinc-800 transition disabled:opacity-50 shadow-sm"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export { CollectionsTable as CategoriesTable };
