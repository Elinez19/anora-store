import Link from "next/link";
import { Suspense } from "react";
import {
  AccountNavLink,
  AccountNavLinkFallback,
} from "@/components/account-nav-link";
import { BagCount, BagCountFallback } from "@/components/bag-count";
import { ModernCartView } from "@/components/modern-cart-view";
import { ProductCard } from "@/components/product-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getBag, getGuestBag } from "@/lib/cart";
import { getGuestCart } from "@/lib/cart-guest";
import { currency } from "@/lib/format";
import { getNewArrivals, getProductsByCategory } from "@/lib/products";
import { getCurrentUser } from "@/lib/session";

/** One customer's cart; never cacheable. */
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Your cart | Shopinverse",
};

export default async function BagPage({ searchParams }: PageProps<"/bag">) {
  const user = await getCurrentUser();
  const [{ cancelled }, bag, relatedProducts, accessoryProducts] = await Promise.all([
    searchParams,
    user ? getBag(user.id) : getGuestCart().then(getGuestBag),
    getNewArrivals(4),
    getProductsByCategory("accessories", 2),
  ]);

  // Transform accessory recommendations for the addon cards
  const addons = accessoryProducts.map((p) => ({
    slug: p.slug,
    name: p.name,
    priceFormatted: currency.format(p.price),
    compareAtFormatted: p.compareAtPrice ? currency.format(p.compareAtPrice) : currency.format(p.price * 1.2),
    image: p.images[0]?.src || "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80",
  }));

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900">
      <SiteHeader
        account={
          <Suspense fallback={<AccountNavLinkFallback />}>
            <AccountNavLink />
          </Suspense>
        }
        bag={
          <Suspense fallback={<BagCountFallback />}>
            <BagCount />
          </Suspense>
        }
      />

      <main className="flex-1">
        <div className="container-page py-8 lg:py-12 space-y-12">
          {/* Top Title & Continue Shopping */}
          <div className="flex items-center justify-between border-b border-neutral-100 pb-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight">
              Your cart
            </h1>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-300 rounded-lg text-xs font-semibold text-neutral-800 hover:bg-neutral-50 transition-colors"
            >
              <svg className="size-3.5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Continue Shopping</span>
            </Link>
          </div>

          {cancelled ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
              Checkout was cancelled. Your cart items are preserved.
            </div>
          ) : null}

          {/* Interactive Cart View */}
          <ModernCartView bag={bag} addons={addons} />

          {/* You May Also Like Section */}
          <section className="pt-12 border-t border-neutral-100 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-neutral-950 tracking-tight">
                You may also like
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </section>

          {/* Value Props & Guarantee Strip */}
          <section className="pt-8 border-t border-neutral-100">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-8">
              <div className="flex items-center gap-3.5">
                <div className="size-10 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 text-neutral-800">
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-neutral-900">Earn 5% Commission</h3>
                  <p className="text-[11px] text-neutral-500">Join affiliate and earn money on every qualified order.</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="size-10 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 text-neutral-800">
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-neutral-900">Free Delivery</h3>
                  <p className="text-[11px] text-neutral-500">Free standard shipping on orders nationwide.</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="size-10 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 text-neutral-800">
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-neutral-900">Customer Service</h3>
                  <p className="text-[11px] text-neutral-500">Friendly 24/7 technical support, always here for you.</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="size-10 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 text-neutral-800">
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-neutral-900">Confidence</h3>
                  <p className="text-[11px] text-neutral-500">Shop with confidence knowing your purchase is backed by warranty.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
