import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { CategoryFilterTabs } from "@/components/category-filter-tabs";
import { FeaturedSpotlight } from "@/components/featured-spotlight";
import {
  getCategoriesWithCounts,
  getNewArrivals,
  getProductsByCategory,
} from "@/lib/products";
import { NewsletterSignupForm } from "@/components/newsletter-signup-form";
import { hero, services } from "@/lib/sample-data";

/** Rebuild at most every five minutes so catalogue edits land without a deploy. */
export const revalidate = 300;

export default async function Home() {
  const [categories, allProducts, laptops, desktops, smartGadgets, accessories] =
    await Promise.all([
      getCategoriesWithCounts(),
      getNewArrivals(16),
      getProductsByCategory("laptops", 8),
      getProductsByCategory("desktops", 4),
      getProductsByCategory("smart-gadgets", 4),
      getProductsByCategory("accessories", 4),
    ]);

  // Find featured accessory or fallback to first product
  const spotlightProduct =
    accessories.find((p) => p.slug.includes("aeroguard")) ||
    accessories[0] ||
    allProducts[0];

  return (
    <>
      <SiteHeader />

      <main className="flex-1 bg-white">
        {/* --- Top Banner / Hero Showcase --------------------------------- */}
        <section className="relative overflow-hidden border-b border-neutral-200 bg-neutral-900 text-white">
          <div className="absolute inset-0 z-0 opacity-40">
            <Image
              src={hero.image}
              alt={hero.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
          </div>

          <div className="container-page relative z-10 py-16 lg:py-24">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-800/80 px-3 py-1 text-xs font-semibold text-neutral-300 backdrop-blur-sm">
                <span className="size-2 rounded-full bg-rose-500 animate-ping"></span>
                <span>{hero.season}</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-white">
                {hero.title}
              </h1>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl">
                {hero.copy}
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href="#latest-products"
                  className="btn btn-primary bg-white text-neutral-950 hover:bg-neutral-100 font-bold"
                >
                  Explore Gadgets
                </a>
                <a
                  href="#desktop-deals"
                  className="btn btn-outline border-neutral-600 text-white hover:bg-neutral-800"
                >
                  View Desktop Deals
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* --- Best Sellers (Matching Reference UI) ------------------------ */}
        <section className="container-page py-10 lg:py-14">
          <div className="flex items-center justify-between pb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
                Best Sellers
              </h2>
            </div>
            {/* Carousel navigation controls */}
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
            {laptops.slice(0, 4).map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              href="/collections/laptops"
              className="rounded-md border border-neutral-300 bg-white px-8 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-800 shadow-xs hover:bg-neutral-50 transition-colors"
            >
              View all
            </Link>
          </div>
        </section>

        {/* --- Latest Products with Filter Tabs (Matching Reference UI) ---- */}
        <section id="latest-products" className="container-page py-10 lg:py-14 border-t border-neutral-100">
          <div className="mb-6 flex flex-col gap-1">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
              Latest Products
            </h2>
          </div>

          <CategoryFilterTabs
            products={allProducts}
            categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
          />
        </section>

        {/* --- Desktop Deals (Matching Reference UI) ----------------------- */}
        <section id="desktop-deals" className="container-page py-10 lg:py-14 border-t border-neutral-100">
          <div className="flex items-center justify-between pb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
                Desktop Deals
              </h2>
            </div>
            <Link
              href="/collections/desktops"
              className="text-xs font-semibold text-neutral-500 hover:text-neutral-950 transition-colors"
            >
              Shop all desktops &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {desktops.slice(0, 4).map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>

        {/* --- Smart Gadgets You'll Love (Matching Reference UI) ----------- */}
        <section className="container-page py-10 lg:py-14 border-t border-neutral-100">
          <div className="flex items-center justify-between pb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
                Smart Gadgets <span className="underline decoration-neutral-950 underline-offset-4">You&apos;ll Love</span>
              </h2>
            </div>
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
            {smartGadgets.slice(0, 4).map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>

        {/* --- Featured Product Spotlight (AeroGuard Pro Backpack) --------- */}
        {spotlightProduct ? (
          <FeaturedSpotlight product={spotlightProduct} />
        ) : null}

        {/* --- Services & Guarantees Strip --------------------------------- */}
        <section className="border-t border-neutral-200 bg-neutral-50">
          <div className="container-page py-10">
            <ul className="grid gap-6 sm:grid-cols-3">
              {services.map((service) => (
                <li key={service.title} className="card-gloss p-5">
                  <h3 className="text-sm font-bold text-neutral-950">
                    {service.title}
                  </h3>
                  <p className="mt-1 text-xs text-neutral-600 leading-relaxed">
                    {service.copy}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* --- Newsletter -------------------------------------------------- */}
        <section className="container-page py-12 lg:py-16">
          <div className="card-gloss p-8 lg:p-12">
            <div className="max-w-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                Stay Updated
              </span>
              <h2 className="mt-2 text-2xl font-bold text-neutral-950">
                Get early access to gadget drops & flash discounts
              </h2>
              <p className="mt-2 text-xs text-neutral-600">
                Receive weekly inventory alerts on certified grade-A laptops, desk upgrades, and tech launches.
              </p>

              <NewsletterSignupForm />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
