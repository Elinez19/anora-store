import { getAdminCategories } from "@/lib/admin-data";
import { saveCategoryAction } from "@/lib/admin-actions";
import { CollectionsTable } from "@/components/admin/collections-table";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categoriesList = await getAdminCategories();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-zinc-500 font-semibold">
            Structure
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 mt-1">
            Collections & Categories
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Organize hardware categories, homepage collection spotlights, and piece counts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Categories List (2 cols) */}
        <div className="lg:col-span-2">
          <CollectionsTable categories={categoriesList} />
        </div>

        {/* Add Category Form (1 col) */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-zinc-200/80 p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.9)] text-zinc-950 flex flex-col">
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
              <label className="block text-xs font-mono uppercase text-zinc-600 mb-1.5 font-medium">
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
              <label className="block text-xs font-mono uppercase text-zinc-600 mb-1.5 font-medium">
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
              <label className="block text-xs font-mono uppercase text-zinc-600 mb-1.5 font-medium">
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
              <label className="block text-xs font-mono uppercase text-zinc-600 mb-1.5 font-medium">
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
              <label className="block text-xs font-mono uppercase text-zinc-600 mb-1.5 font-medium">
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
              className="w-full py-2.5 rounded-xl bg-zinc-950 text-white font-semibold text-xs hover:bg-zinc-800 transition-all shadow-[0_4px_14px_rgba(0,0,0,0.12)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.18)] active:scale-[0.98] mt-2"
            >
              Add Category
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
