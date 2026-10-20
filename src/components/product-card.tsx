"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { currency } from "@/lib/format";
import { type Product } from "@/lib/products";
import { addToBag } from "@/lib/cart-actions";
import { QuickPreviewModal } from "@/components/quick-preview-modal";
import { emitCartUpdate } from "@/components/cart-nav-button";

type Props = {
  product: Product;
  sizes?: string;
  priority?: boolean;
};

/**
 * Product Card: glossy white finish, crisp spec chips, savings badge,
 * and hover action triggers (Quick Preview + Quick Add to Cart).
 */
export function ProductCard({
  product,
  sizes = "(min-width: 80rem) 23vw, (min-width: 48rem) 31vw, 45vw",
  priority = false,
}: Props) {
  const [showPreview, setShowPreview] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addFeedback, setAddFeedback] = useState(false);

  const onSale = typeof product.compareAtPrice === "number";
  const [packshot] = product.images;
  if (!packshot) return null;

  // Extract quick tech specs if available from details
  const displaySpec = product.details.find(
    (d) => d.toLowerCase().includes("inch") || d.toLowerCase().includes("display")
  );
  const processorSpec = product.details.find(
    (d) =>
      d.toLowerCase().includes("core") ||
      d.toLowerCase().includes("ryzen") ||
      d.toLowerCase().includes("celeron") ||
      d.toLowerCase().includes("ghz")
  );
  const ramSpec = product.details.find(
    (d) =>
      d.toLowerCase().includes("ram") ||
      d.toLowerCase().includes("memory") ||
      d.toLowerCase().includes("gb")
  );

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock === "sold_out" || isAdding) return;

    try {
      setIsAdding(true);
      const formData = new FormData();
      formData.append("slug", product.slug);
      formData.append("quantity", "1");
      const res = await addToBag({ error: null }, formData);
      if (!res?.error) {
        emitCartUpdate();
        setAddFeedback(true);
        setTimeout(() => setAddFeedback(false), 2000);
      }
    } catch (err) {
      console.error("Failed to add to bag:", err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleOpenPreview = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPreview(true);
  };

  return (
    <>
      <article className="card-gloss group relative flex flex-col justify-between overflow-hidden p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="relative flex flex-col flex-1">
          {/* Packshot Image Frame with Hover Action Buttons */}
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-md bg-neutral-100">
            <Link href={`/products/${product.slug}`} className="block relative w-full h-full">
              <Image
                src={packshot.src}
                alt={packshot.alt}
                fill
                sizes={sizes}
                priority={priority}
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </Link>

            {/* Discount / Savings Ribbon */}
            {product.badge ? (
              <div className="absolute top-2 left-2 z-10 pointer-events-none">
                <span className="inline-block rounded-xs bg-[#e11d48] px-2 py-1 text-[10px] font-bold tracking-tight text-white shadow-xs">
                  {product.badge}
                </span>
              </div>
            ) : null}

            {/* Hover Action Triggers Bar (Slides Up Smoothly on Hover) */}
            <div className="absolute inset-x-2 bottom-2 z-20 flex items-center gap-1.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
              {/* Quick Preview Button */}
              <button
                type="button"
                onClick={handleOpenPreview}
                title="Quick preview"
                className="flex-1 flex items-center justify-center gap-1 rounded-md bg-white/95 px-2.5 py-2 text-[11px] font-bold text-neutral-900 shadow-md backdrop-blur-xs hover:bg-neutral-950 hover:text-white transition-all cursor-pointer"
              >
                <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>Preview</span>
              </button>

              {/* Quick Add To Cart Button */}
              <button
                type="button"
                onClick={handleQuickAdd}
                disabled={product.stock === "sold_out" || isAdding}
                title="Quick Add to Cart"
                className="flex items-center justify-center size-8 rounded-md bg-neutral-950 text-white shadow-md hover:bg-neutral-800 disabled:opacity-40 transition-all cursor-pointer shrink-0"
              >
                {isAdding ? (
                  <svg className="size-3.5 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : addFeedback ? (
                  <svg className="size-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Product Meta */}
          <Link href={`/products/${product.slug}`} className="mt-3 flex flex-1 flex-col justify-between block">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">
                {product.category}
              </p>
              <h3 className="mt-1 line-clamp-2 text-xs font-semibold leading-snug text-neutral-900 group-hover:text-black">
                {product.name}
              </h3>
            </div>

            {/* Pricing */}
            <div className="mt-3 flex items-baseline justify-between gap-1 border-t border-neutral-100 pt-2.5">
              <div className="flex flex-col" data-numeric>
                {onSale ? (
                  <div className="flex flex-wrap items-baseline gap-1.5">
                    <span className="text-xs font-bold text-neutral-900">
                      {currency.format(product.price)}
                    </span>
                    <span className="text-[11px] text-neutral-400 line-through">
                      {currency.format(product.compareAtPrice!)}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs font-bold text-neutral-900">
                    {currency.format(product.price)}
                  </span>
                )}
              </div>

              {/* Added Feedback Pill */}
              {addFeedback ? (
                <span className="text-[10px] font-bold text-emerald-600 animate-in fade-in">
                  Added!
                </span>
              ) : null}
            </div>

            {/* Micro Specs strip */}
            {displaySpec || processorSpec || ramSpec ? (
              <div className="mt-2.5 flex items-center gap-2 border-t border-neutral-100 pt-2 text-[10px] text-neutral-500">
                {displaySpec ? (
                  <div className="flex items-center gap-1 truncate" title={displaySpec}>
                    <svg className="size-3 text-neutral-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="truncate">
                      {displaySpec.split(" ")[0]} {displaySpec.split(" ")[1]}
                    </span>
                  </div>
                ) : null}
                {processorSpec ? (
                  <div className="flex items-center gap-1 truncate" title={processorSpec}>
                    <svg className="size-3 text-neutral-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                    <span className="truncate">
                      {processorSpec.includes("Core i")
                        ? processorSpec.substring(processorSpec.indexOf("Core i"), processorSpec.indexOf("Core i") + 7)
                        : "CPU"}
                    </span>
                  </div>
                ) : null}
              </div>
            ) : null}
          </Link>
        </div>
      </article>

      {/* Quick Preview Modal */}
      {showPreview ? (
        <QuickPreviewModal
          product={product}
          onClose={() => setShowPreview(false)}
          onAddToCart={async (slug) => {
            const formData = new FormData();
            formData.append("slug", slug);
            formData.append("quantity", "1");
            const res = await addToBag({ error: null }, formData);
            if (!res?.error) {
              emitCartUpdate();
            }
            setShowPreview(false);
          }}
          isAdding={isAdding}
        />
      ) : null}
    </>
  );
}
