import Link from "next/link";
import { getAdminCategories } from "@/lib/admin-data";
import { deleteCategoryAction, saveCategoryAction } from "@/lib/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categoriesList = await getAdminCategories();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-cyan-400">
            Structure
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
            Collections & Categories
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Organize hardware categories, homepage collection spotlights, and piece counts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Categories List (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden text-zinc-950">
          <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
            <h2 className="font-bold text-base text-zinc-950 font-sans">
              Active Store Categories ({categoriesList.length})
            </h2>
            <span className="text-xs font-mono text-zinc-400">Position Ordered</span>
          </div>

          <div className="divide-y divide-zinc-100">
            {categoriesList.map((cat) => (
              <div
                key={cat.id}
                className="p-5 flex items-center justify-between gap-4 hover:bg-zinc-50/80 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {cat.imageUrl ? (
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="w-14 h-14 rounded-xl object-cover bg-zinc-100 border border-zinc-200"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center font-mono text-xs text-zinc-400">
                      No hero
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-zinc-950">
                        {cat.name}
                      </span>
                      <span className="font-mono text-[10px] text-zinc-400">
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

                <div className="flex items-center gap-2">
                  <Link
                    href={`/collections/${cat.slug}`}
                    target="_blank"
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 transition"
                    title="View Collection"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>

                  <form
                    action={async () => {
                      "use server";
                      await deleteCategoryAction(cat.id);
                    }}
                  >
                    <button
                      type="submit"
                      disabled={cat.pieceCount > 0}
                      onClick={(e) => {
                        if (
                          !confirm(
                            `Delete category "${cat.name}"? This cannot be undone.`,
                          )
                        ) {
                          e.preventDefault();
                        }
                      }}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition disabled:opacity-30 disabled:hover:text-zinc-400 disabled:hover:bg-transparent"
                      title={
                        cat.pieceCount > 0
                          ? "Cannot delete category with active products"
                          : "Delete category"
                      }
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Category Form (1 col) */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm text-zinc-950 flex flex-col">
          <h2 className="font-bold text-base text-zinc-950 font-sans mb-1">
            Create Category
          </h2>
          <p className="text-xs text-zinc-500 mb-6">
            Add a new departmental collection to the storefront.
          </p>

          <form
            action={async (formData: FormData) => {
              "use server";
              await saveCategoryAction(formData);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-600 mb-1.5">
                Category Name *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Gaming Gear"
                className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-950"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-600 mb-1.5">
                URL Slug *
              </label>
              <input
                type="text"
                name="slug"
                required
                placeholder="e.g. gaming-gear"
                className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-950"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-600 mb-1.5">
                Hero Image URL
              </label>
              <input
                type="url"
                name="imageUrl"
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-950"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-600 mb-1.5">
                Image Alt Description
              </label>
              <input
                type="text"
                name="imageAlt"
                placeholder="High-performance mechanical keyboards and gear"
                className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-950"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-600 mb-1.5">
                Position Index
              </label>
              <input
                type="number"
                name="position"
                defaultValue={categoriesList.length}
                className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-950"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-zinc-950 text-white font-semibold text-xs hover:bg-zinc-800 transition mt-2"
            >
              Add Category
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
