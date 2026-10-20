"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AddToBagForm } from "@/components/add-to-bag-form";
import { currency } from "@/lib/format";
import { type Product } from "@/lib/products";

type FeaturedSpotlightProps = {
  product: Product;
};

export function FeaturedSpotlight({ product }: FeaturedSpotlightProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const images = product.images.length > 0 ? product.images : [
    {
      src: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80",
      alt: product.name,
    },
  ];

  const activeImage = images[activeImageIndex] || images[0];

  return (
    <section className="container-page py-12 lg:py-16">
      <div className="card-gloss relative overflow-hidden p-6 lg:p-12">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          {/* Left: Thumbnail Strip & Large Image Preview */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row items-center gap-4">
            {/* Thumbnails */}
            {images.length > 1 ? (
              <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-visible w-full sm:w-auto shrink-0 py-1">
                {images.map((img, i) => (
                  <button
                    key={img.src}
                    type="button"
                    onClick={() => setActiveImageIndex(i)}
                    className={`relative size-16 shrink-0 overflow-hidden rounded-md border-2 bg-neutral-50 transition-all ${
                      activeImageIndex === i
                        ? "border-neutral-900 shadow-xs"
                        : "border-neutral-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            ) : null}

            {/* Main Packshot Canvas */}
            <div className="relative aspect-4/3 sm:aspect-square w-full overflow-hidden rounded-lg bg-neutral-100/70 p-4">
              {/* Product Featured Badge */}
              <div className="absolute top-4 right-4 z-10 flex size-16 items-center justify-center rounded-full border border-neutral-300 bg-white/90 text-center text-[10px] font-bold uppercase tracking-widest text-neutral-800 shadow-sm backdrop-blur-xs">
                Featured
              </div>
              <Image
                src={activeImage.src}
                alt={activeImage.alt}
                fill
                priority
                className="object-contain p-4 transition-all duration-300"
              />
            </div>
          </div>

          {/* Right: Product Buy Box & Guarantees */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-600">
              Tech Spotlight
            </span>
            <h2 className="mt-2 text-2xl lg:text-3xl font-extrabold text-neutral-950 leading-tight">
              {product.name}
            </h2>

            <div className="mt-4 flex items-baseline gap-3" data-numeric>
              <span className="text-2xl font-black text-neutral-950">
                {currency.format(product.price)}
              </span>
              {product.compareAtPrice ? (
                <span className="text-sm text-neutral-400 line-through">
                  {currency.format(product.compareAtPrice)}
                </span>
              ) : null}
            </div>

            <p className="mt-4 text-xs lg:text-sm text-neutral-600 leading-relaxed">
              {product.description}
            </p>

            {/* Quick Specs Chips */}
            <div className="mt-5 flex flex-wrap gap-2">
              {product.details.slice(0, 3).map((detail) => (
                <span
                  key={detail}
                  className="rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[11px] font-medium text-neutral-700"
                >
                  ✓ {detail}
                </span>
              ))}
            </div>

            {/* Add to bag action */}
            <div className="mt-6 flex flex-col gap-3">
              <AddToBagForm slug={product.slug} soldOut={product.stock === "sold_out"} />
              <Link
                href={`/products/${product.slug}`}
                className="text-center text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                View full specifications &rarr;
              </Link>
            </div>

            {/* Delivery & Warranty Perks matching screenshot */}
            <div className="mt-8 space-y-3 border-t border-neutral-100 pt-6 text-xs text-neutral-600">
              <div className="flex items-center gap-3">
                <svg className="size-4.5 text-neutral-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                <span>Nationwide dispatch within 1–2 business days</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="size-4.5 text-neutral-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Complimentary 7-day hassle-free returns</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="size-4.5 text-neutral-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>128 Days Certified Hardware Warranty</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
