"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveProductAction } from "@/lib/admin-actions";

interface CategoryOption {
  id: string;
  name: string;
}

interface ImageInput {
  url: string;
  alt: string;
}

interface ProductFormProps {
  categories: CategoryOption[];
  initialData?: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    categoryId: string;
    colour: string;
    price: number;
    compareAtPrice?: number | null;
    badge?: string | null;
    description: string;
    details: string[];
    care: string;
    stockQuantity: number;
    madeToOrder: boolean;
    stockDetail?: string | null;
    images: Array<{ url: string; alt: string }>;
  };
}

export function ProductForm({ categories, initialData }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [sku, setSku] = useState(initialData?.sku || "");
  const [categoryId, setCategoryId] = useState(
    initialData?.categoryId || categories[0]?.id || "",
  );
  const [colour, setColour] = useState(initialData?.colour || "Space Gray");
  const [price, setPrice] = useState<string>(
    initialData?.price ? initialData.price.toString() : "",
  );
  const [compareAtPrice, setCompareAtPrice] = useState<string>(
    initialData?.compareAtPrice ? initialData.compareAtPrice.toString() : "",
  );
  const [badge, setBadge] = useState(initialData?.badge || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [detailsText, setDetailsText] = useState(
    initialData?.details ? initialData.details.join("\n") : "",
  );
  const [care, setCare] = useState(
    initialData?.care || "Clean with a soft, dry microfiber cloth. Avoid liquids.",
  );
  const [stockQuantity, setStockQuantity] = useState(
    initialData?.stockQuantity ?? 10,
  );
  const [madeToOrder, setMadeToOrder] = useState(
    initialData?.madeToOrder || false,
  );
  const [stockDetail, setStockDetail] = useState(
    initialData?.stockDetail || "In stock and ready to ship",
  );

  // Images state
  const [images, setImages] = useState<ImageInput[]>(
    initialData?.images && initialData.images.length > 0
      ? initialData.images
      : [
          {
            url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
            alt: "Packshot perspective view",
          },
        ],
  );

  function autoGenerateSlug(title: string) {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function handleNameChange(val: string) {
    setName(val);
    if (!initialData) {
      setSlug(autoGenerateSlug(val));
    }
  }

  function handleAddImage() {
    setImages([...images, { url: "", alt: `${name} view` }]);
  }

  function handleRemoveImage(index: number) {
    if (images.length <= 1) {
      alert("At least one product image is required.");
      return;
    }
    setImages(images.filter((_, idx) => idx !== index));
  }

  function handleImageChange(index: number, field: "url" | "alt", val: string) {
    const updated = [...images];
    updated[index][field] = val;
    setImages(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const validImages = images.filter((img) => img.url.trim().length > 0);
    if (validImages.length === 0) {
      setError("Please provide at least one valid image URL.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    if (initialData?.id) formData.set("id", initialData.id);
    formData.set("name", name);
    formData.set("slug", slug);
    formData.set("sku", sku);
    formData.set("categoryId", categoryId);
    formData.set("colour", colour);
    formData.set("price", price);
    if (compareAtPrice) formData.set("compareAtPrice", compareAtPrice);
    if (badge) formData.set("badge", badge);
    formData.set("description", description);
    formData.set("details", detailsText);
    formData.set("care", care);
    formData.set("stockQuantity", stockQuantity.toString());
    formData.set("madeToOrder", madeToOrder ? "true" : "false");
    if (stockDetail) formData.set("stockDetail", stockDetail);
    formData.set("images", JSON.stringify(validImages));

    const result = await saveProductAction(formData);

    if (result.success) {
      router.push("/admin/products");
      router.refresh();
    } else {
      setError(result.error || "An error occurred while saving the product.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-medium">
          {error}
        </div>
      )}

      {/* SECTION 1: Identity & Categorization */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-zinc-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.9)] space-y-6">
        <h2 className="text-lg font-bold text-zinc-950 font-sans tracking-tight">
          Product Identity & Category
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-mono uppercase text-zinc-600 mb-2">
              Product Title *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. MacBook Pro M4 Max 16-inch"
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-950 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-600 mb-2">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase())}
              placeholder="e.g. macbook-pro-m4-max-16"
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-950 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-zinc-950 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-600 mb-2">
              SKU (Stock Keeping Unit) *
            </label>
            <input
              type="text"
              required
              value={sku}
              onChange={(e) => setSku(e.target.value.toUpperCase())}
              placeholder="e.g. LAP-MBP-16-M4MAX"
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-950 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-zinc-950 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-600 mb-2">
              Category *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-950 transition"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-600 mb-2">
              Colour / Finish *
            </label>
            <input
              type="text"
              required
              value={colour}
              onChange={(e) => setColour(e.target.value)}
              placeholder="e.g. Space Black, Silver, Titanium"
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-950 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-600 mb-2">
              Badge / Ribbon Text (Optional)
            </label>
            <input
              type="text"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="e.g. New Release, M4 Max, Best Seller"
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-950 transition"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: Pricing & Inventory */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-zinc-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.9)] space-y-6">
        <h2 className="text-lg font-bold text-zinc-950 font-sans tracking-tight">
          Pricing & Inventory
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-xs font-mono uppercase text-zinc-600 mb-2">
              Price ($ USD) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="2499.00"
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-950 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-zinc-950 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-600 mb-2">
              Compare at Price ($ USD)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={compareAtPrice}
              onChange={(e) => setCompareAtPrice(e.target.value)}
              placeholder="2699.00"
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-950 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-zinc-950 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-600 mb-2">
              Stock Quantity (Units)
            </label>
            <input
              type="number"
              min="0"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-950 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-zinc-950 transition"
            />
          </div>

          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-3 cursor-pointer py-2.5">
              <input
                type="checkbox"
                checked={madeToOrder}
                onChange={(e) => setMadeToOrder(e.target.checked)}
                className="w-4 h-4 rounded text-zinc-950 focus:ring-0 border-zinc-300"
              />
              <span className="text-xs font-medium text-zinc-800">
                Made to order / Custom build
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-zinc-600 mb-2">
            Stock / Delivery Notice Line
          </label>
          <input
            type="text"
            value={stockDetail}
            onChange={(e) => setStockDetail(e.target.value)}
            placeholder="e.g. In stock, dispatched in 24 hours"
            className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-950 transition"
          />
        </div>
      </div>

      {/* SECTION 3: Description & Technical Specs */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-zinc-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.9)] space-y-6">
        <h2 className="text-lg font-bold text-zinc-950 font-sans tracking-tight">
          Editorial Copy & Technical Specs
        </h2>

        <div>
          <label className="block text-xs font-mono uppercase text-zinc-600 mb-2">
            Overview Description *
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Comprehensive description of the product, design principles, and performance highlights..."
            className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-950 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-zinc-600 mb-2">
            Specifications & Feature Highlights (One bullet per line)
          </label>
          <textarea
            rows={5}
            value={detailsText}
            onChange={(e) => setDetailsText(e.target.value)}
            placeholder="Apple M4 Max with 16-core CPU&#10;40-core GPU, 16-core Neural Engine&#10;64GB unified memory&#10;1TB ultra-fast NVMe SSD"
            className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-950 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-zinc-950 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-zinc-600 mb-2">
            Care & Maintenance Instructions
          </label>
          <input
            type="text"
            value={care}
            onChange={(e) => setCare(e.target.value)}
            placeholder="Clean with lint-free microfiber cloth. Avoid aerosols."
            className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-950 transition"
          />
        </div>
      </div>

      {/* SECTION 4: Multi-Image Gallery Manager */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-zinc-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.9)] space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-zinc-950 font-sans tracking-tight">
              Product Images Gallery
            </h2>
            <p className="text-xs text-zinc-500">
              The first frame (Position 0) serves as the primary packshot on the storefront.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddImage}
            className="px-4 py-2 rounded-xl bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800 transition-all shadow-sm active:scale-[0.98]"
          >
            + Add Perspective Image
          </button>
        </div>

        <div className="space-y-4">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-4 rounded-xl bg-zinc-50 border border-zinc-200"
            >
              <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-zinc-200 font-mono text-xs font-bold text-zinc-700 flex-shrink-0">
                #{idx}
                <span className="text-[9px] font-normal text-zinc-500">
                  {idx === 0 ? "Packshot" : `Frame ${idx}`}
                </span>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    required
                    value={img.url}
                    onChange={(e) =>
                      handleImageChange(idx, "url", e.target.value)
                    }
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs font-mono text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-950"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1">
                    Alt Text
                  </label>
                  <input
                    type="text"
                    required
                    value={img.alt}
                    onChange={(e) =>
                      handleImageChange(idx, "alt", e.target.value)
                    }
                    placeholder="e.g. Front angled perspective in Space Black"
                    className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-950"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="p-2 text-zinc-400 hover:text-rose-600 rounded-lg transition"
                title="Remove image"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-xl bg-white border border-zinc-200/90 text-zinc-800 text-sm font-semibold hover:bg-zinc-950 hover:text-white hover:border-zinc-950 transition-all shadow-sm active:scale-[0.98]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-2.5 rounded-xl bg-zinc-950 text-white text-sm font-semibold hover:bg-zinc-800 transition-all disabled:opacity-50 shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_22px_rgba(0,0,0,0.22)] active:scale-[0.98] border border-black/10"
        >
          {loading ? "Saving Product..." : initialData ? "Save Changes" : "Create Product"}
        </button>
      </div>
    </form>
  );
}
