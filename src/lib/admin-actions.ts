"use server";

import { revalidatePath } from "next/cache";
import { eq, inArray } from "drizzle-orm";

import { db } from "@/db";
import {
  categories,
  orders,
  productImages,
  products,
  user,
} from "@/db/schema";
import { requireAdmin } from "@/lib/admin";

export type ActionResponse = {
  success?: boolean;
  error?: string | null;
  data?: unknown;
};

/**
 * Update stock level directly from quick-edit or products list.
 */
export async function updateStockAction(
  productId: string,
  stockQuantity: number,
  madeToOrder: boolean,
  stockDetail?: string | null,
): Promise<ActionResponse> {
  await requireAdmin();

  if (!productId) return { error: "Product ID is required." };
  if (stockQuantity < 0) return { error: "Stock quantity cannot be negative." };

  try {
    await db
      .update(products)
      .set({
        stockQuantity,
        madeToOrder,
        stockDetail: stockDetail?.trim() || null,
      })
      .where(eq(products.id, productId));

    revalidatePath("/admin");
    revalidatePath("/admin/products");
    revalidatePath("/products/[slug]", "page");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to update stock", error);
    return { error: "Database error while updating stock." };
  }
}

/**
 * Upsert Product (Create or Update)
 */
export async function saveProductAction(
  formData: FormData,
): Promise<ActionResponse> {
  await requireAdmin();

  const id = formData.get("id") as string | null;
  const name = (formData.get("name") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim().toLowerCase();
  const sku = (formData.get("sku") as string)?.trim();
  const categoryId = formData.get("categoryId") as string;
  const colour = (formData.get("colour") as string)?.trim() || "Default";
  const priceDollars = parseFloat(formData.get("price") as string);
  const compareAtDollars = formData.get("compareAtPrice")
    ? parseFloat(formData.get("compareAtPrice") as string)
    : null;
  const badge = (formData.get("badge") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim();
  const detailsRaw = (formData.get("details") as string)?.trim();
  const care = (formData.get("care") as string)?.trim() || "Clean with microfiber cloth.";
  const stockQuantity = parseInt(formData.get("stockQuantity") as string, 10) || 0;
  const madeToOrder = formData.get("madeToOrder") === "true";
  const stockDetail = (formData.get("stockDetail") as string)?.trim() || null;
  const imagesJson = formData.get("images") as string;

  if (!name || !slug || !sku || !categoryId || isNaN(priceDollars) || !description) {
    return { error: "Please fill out all required fields." };
  }

  const priceCents = Math.round(priceDollars * 100);
  const compareAtCents =
    compareAtDollars && !isNaN(compareAtDollars)
      ? Math.round(compareAtDollars * 100)
      : null;

  // Split details into string array
  const details = detailsRaw
    ? detailsRaw
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
    : [];

  let parsedImages: Array<{ url: string; alt: string }> = [];
  try {
    if (imagesJson) {
      parsedImages = JSON.parse(imagesJson);
    }
  } catch (e) {
    console.error("Failed to parse images JSON", e);
  }

  try {
    const productId = id || crypto.randomUUID();

    if (id) {
      // Update existing product
      await db
        .update(products)
        .set({
          name,
          slug,
          sku,
          categoryId,
          colour,
          priceCents,
          compareAtCents,
          badge,
          description,
          details,
          care,
          stockQuantity,
          madeToOrder,
          stockDetail,
        })
        .where(eq(products.id, id));

      // Replace images if provided
      if (parsedImages.length > 0) {
        await db.delete(productImages).where(eq(productImages.productId, id));
        const imageRows = parsedImages.map((img, idx) => ({
          productId: id,
          url: img.url,
          alt: img.alt || name,
          position: idx,
        }));
        await db.insert(productImages).values(imageRows);
      }
    } else {
      // Insert new product
      await db.insert(products).values({
        id: productId,
        name,
        slug,
        sku,
        categoryId,
        colour,
        priceCents,
        compareAtCents,
        badge,
        description,
        details,
        care,
        stockQuantity,
        madeToOrder,
        stockDetail,
      });

      if (parsedImages.length > 0) {
        const imageRows = parsedImages.map((img, idx) => ({
          productId,
          url: img.url,
          alt: img.alt || name,
          position: idx,
        }));
        await db.insert(productImages).values(imageRows);
      }
    }

    revalidatePath("/admin");
    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/products/[slug]", "page");
    revalidatePath("/collections/[slug]", "page");

    return { success: true, data: { productId } };
  } catch (error: unknown) {
    console.error("Failed to save product", error);
    const err = error as { code?: string; message?: string } | undefined;
    if (err?.code === "23505") {
      return { error: "A product with this slug or SKU already exists." };
    }
    return { error: err?.message || "Failed to save product." };
  }
}

/**
 * Delete a product
 */
export async function deleteProductAction(
  productId: string,
): Promise<ActionResponse> {
  await requireAdmin();

  if (!productId) return { error: "Product ID is required." };

  try {
    await db.delete(products).where(eq(products.id, productId));
    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete product", error);
    return { error: "Failed to delete product. It may be referenced in existing carts." };
  }
}

/**
 * Bulk delete products
 */
export async function deleteProductsAction(
  productIds: string[],
): Promise<ActionResponse> {
  await requireAdmin();

  if (!productIds || productIds.length === 0) {
    return { error: "No products selected." };
  }

  try {
    await db.delete(products).where(inArray(products.id, productIds));
    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete products", error);
    return {
      error:
        "Failed to delete selected products. Some items may be referenced in existing records.",
    };
  }
}

/**
 * Save Category (Create or Update)
 */
export async function saveCategoryAction(
  formData: FormData,
): Promise<ActionResponse> {
  await requireAdmin();

  const id = formData.get("id") as string | null;
  const name = (formData.get("name") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim().toLowerCase();
  const imageUrl = (formData.get("imageUrl") as string)?.trim() || null;
  const imageAlt = (formData.get("imageAlt") as string)?.trim() || null;
  const position = parseInt(formData.get("position") as string, 10) || 0;

  if (!name || !slug) {
    return { error: "Name and Slug are required." };
  }

  try {
    if (id) {
      await db
        .update(categories)
        .set({
          name,
          slug,
          imageUrl,
          imageAlt,
          position,
        })
        .where(eq(categories.id, id));
    } else {
      await db.insert(categories).values({
        name,
        slug,
        imageUrl,
        imageAlt,
        position,
      });
    }

    revalidatePath("/admin/categories");
    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    console.error("Failed to save category", error);
    const err = error as { code?: string } | undefined;
    if (err?.code === "23505") {
      return { error: "A category with this slug already exists." };
    }
    return { error: "Failed to save category." };
  }
}

/**
 * Delete Category
 */
export async function deleteCategoryAction(
  categoryId: string,
): Promise<ActionResponse> {
  await requireAdmin();

  try {
    await db.delete(categories).where(eq(categories.id, categoryId));
    revalidatePath("/admin/categories");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete category", error);
    return {
      error:
        "Cannot delete category because there are active products assigned to it. Reassign or delete the products first.",
    };
  }
}

/**
 * Update Order Fulfillment Status
 */
export async function updateOrderStatusAction(
  orderId: string,
  fulfillmentStatus: string,
): Promise<ActionResponse> {
  await requireAdmin();

  if (!orderId || !fulfillmentStatus) {
    return { error: "Order ID and status are required." };
  }

  try {
    await db
      .update(orders)
      .set({ fulfillmentStatus })
      .where(eq(orders.id, orderId));

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update order status", error);
    return { error: "Failed to update order status." };
  }
}

/**
 * Update User Role
 */
export async function updateUserRoleAction(
  userId: string,
  newRole: "admin" | "customer",
): Promise<ActionResponse> {
  await requireAdmin();

  if (!userId || !newRole) {
    return { error: "User ID and new role are required." };
  }

  try {
    await db
      .update(user)
      .set({ role: newRole })
      .where(eq(user.id, userId));

    revalidatePath("/admin/customers");
    return { success: true };
  } catch (error) {
    console.error("Failed to update user role", error);
    return { error: "Failed to update user role." };
  }
}
