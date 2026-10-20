import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { ProductDetailsView } from "@/components/product-details-view";
import { ProductAccordionAndFaq } from "@/components/product-accordion-and-faq";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  getJustArrived,
  getProductBySlug,
  getProductSlugs,
  getRelatedProducts,
} from "@/lib/products";

/** Rebuild at most every five minutes so catalogue edits land without a deploy. */
export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, recentlyViewed] = await Promise.all([
    getRelatedProducts(product, 4),
    getJustArrived(3, 2),
  ]);

  return (
    <>
      <SiteHeader />

      <main className="flex-1 bg-white">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="container-page py-4 border-b border-neutral-100">
          <ol className="flex flex-wrap items-center gap-2 text-xs font-medium text-neutral-500">
            <li>
              <Link href="/" className="hover:text-neutral-900 transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link
                href={`/collections/${product.categorySlug}`}
                className="hover:text-neutral-900 transition-colors"
              >
                {product.category}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-neutral-900 font-semibold truncate max-w-xs sm:max-w-md" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* Product Details Main View (Top Buy Box & Configurator) */}
        <ProductDetailsView product={product} />

        {/* --- Specifications Accordion, What's in the Box, Banner & Dark FAQs Split --- */}
        <ProductAccordionAndFaq productName={product.name} />

        {/* --- You May Also Like Section (Matching Screenshot) --- */}
        <section className="container-page py-10 lg:py-14 border-t border-neutral-100">
          <div className="flex items-center justify-between pb-6">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
              You may also like
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous"
                className="flex size-8 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 shadow-xs hover:border-neutral-300 hover:text-black transition-colors"
              >
                &larr;
              </button>
              <button
                type="button"
                aria-label="Next"
                className="flex size-8 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 shadow-xs hover:border-neutral-300 hover:text-black transition-colors"
              >
                &rarr;
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {related.slice(0, 4).map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </section>

        {/* --- Recently Viewed Section (Matching Screenshot) --- */}
        <section className="container-page py-8 lg:py-12 border-t border-neutral-100">
          <div className="pb-6">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
              Recently Viewed
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
            {recentlyViewed.slice(0, 3).map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </section>

        {/* --- Bottom Notice / Guarantee Bar (Matching Yellow Strip) --- */}
        <div className="bg-amber-100/90 text-amber-950 text-xs font-semibold py-3 px-4 text-center border-t border-amber-200 flex items-center justify-center gap-2">
          <span>⚡</span>
          <span>Earn ₦1,250 loyalty rewards credits on this purchase when signed in</span>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
