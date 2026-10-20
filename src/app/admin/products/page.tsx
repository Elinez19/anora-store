import Link from "next/link";
import { getAdminCategories, getAdminProducts } from "@/lib/admin-data";
import { formatCents } from "@/lib/format";
import { StockQuickEdit } from "@/components/admin/stock-quick-edit";
import { deleteProductAction } from "@/lib/admin-actions";

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
          <span className="text-xs uppercase font-mono tracking-widest text-cyan-400">
            Catalogue
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
            Product Inventory
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage your hardware catalogue, pricing, specs, and real-time stock levels.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="px-5 py-2.5 rounded-xl bg-white text-zinc-950 font-bold text-xs hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center gap-2 self-start sm:self-auto"
        >
          <span>+ Add New Product</span>
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
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
            className="px-4 py-2 rounded-xl bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800 transition"
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
                    ? "bg-zinc-950 text-white"
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
                      ? "bg-zinc-950 text-white"
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
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden text-zinc-950">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/50 font-mono text-[11px] uppercase text-zinc-500">
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
                  <td colSpan={5} className="py-12 text-center text-zinc-400">
                    No products matched your search criteria.
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const thumbnail = p.images[0]?.url;

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-zinc-50/80 transition-colors"
                    >
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

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/products/${p.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 transition"
                            title="View on Storefront"
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
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </Link>

                          <Link
                            href={`/admin/products/${p.id}/edit`}
                            className="px-3 py-1 rounded-lg bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800 transition"
                          >
                            Edit
                          </Link>

                          <form
                            action={async () => {
                              "use server";
                              await deleteProductAction(p.id);
                            }}
                          >
                            <button
                              type="submit"
                              onClick={(e) => {
                                if (
                                  !confirm(
                                    `Are you sure you want to delete ${p.name}?`,
                                  )
                                ) {
                                  e.preventDefault();
                                }
                              }}
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="Delete Product"
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
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
