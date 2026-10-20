"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { currency } from "@/lib/format";
import { type Product } from "@/lib/products";

type QuickPreviewModalProps = {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (slug: string) => void;
  isAdding: boolean;
};

export function QuickPreviewModal({
  product,
  onClose,
  onAddToCart,
  isAdding,
}: QuickPreviewModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!product) return null;

  const images = product.images.length > 0 ? product.images : [
    { src: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80", alt: product.name }
  ];

  const activeImage = images[activeImageIndex] || images[0];
  const onSale = typeof product.compareAtPrice === "number";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all border border-neutral-100">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          className="absolute right-4 top-4 z-20 flex size-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-black transition-colors"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid gap-6 sm:grid-cols-2 items-start">
          {/* Left: Gallery in Modal */}
          <div className="space-y-3">
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-neutral-100 border border-neutral-200">
              <Image
                src={activeImage.src}
                alt={activeImage.alt}
                fill
                className="object-cover"
              />
              {product.badge ? (
                <span className="absolute top-3 left-3 rounded-xs bg-rose-600 px-2 py-1 text-[10px] font-bold text-white shadow-xs">
                  {product.badge}
                </span>
              ) : null}
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 ? (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={img.src}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative size-14 shrink-0 overflow-hidden rounded-md border-2 bg-neutral-100 transition-all ${
                      activeImageIndex === idx
                        ? "border-neutral-950 scale-102"
                        : "border-neutral-200 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={img.src} alt={img.alt} fill className="object-cover" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {/* Right: Info, Specs & Actions */}
          <div className="flex flex-col justify-between h-full space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                {product.category}
              </span>
              <h2 className="mt-1 text-lg font-bold text-neutral-950 leading-snug">
                {product.name}
              </h2>

              {/* Price */}
              <div className="mt-3 flex items-baseline gap-2" data-numeric>
                <span className="text-xl font-black text-neutral-950">
                  {currency.format(product.price)}
                </span>
                {onSale ? (
                  <span className="text-xs text-neutral-400 line-through">
                    {currency.format(product.compareAtPrice!)}
                  </span>
                ) : null}
              </div>

              <p className="mt-3 text-xs text-neutral-600 line-clamp-3 leading-relaxed">
                {product.description}
              </p>

              {/* Specs Chips */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {product.details.slice(0, 4).map((d) => (
                  <span
                    key={d}
                    className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 text-[10px] font-medium text-neutral-700"
                  >
                    ✓ {d}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-4 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => onAddToCart(product.slug)}
                disabled={product.stock === "sold_out" || isAdding}
                className="w-full rounded-md bg-neutral-950 py-3 text-xs font-bold text-white shadow-xs hover:bg-neutral-800 disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
              >
                <span>
                  {product.stock === "sold_out"
                    ? "Sold out"
                    : isAdding
                    ? "Adding to cart…"
                    : `Add to cart - ${currency.format(product.price)}`}
                </span>
              </button>

              <Link
                href={`/products/${product.slug}`}
                className="block w-full rounded-md border border-neutral-200 bg-white py-2.5 text-center text-xs font-bold text-neutral-800 hover:bg-neutral-50 transition-colors"
              >
                View full specifications page &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
