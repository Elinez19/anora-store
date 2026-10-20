"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { type Bag } from "@/lib/cart-types";
import { ModernCartLineItem } from "@/components/modern-cart-line-item";
import { formatCents } from "@/lib/format";
import { addToBag } from "@/lib/cart-actions";
import { emitCartUpdate } from "@/components/cart-nav-button";

interface AddOnProduct {
  slug: string;
  name: string;
  priceFormatted: string;
  compareAtFormatted: string;
  image: string;
}

interface ModernCartViewProps {
  bag: Bag;
  addons: AddOnProduct[];
  freeShippingThreshold?: number;
}

export function ModernCartView({
  bag,
  addons,
  freeShippingThreshold = 5000000, // ₦50,000.00 in cents
}: ModernCartViewProps) {
  const [orderNote, setOrderNote] = useState("");
  const [shippingOpen, setShippingOpen] = useState(false);
  const [discountOpen, setDiscountOpen] = useState(false);
  const [destinationCountry, setDestinationCountry] = useState("Nigeria");
  const [destinationState, setDestinationState] = useState("Lagos");
  const [destinationZip, setDestinationZip] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [shippingEstimated, setShippingEstimated] = useState(false);

  const [addingSlug, setAddingSlug] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const handleAddOn = (slug: string) => {
    setAddingSlug(slug);
    startTransition(async () => {
      const formData = new FormData();
      formData.append("slug", slug);
      formData.append("quantity", "1");
      await addToBag({ error: null }, formData);
      emitCartUpdate();
      setAddingSlug(null);
    });
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    if (couponCode.trim().toUpperCase() === "SAVE10" || couponCode.trim().toUpperCase() === "ANORA10") {
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponError("Invalid discount code. Try 'SAVE10'");
    }
  };

  const handleEstimateShipping = (e: React.FormEvent) => {
    e.preventDefault();
    setShippingEstimated(true);
  };

  // 5% cashback store credit calculation
  const storeCreditCents = Math.round(bag.subtotalCents * 0.05);

  const isEligibleFreeShipping = bag.subtotalCents >= freeShippingThreshold || bag.subtotalCents > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      {/* Left Column: Cart Items + Estimate Shipping + Discount */}
      <div className="lg:col-span-8 space-y-8">
        <div className="bg-white">
          {bag.lines.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="mx-auto size-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-neutral-900">Your cart is empty</h2>
              <p className="text-sm text-neutral-500 max-w-sm mx-auto">
                Discover our newest laptops, premium workstations, and high performance computer accessories.
              </p>
              <Link
                href="/new-arrivals"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-neutral-900 text-white text-xs font-semibold tracking-wide hover:bg-black transition-colors"
              >
                Browse New Arrivals
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {bag.lines.map((line) => (
                <ModernCartLineItem key={line.productId} line={line} />
              ))}
            </div>
          )}
        </div>

        {/* Collapsible Estimate Shipping & Discount Accordions */}
        {bag.lines.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            {/* Estimate Shipping Accordion */}
            <div className="border border-neutral-200 rounded-lg p-4 bg-white">
              <button
                type="button"
                onClick={() => setShippingOpen(!shippingOpen)}
                className="w-full flex items-center justify-between text-left font-semibold text-sm text-neutral-900 cursor-pointer"
              >
                <span>Estimate shipping</span>
                <svg
                  className={`size-4 text-neutral-500 transition-transform ${shippingOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {shippingOpen && (
                <form onSubmit={handleEstimateShipping} className="mt-4 space-y-3 pt-3 border-t border-neutral-100">
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 mb-1">Country</label>
                    <select
                      value={destinationCountry}
                      onChange={(e) => setDestinationCountry(e.target.value)}
                      className="w-full text-xs border border-neutral-300 rounded px-3 py-2 bg-white text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-950"
                    >
                      <option value="Nigeria">Nigeria</option>
                      <option value="Ghana">Ghana</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United States">United States</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 mb-1">State / Region</label>
                    <input
                      type="text"
                      value={destinationState}
                      onChange={(e) => setDestinationState(e.target.value)}
                      className="w-full text-xs border border-neutral-300 rounded px-3 py-2 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-950"
                      placeholder="e.g. Lagos"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 mb-1">Postal / Zip code</label>
                    <input
                      type="text"
                      value={destinationZip}
                      onChange={(e) => setDestinationZip(e.target.value)}
                      className="w-full text-xs border border-neutral-300 rounded px-3 py-2 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-950"
                      placeholder="Optional"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 text-xs font-semibold text-neutral-900 border border-neutral-300 rounded hover:bg-neutral-50 transition-colors"
                  >
                    Calculate
                  </button>
                  {shippingEstimated && (
                    <div className="p-2 bg-emerald-50 rounded text-xs text-emerald-800">
                      Standard shipping to {destinationState}: <span className="font-bold">FREE</span> (Usually 1-3 business days)
                    </div>
                  )}
                </form>
              )}
            </div>

            {/* Discount Accordion */}
            <div className="border border-neutral-200 rounded-lg p-4 bg-white">
              <button
                type="button"
                onClick={() => setDiscountOpen(!discountOpen)}
                className="w-full flex items-center justify-between text-left font-semibold text-sm text-neutral-900 cursor-pointer"
              >
                <span>Discount</span>
                <svg
                  className={`size-4 text-neutral-500 transition-transform ${discountOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {discountOpen && (
                <form onSubmit={handleApplyCoupon} className="mt-4 space-y-3 pt-3 border-t border-neutral-100">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Discount code"
                      className="flex-1 text-xs border border-neutral-300 rounded px-3 py-2 text-neutral-900 uppercase focus:outline-none focus:ring-1 focus:ring-neutral-950"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded hover:bg-black transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-xs text-rose-600">{couponError}</p>}
                  {couponApplied && (
                    <p className="text-xs text-emerald-700 font-medium">
                      Coupon &apos;{couponCode.toUpperCase()}&apos; applied! Discount will appear in checkout.
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Order Summary & Checkout Card */}
      <div className="lg:col-span-4">
        <div className="sticky top-24 rounded-xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-xs space-y-6">
          {/* Free Shipping Progress Indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-neutral-700">
              <span className="flex items-center gap-1.5 text-neutral-900 font-semibold">
                <svg className="size-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                {isEligibleFreeShipping
                  ? "You are eligible for free shipping"
                  : `Add more items for free shipping`}
              </span>
            </div>
            <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-neutral-900 rounded-full transition-all duration-300"
                style={{ width: isEligibleFreeShipping ? "100%" : "60%" }}
              />
            </div>
          </div>

          {/* Subtotal */}
          <div className="space-y-1 pt-2 border-t border-neutral-100">
            <div className="flex items-baseline justify-between">
              <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold">Subtotal</span>
              <span className="text-2xl font-black text-neutral-900 tracking-tight">
                {formatCents(bag.subtotalCents)} NGN
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Taxes and shipping calculated at checkout
            </p>
          </div>

          {/* Cross-Sell Recommendations: Protect Your Device & Save 20% */}
          {addons.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-neutral-100">
              <p className="text-xs font-bold text-neutral-900 tracking-tight">
                Protect Your Device & Save 20%
              </p>
              <div className="space-y-2.5">
                {addons.map((item) => (
                  <div
                    key={item.slug}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-lg border border-neutral-100 bg-neutral-50/70"
                  >
                    <div className="relative size-12 shrink-0 rounded overflow-hidden border border-neutral-200 bg-white">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.slug}`}
                        className="text-xs font-semibold text-neutral-900 hover:underline line-clamp-1 block"
                      >
                        {item.name}
                      </Link>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs font-bold text-rose-600">{item.priceFormatted}</span>
                        <span className="text-[10px] text-neutral-400 line-through">
                          {item.compareAtFormatted}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddOn(item.slug)}
                      disabled={addingSlug === item.slug}
                      className="px-3 py-1 bg-neutral-900 hover:bg-black text-white text-xs font-semibold rounded shrink-0 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {addingSlug === item.slug ? "Adding…" : "+ Add"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order Note */}
          <div className="space-y-2 pt-2 border-t border-neutral-100">
            <label htmlFor="order-note" className="block text-xs font-semibold text-neutral-900">
              Add a note to your order
            </label>
            <textarea
              id="order-note"
              rows={3}
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              placeholder="Order note"
              className="w-full text-xs border border-neutral-200 rounded-lg p-2.5 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-950 resize-y"
            />
          </div>

          {/* Store Credit Alert Banner */}
          {bag.subtotalCents > 0 && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50/80 border border-amber-200/80 text-amber-900">
              <span className="size-6 rounded-full bg-amber-400/80 text-amber-900 flex items-center justify-center shrink-0 text-xs font-bold">
                ₦
              </span>
              <p className="text-xs leading-snug">
                You will get <span className="font-bold">{formatCents(storeCreditCents)}</span> store credit after this purchase.
              </p>
            </div>
          )}

          {/* Checkout CTA */}
          <div>
            <Link
              href={bag.lines.length === 0 ? "#" : "/checkout"}
              className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-lg text-xs font-bold tracking-wider uppercase transition-colors ${
                bag.lines.length === 0
                  ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                  : "bg-neutral-950 text-white hover:bg-black shadow-sm cursor-pointer"
              }`}
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Check out</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
