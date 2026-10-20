"use client";

import { useState } from "react";
import { ProductCard } from "@/components/product-card";
import { type Product } from "@/lib/products";

type CategoryFilterTabsProps = {
  products: Product[];
  categories: { slug: string; name: string }[];
};

export function CategoryFilterTabs({
  products,
  categories,
}: CategoryFilterTabsProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filtered =
    activeCategory === "all"
      ? products
      : products.filter(
          (p) =>
            p.categorySlug === activeCategory ||
            p.category.toLowerCase().includes(activeCategory.toLowerCase()),
        );

  return (
    <div className="stack">
      {/* Category Pills Matching Reference UI */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveCategory("all")}
          className={`rounded-md px-3.5 py-1.5 text-xs font-semibold tracking-tight transition-all duration-200 ${
            activeCategory === "all"
              ? "bg-neutral-900 text-white shadow-xs"
              : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300 hover:text-black"
          }`}
        >
          All Tech
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            type="button"
            onClick={() => setActiveCategory(cat.slug)}
            className={`rounded-md px-3.5 py-1.5 text-xs font-semibold tracking-tight transition-all duration-200 ${
              activeCategory === cat.slug
                ? "bg-neutral-900 text-white shadow-xs"
                : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300 hover:text-black"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 mt-2">
        {filtered.slice(0, 8).map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
