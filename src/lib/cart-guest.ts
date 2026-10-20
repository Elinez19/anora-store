import { cookies } from "next/headers";
import { MAX_QUANTITY } from "@/lib/cart-types";

export const GUEST_CART_COOKIE = "guest_cart";
export const GUEST_CART_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export type GuestCartItem = {
  productId: string;
  quantity: number;
};

/**
 * Safely parse the guest cart cookie from Next.js headers/cookies.
 */
export async function getGuestCart(): Promise<GuestCartItem[]> {
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get(GUEST_CART_COOKIE)?.value;
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (item): item is GuestCartItem =>
          typeof item === "object" &&
          item !== null &&
          typeof item.productId === "string" &&
          typeof item.quantity === "number" &&
          item.quantity > 0,
      )
      .map((item) => ({
        productId: item.productId,
        quantity: Math.min(item.quantity, MAX_QUANTITY),
      }));
  } catch {
    return [];
  }
}

/**
 * Save the guest cart to cookie.
 */
export async function setGuestCart(items: GuestCartItem[]): Promise<void> {
  const cookieStore = await cookies();
  if (items.length === 0) {
    cookieStore.delete(GUEST_CART_COOKIE);
    return;
  }

  cookieStore.set(GUEST_CART_COOKIE, JSON.stringify(items), {
    path: "/",
    maxAge: GUEST_CART_MAX_AGE,
    sameSite: "lax",
    httpOnly: false, // Allows client-side badge read if needed
    secure: process.env.NODE_ENV === "production",
  });
}

/**
 * Add or increment item in guest cart.
 */
export async function addGuestCartItem(productId: string, quantity: number): Promise<void> {
  const items = await getGuestCart();
  const existingIndex = items.findIndex((i) => i.productId === productId);

  if (existingIndex >= 0) {
    items[existingIndex].quantity = Math.min(
      items[existingIndex].quantity + quantity,
      MAX_QUANTITY,
    );
  } else {
    items.push({
      productId,
      quantity: Math.min(quantity, MAX_QUANTITY),
    });
  }

  await setGuestCart(items);
}

/**
 * Set quantity of item in guest cart.
 */
export async function setGuestCartQuantity(productId: string, quantity: number): Promise<void> {
  let items = await getGuestCart();

  if (quantity <= 0) {
    items = items.filter((i) => i.productId !== productId);
  } else {
    const existingIndex = items.findIndex((i) => i.productId === productId);
    if (existingIndex >= 0) {
      items[existingIndex].quantity = Math.min(quantity, MAX_QUANTITY);
    }
  }

  await setGuestCart(items);
}

/**
 * Remove item from guest cart.
 */
export async function removeGuestCartItem(productId: string): Promise<void> {
  const items = await getGuestCart();
  const filtered = items.filter((i) => i.productId !== productId);
  await setGuestCart(filtered);
}

/**
 * Clear guest cart.
 */
export async function clearGuestCart(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(GUEST_CART_COOKIE);
}
