"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useActionState } from "react";
import { addToBag } from "@/lib/cart-actions";
import { emptyCartState } from "@/lib/cart-form-state";
import { currency } from "@/lib/format";
import { type Product } from "@/lib/products";
import { emitCartUpdate } from "@/components/cart-nav-button";

type ProductDetailsViewProps = {
  product: Product;
};

export function ProductDetailsView({ product }: ProductDetailsViewProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [includeAccessory, setIncludeAccessory] = useState(true);
  const [selectedPack, setSelectedPack] = useState<"single" | "pack5" | "pack10">("single");
  const [selectedStorage, setSelectedStorage] = useState("512GB SSD");
  const [selectedMemory, setSelectedMemory] = useState("16GB RAM");

  const [state, action, pending] = useActionState(async (prevState: any, formData: FormData) => {
    const res = await addToBag(prevState, formData);
    if (!res?.error) {
      emitCartUpdate();
    }
    return res;
  }, emptyCartState);

  const images = product.images.length > 0 ? product.images : [
    {
      src: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&q=80",
      alt: product.name,
    },
  ];

  const activeImage = images[activeImageIndex] || images[0];

  // Price calculations based on bundle
  const basePrice = product.price;
  const accessoryPrice = 27500; // Discounted bundle price (was ₦34,500.00)
  
  let currentTotal = basePrice;
  if (selectedPack === "pack5") {
    currentTotal = basePrice * 5 * 0.95; // 5% bulk discount
  } else if (selectedPack === "pack10") {
    currentTotal = basePrice * 10 * 0.90; // 10% bulk discount
  }

  if (includeAccessory && selectedPack === "single") {
    currentTotal += accessoryPrice;
  }

  // Parse product specs
  const displaySpec = product.details.find((d) => d.toLowerCase().includes("inch") || d.toLowerCase().includes("display")) || "14-inch Display";
  const processorSpec = product.details.find((d) => d.toLowerCase().includes("core") || d.toLowerCase().includes("ryzen") || d.toLowerCase().includes("celeron") || d.toLowerCase().includes("ghz")) || "Intel Core i5";
  const ramSpec = product.details.find((d) => d.toLowerCase().includes("ram") || d.toLowerCase().includes("memory")) || "16GB RAM";
  const storageSpec = product.details.find((d) => d.toLowerCase().includes("ssd") || d.toLowerCase().includes("storage") || d.toLowerCase().includes("emmc") || d.toLowerCase().includes("hdd")) || "512GB SSD";

  const soldOut = product.stock === "sold_out";

  return (
    <div className="container-page py-6 lg:py-10">
      {/* Top Grid: Left Gallery + Right Configuration Details */}
      <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
        {/* Left Column (Thumbnails + Main Image Canvas + Highlights) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex flex-col-reverse sm:flex-row gap-4 items-start">
            {/* Thumbnail Column with Scroll Control */}
            <div className="flex sm:flex-col items-center gap-1.5 w-full sm:w-20 shrink-0">
              {/* Scroll Up Control Button */}
              {images.length > 3 ? (
                <button
                  type="button"
                  aria-label="Previous thumbnail"
                  onClick={() => {
                    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
                  }}
                  className="hidden sm:flex size-7 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 shadow-xs hover:border-neutral-900 hover:text-black transition-colors"
                >
                  <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
              ) : null}

              {/* Scrollable Thumbnails Track */}
              <div
                id="thumbnail-track"
                className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto w-full sm:w-20 max-h-[460px] scrollbar-none py-1 scroll-smooth"
              >
                {images.map((img, idx) => (
                  <button
                    key={`${img.src}-${idx}`}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative size-16 sm:size-18 shrink-0 overflow-hidden rounded-md border-2 bg-neutral-100 transition-all ${
                      activeImageIndex === idx
                        ? "border-neutral-950 shadow-xs scale-102 ring-1 ring-neutral-950"
                        : "border-neutral-200 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={img.src} alt={img.alt} fill className="object-cover" />
                  </button>
                ))}
              </div>

              {/* Scroll Down Control Button (Matching Screenshot chevron) */}
              {images.length > 3 ? (
                <button
                  type="button"
                  aria-label="Next thumbnail"
                  onClick={() => {
                    setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
                  }}
                  className="flex size-7 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 shadow-xs hover:border-neutral-900 hover:text-black transition-colors"
                >
                  <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              ) : null}
            </div>

            {/* Large Main Packshot Canvas with Left/Right Navigation Controls */}
            <div className="group relative aspect-4/3 sm:aspect-square w-full overflow-hidden rounded-xl border border-neutral-200 bg-white p-3 shadow-xs">
              <Image
                src={activeImage.src}
                alt={activeImage.alt}
                fill
                priority
                className="object-cover rounded-lg transition-all duration-300"
              />

              {/* Left Carousel Arrow */}
              {images.length > 1 ? (
                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 flex size-9 items-center justify-center rounded-full bg-white/90 text-neutral-800 shadow-md backdrop-blur-xs opacity-0 group-hover:opacity-100 hover:bg-white hover:scale-105 transition-all"
                >
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              ) : null}

              {/* Right Carousel Arrow */}
              {images.length > 1 ? (
                <button
                  type="button"
                  aria-label="Next image"
                  onClick={() => setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex size-9 items-center justify-center rounded-full bg-white/90 text-neutral-800 shadow-md backdrop-blur-xs opacity-0 group-hover:opacity-100 hover:bg-white hover:scale-105 transition-all"
                >
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : null}

              {/* Counter Pill */}
              <div className="absolute bottom-4 right-4 rounded-full bg-neutral-900/70 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-xs">
                {activeImageIndex + 1} / {images.length}
              </div>
            </div>
          </div>

          {/* Product Highlights Bar (Matching Screenshot) */}
          <div className="mt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 mb-3">
              Product highlights
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Display */}
              <div className="flex items-center gap-2.5 rounded-lg border border-neutral-200 bg-neutral-50/80 p-2.5">
                <svg className="size-5 text-neutral-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div className="leading-tight truncate">
                  <p className="text-[11px] font-bold text-neutral-900 truncate">
                    {displaySpec.split(" ")[0]} {displaySpec.split(" ")[1]}
                  </p>
                  <p className="text-[10px] text-neutral-500">Display</p>
                </div>
              </div>

              {/* Processor */}
              <div className="flex items-center gap-2.5 rounded-lg border border-neutral-200 bg-neutral-50/80 p-2.5">
                <svg className="size-5 text-neutral-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
                <div className="leading-tight truncate">
                  <p className="text-[11px] font-bold text-neutral-900 truncate">
                    {processorSpec.includes("Core") ? processorSpec.substring(processorSpec.indexOf("Core"), processorSpec.indexOf("Core") + 7) : "Quad-Core"}
                  </p>
                  <p className="text-[10px] text-neutral-500">Processor</p>
                </div>
              </div>

              {/* RAM */}
              <div className="flex items-center gap-2.5 rounded-lg border border-neutral-200 bg-neutral-50/80 p-2.5">
                <svg className="size-5 text-neutral-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                <div className="leading-tight truncate">
                  <p className="text-[11px] font-bold text-neutral-900 truncate">
                    {ramSpec.split(" ")[0]}
                  </p>
                  <p className="text-[10px] text-neutral-500">RAM</p>
                </div>
              </div>

              {/* Storage */}
              <div className="flex items-center gap-2.5 rounded-lg border border-neutral-200 bg-neutral-50/80 p-2.5">
                <svg className="size-5 text-neutral-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 7v10c0 2 1.5 3 3.5 3h9c2 0 3.5-1 3.5-3V7c0-2-1.5-3-3.5-3h-9C5.5 4 4 5 4 7zM9 8h6M9 12h6" />
                </svg>
                <div className="leading-tight truncate">
                  <p className="text-[11px] font-bold text-neutral-900 truncate">
                    {storageSpec.split(" ")[0]} {storageSpec.split(" ")[1] || "SSD"}
                  </p>
                  <p className="text-[10px] text-neutral-500">Storage</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Product Information & Configuration Flow) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Header Title & Pricing */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 leading-tight">
                {product.name}
              </h1>
              <span className="text-lg sm:text-xl font-bold text-neutral-950 shrink-0" data-numeric>
                {currency.format(product.price)}
              </span>
            </div>
            <p className="mt-2 text-xs text-neutral-600 leading-normal">
              {product.description}
            </p>
          </div>

          {/* Condition & Stock Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-700">
              <svg className="size-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Certified Grade-A / Pre-Owned
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              In stock, ready to ship
            </span>
          </div>

          {/* Configure Your Device Section */}
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4 space-y-3">
            <div>
              <h3 className="text-xs font-bold text-neutral-900">Configure Your Device</h3>
              <p className="text-[11px] text-neutral-500">
                Choose the memory and storage setup that fits your workflow.
              </p>
            </div>

            {/* Storage Options Dropdown */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                Storage Options
              </label>
              <select
                value={selectedStorage}
                onChange={(e) => setSelectedStorage(e.target.value)}
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-900 focus:border-neutral-900 focus:outline-none"
              >
                <option value="256GB SSD">256GB High-Speed PCIe NVMe SSD</option>
                <option value="512GB SSD">512GB High-Speed PCIe NVMe SSD (Standard)</option>
                <option value="1TB SSD">1TB Ultra-Fast PCIe NVMe SSD (+₦45,000)</option>
              </select>
            </div>

            {/* Memory Options Dropdown */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                Memory Options
              </label>
              <select
                value={selectedMemory}
                onChange={(e) => setSelectedMemory(e.target.value)}
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-900 focus:border-neutral-900 focus:outline-none"
              >
                <option value="8GB RAM">8GB High-Speed Memory</option>
                <option value="16GB RAM">16GB Dual-Channel RAM (Recommended)</option>
                <option value="32GB RAM">32GB High-Performance RAM (+₦60,000)</option>
              </select>
            </div>
          </div>

          {/* Protect Your Device & Save 20% Bundle Card */}
          <div className="rounded-xl border border-neutral-200 bg-white p-3.5 shadow-xs">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-bold text-neutral-900">
                Protect Your Device &amp; Save 20%
              </span>
              <div className="flex items-center gap-1 text-neutral-400">
                <span className="text-[10px]">&larr;</span>
                <span className="text-[10px]">&rarr;</span>
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={includeAccessory}
                onChange={(e) => setIncludeAccessory(e.target.checked)}
                className="size-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
              />
              <div className="relative size-12 shrink-0 rounded-md border border-neutral-200 bg-neutral-50 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80"
                  alt="AeroGuard Pro Backpack"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-neutral-900 truncate">
                  AeroGuard Pro 16 Premium Water-Resistant Laptop Backpack
                </p>
                <div className="flex items-baseline gap-1.5 text-xs" data-numeric>
                  <span className="font-bold text-rose-600">₦27,600.00</span>
                  <span className="text-[11px] text-neutral-400 line-through">₦34,500.00</span>
                </div>
              </div>
            </label>
          </div>

          {/* Buy More & Save More (Volume Packs) */}
          <div>
            <h3 className="text-xs font-bold text-neutral-900 mb-2">Buy More &amp; Save More</h3>
            <div className="grid grid-cols-3 gap-2">
              {/* Single Unit */}
              <button
                type="button"
                onClick={() => setSelectedPack("single")}
                className={`flex flex-col items-center justify-center rounded-lg border p-2.5 text-center transition-all ${
                  selectedPack === "single"
                    ? "border-neutral-900 bg-neutral-50 shadow-xs"
                    : "border-neutral-200 bg-white hover:border-neutral-300"
                }`}
              >
                <div className="size-3.5 rounded-full border border-neutral-400 flex items-center justify-center mb-1">
                  {selectedPack === "single" ? <span className="size-2 rounded-full bg-neutral-900"></span> : null}
                </div>
                <span className="text-[11px] font-bold text-neutral-900">Single Unit</span>
                <span className="text-[10px] text-neutral-500">Standard Price</span>
                <span className="mt-1 text-xs font-bold text-neutral-900" data-numeric>
                  {currency.format(basePrice)}
                </span>
              </button>

              {/* Value Pack (5 Units) */}
              <button
                type="button"
                onClick={() => setSelectedPack("pack5")}
                className={`flex flex-col items-center justify-center rounded-lg border p-2.5 text-center transition-all ${
                  selectedPack === "pack5"
                    ? "border-neutral-900 bg-neutral-50 shadow-xs"
                    : "border-neutral-200 bg-white hover:border-neutral-300"
                }`}
              >
                <div className="size-3.5 rounded-full border border-neutral-400 flex items-center justify-center mb-1">
                  {selectedPack === "pack5" ? <span className="size-2 rounded-full bg-neutral-900"></span> : null}
                </div>
                <span className="text-[11px] font-bold text-neutral-900">Value Pack (5)</span>
                <span className="text-[10px] text-rose-600 font-semibold">Save 5% Bulk</span>
                <span className="mt-1 text-xs font-bold text-neutral-900" data-numeric>
                  {currency.format(basePrice * 5 * 0.95)}
                </span>
              </button>

              {/* Business Pack (10 Units) */}
              <button
                type="button"
                onClick={() => setSelectedPack("pack10")}
                className={`flex flex-col items-center justify-center rounded-lg border p-2.5 text-center transition-all ${
                  selectedPack === "pack10"
                    ? "border-neutral-900 bg-neutral-50 shadow-xs"
                    : "border-neutral-200 bg-white hover:border-neutral-300"
                }`}
              >
                <div className="size-3.5 rounded-full border border-neutral-400 flex items-center justify-center mb-1">
                  {selectedPack === "pack10" ? <span className="size-2 rounded-full bg-neutral-900"></span> : null}
                </div>
                <span className="text-[11px] font-bold text-neutral-900">Business (10)</span>
                <span className="text-[10px] text-rose-600 font-semibold">Save 10% Bulk</span>
                <span className="mt-1 text-xs font-bold text-neutral-900" data-numeric>
                  {currency.format(basePrice * 10 * 0.90)}
                </span>
              </button>
            </div>
          </div>

          {/* Action Buttons: Add to Bag & Buy It Now */}
          <div className="flex flex-col gap-2.5 pt-2">
            <form action={action} className="w-full">
              <input type="hidden" name="slug" value={product.slug} />
              <input type="hidden" name="quantity" value={selectedPack === "pack5" ? "5" : selectedPack === "pack10" ? "10" : "1"} />
              <button
                type="submit"
                disabled={soldOut || pending}
                className="w-full rounded-md bg-neutral-950 py-3 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-neutral-800 disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
              >
                <span>{soldOut ? "Sold Out" : pending ? "Adding to Cart…" : `Add to cart - ${currency.format(currentTotal)}`}</span>
              </button>
            </form>

            <Link
              href="/bag"
              className="w-full rounded-md border border-neutral-300 bg-white py-3 text-center text-xs sm:text-sm font-bold text-neutral-900 shadow-xs hover:bg-neutral-50 transition-colors"
            >
              Buy it now
            </Link>
          </div>

          {/* Store Pickup Availability Banner */}
          <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50/60 p-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500"></span>
              <span className="text-neutral-700">
                Pickup available at <strong>Maryland Hub</strong> (Ready in 24h)
              </span>
            </div>
            <a href="#" className="text-[11px] font-semibold text-neutral-500 hover:text-neutral-900 underline">
              View store info
            </a>
          </div>

          {/* Share Strip */}
          <div className="flex items-center justify-between text-xs text-neutral-500 border-t border-neutral-100 pt-3">
            <div className="flex items-center gap-3">
              <span>Share:</span>
              <a href="#" className="hover:text-black">Facebook</a>
              <a href="#" className="hover:text-black">X</a>
              <a href="#" className="hover:text-black">WhatsApp</a>
            </div>
            <a href="#" className="hover:text-black flex items-center gap-1">
              <span>?</span> Need help?
            </a>
          </div>

          {/* Shipping & Warranty Perks Card */}
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-3.5 space-y-2.5 text-xs text-neutral-700">
            <div className="flex items-center gap-2.5">
              <svg className="size-4.5 text-neutral-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <span>In stock! Ships within 1–2 business days.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <svg className="size-4.5 text-neutral-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Complimentary shipping &amp; 7-day returns</span>
            </div>
            <div className="flex items-center gap-2.5">
              <svg className="size-4.5 text-neutral-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>128 Days Certified Hardware Warranty</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hardware Specifications Full Table */}
      <div className="mt-16 border-t border-neutral-200 pt-10">
        <h2 className="text-xl font-bold text-neutral-950 mb-6">
          Detailed Specifications &amp; Features
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {product.details.map((detail) => (
            <div key={detail} className="flex items-start gap-2.5 rounded-lg border border-neutral-200 bg-white p-3.5 shadow-xs">
              <span className="size-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                ✓
              </span>
              <span className="text-xs font-medium text-neutral-800 leading-relaxed">
                {detail}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
