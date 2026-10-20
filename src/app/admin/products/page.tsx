import Link from "next/link";
import { getAdminCategories, getAdminProducts } from "@/lib/admin-data";
import { ProductsTable } from "@/components/admin/products-table";

export const dynamic = "force-dynamic";

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    categoryId?: string;
    stock?: string;
  }>;
}

export default async function AdminProductsPage({
  searchParams,
}: ProductsPageProps) {
  const resolvedParams = await searchParams;
  const [products, categories] = await Promise.all([
    getAdminProducts({
      search: resolvedParams.search,
      categoryId: resolvedParams.categoryId,
      stock: resolvedParams.stock,
    }),
    getAdminCategories(),
  ]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-zinc-500 font-semibold">
            Catalogue
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 mt-1">
            Product Inventory
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Manage your hardware catalogue, pricing, specs, and real-time stock levels.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="px-5 py-2.5 rounded-xl bg-zinc-950 text-white font-semibold text-xs hover:bg-zinc-800 transition-all shadow-[0_4px_14px_rgba(0,0,0,0.12)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.18)] active:scale-[0.98] border border-black/10 flex items-center gap-2 self-start sm:self-auto"
        >
          <span>+ Add New Product</span>
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-zinc-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.9)] flex flex-col md:flex-row gap-4 items-center justify-between">
        <form className="flex-1 w-full md:w-auto flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              name="search"
              defaultValue={resolvedParams.search || ""}
              placeholder="Search by title, SKU, or slug..."
              className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-950"
            />
            <svg
              className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800 transition shadow-sm active:scale-[0.98]"
          >
            Filter
          </button>
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Category Quick Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 font-mono">Category:</span>
            <div className="flex gap-1 overflow-x-auto">
              <Link
                href="/admin/products"
                className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                  !resolvedParams.categoryId
                    ? "bg-zinc-950 text-white shadow-xs"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                All
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/admin/products?categoryId=${c.id}`}
                  className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                    resolvedParams.categoryId === c.id
                      ? "bg-zinc-950 text-white shadow-xs"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  }`}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <ProductsTable products={products} />
    </div>
  );
}
