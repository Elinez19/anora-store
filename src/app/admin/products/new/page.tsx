import Link from "next/link";
import { getAdminCategories } from "@/lib/admin-data";
import { ProductForm } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await getAdminCategories();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-2 font-medium">
          <Link href="/admin/products" className="hover:text-zinc-950 transition">
            Catalogue
          </Link>
          <span>/</span>
          <span className="text-zinc-950 font-semibold">New Product</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950">
          Add New Product
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Configure hardware specifications, gallery imagery, and pricing for the store.
        </p>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
