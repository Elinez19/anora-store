"use client";

import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { type BagLine } from "@/lib/cart-types";
import { removeFromBag, updateBagQuantity } from "@/lib/cart-actions";
import { formatCents } from "@/lib/format";
import { emitCartUpdate } from "@/components/cart-nav-button";

interface CartLineProps {
  line: BagLine;
}

export function ModernCartLineItem({ line }: CartLineProps) {
  const [isPending, startTransition] = useTransition();

  const handleQuantity = (newQty: number) => {
    if (newQty < 1) return;
    startTransition(async () => {
      const formData = new FormData();
      formData.append("productId", line.productId);
      formData.append("quantity", String(newQty));
      await updateBagQuantity({ error: null }, formData);
      emitCartUpdate();
    });
  };

  const handleRemove = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("productId", line.productId);
      await removeFromBag({ error: null }, formData);
      emitCartUpdate();
    });
  };

  const isFree = line.lineTotalCents === 0;

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 border-b border-neutral-100 transition-opacity ${isPending ? "opacity-50" : "opacity-100"}`}>
      {/* Product Image + Details */}
      <div className="flex items-start gap-4">
        <div className="relative size-20 sm:size-24 shrink-0 rounded-lg overflow-hidden border border-neutral-100 bg-neutral-50 flex items-center justify-center">
          {line.image ? (
            <Image
              src={line.image.src}
              alt={line.image.alt || line.name}
              fill
              sizes="(min-width: 640px) 96px, 80px"
              className="object-cover"
            />
          ) : (
            <div className="text-neutral-300 text-xs font-mono">NO IMG</div>
          )}
        </div>

        <div className="space-y-1 max-w-sm">
          <Link
            href={`/products/${line.slug}`}
            className="text-sm font-semibold text-neutral-900 hover:text-black line-clamp-2 transition-colors"
          >
            {line.name}
          </Link>
          {line.colour && (
            <p className="text-xs text-neutral-500">{line.colour}</p>
          )}
          {line.availableQuantity !== null && line.availableQuantity < 5 && (
            <p className="text-[11px] font-medium text-amber-600">
              Only {line.availableQuantity} left in stock
            </p>
          )}
        </div>
      </div>

      {/* Stepper + Price */}
      <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-10 pl-24 sm:pl-0">
        {/* Quantity Stepper */}
        <div className="flex items-center border border-neutral-200 rounded-md bg-white">
          <button
            type="button"
            onClick={() => handleQuantity(line.quantity - 1)}
            disabled={line.quantity <= 1 || isPending}
            className="px-2.5 py-1 text-sm font-medium text-neutral-600 hover:text-neutral-950 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-8 text-center text-xs font-semibold text-neutral-900 select-none">
            {line.quantity}
          </span>
          <button
            type="button"
            onClick={() => handleQuantity(line.quantity + 1)}
            disabled={
              isPending ||
              (line.availableQuantity !== null &&
                line.quantity >= line.availableQuantity)
            }
            className="px-2.5 py-1 text-sm font-medium text-neutral-600 hover:text-neutral-950 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        {/* Remove Link */}
        <button
          type="button"
          onClick={handleRemove}
          disabled={isPending}
          className="text-xs font-medium text-neutral-500 hover:text-rose-600 underline underline-offset-2 transition-colors cursor-pointer"
        >
          Remove
        </button>

        {/* Price display */}
        <div className="text-right min-w-[5rem]">
          {isFree ? (
            <span className="text-sm font-bold text-emerald-600">FREE</span>
          ) : (
            <span className="text-sm font-bold text-neutral-900">
              {formatCents(line.lineTotalCents)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
