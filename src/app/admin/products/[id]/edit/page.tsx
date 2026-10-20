import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminCategories, getAdminProductById } from "@/lib/admin-data";
import { ProductForm } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getAdminProductById(id),
    getAdminCategories(),
  ]);

  if (!product) {
    notFound();
  }

  const initialData = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    categoryId: product.categoryId,
    colour: product.colour,
    price: product.priceCents / 100,
    compareAtPrice: product.compareAtCents ? product.compareAtCents / 100 : null,
    badge: product.badge,
    description: product.description,
    details: product.details,
    care: product.care,
    stockQuantity: product.stockQuantity,
    madeToOrder: product.madeToOrder,
    stockDetail: product.stockDetail,
    images: product.images.map((img) => ({ url: img.url, alt: img.alt })),
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
          <Link href="/admin/products" className="hover:text-white transition">
            Catalogue
          </Link>
          <span>/</span>
          <span className="text-cyan-400">Edit Product</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Edit {product.name}
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Modify pricing, technical bullets, or update perspective gallery shots.
        </p>
      </div>

      <ProductForm categories={categories} initialData={initialData} />
    </div>
  );
}
