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
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
          <Link href="/admin/products" className="hover:text-white transition">
            Catalogue
          </Link>
          <span>/</span>
          <span className="text-cyan-400">New Product</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Add New Product
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Configure hardware specifications, gallery imagery, and pricing for the store.
        </p>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
