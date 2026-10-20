"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { user } from "@/db/schema";
import { getBag, getGuestBag, getOrCreateCartId, addItem } from "@/lib/cart";
import { getGuestCart, clearGuestCart } from "@/lib/cart-guest";
import type { CartFormState } from "@/lib/cart-form-state";
import { getCurrentUser } from "@/lib/session";
import { appUrl, bachs } from "@/lib/bachs";

export interface CheckoutDetails {
  email?: string;
  name?: string;
  phone?: string;
  deliveryMode?: "ship" | "pickup";
  country?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  discountCode?: string;
}

/**
 * Creates and initiates a Bachs Checkout Session.
 * Can be called from the cart page (fast checkout) or from the checkout page
 * with full contact/shipping details.
 */
export async function createBachsCheckoutSession(
  details?: CheckoutDetails,
): Promise<{ url?: string; error?: string }> {
  const currentUser = await getCurrentUser();

  // Resolve bag: either user's database bag or guest cart bag
  let bag = currentUser
    ? await getBag(currentUser.id)
    : await getGuestCart().then(getGuestBag);

  if (bag.lines.length === 0) {
    return { error: "Your cart is empty." };
  }

  // Stock availability check
  const unavailable = bag.lines.find(
    (line) =>
      line.stock === "sold_out" ||
      (line.availableQuantity !== null && line.quantity > line.availableQuantity),
  );
  if (unavailable) {
    return {
      error: `${unavailable.name} is no longer available in that quantity. Please update your cart.`,
    };
  }

  // Ensure an effective user ID that satisfies orders foreign key
  let effectiveUserId = currentUser?.id;
  let effectiveCartId = bag.cartId;

  const customerEmail =
    details?.email?.trim() ||
    currentUser?.email ||
    "customer@example.com";

  const customerName =
    details?.name?.trim() ||
    currentUser?.name?.trim() ||
    customerEmail.split("@")[0] ||
    "Customer";

  // If unauthenticated guest, ensure a user record exists in the DB so that orders.userId (FK) succeeds
  if (!effectiveUserId) {
    // Check if user exists by email or create a guest user entry
    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, customerEmail),
    });

    if (existingUser) {
      effectiveUserId = existingUser.id;
    } else {
      const newGuestUserId = crypto.randomUUID();
      await db.insert(user).values({
        id: newGuestUserId,
        name: customerName,
        email: customerEmail,
        emailVerified: false,
      });
      effectiveUserId = newGuestUserId;
    }

    // Also populate DB cart for this user from guest cart items if needed
    const guestItems = await getGuestCart();
    if (guestItems.length > 0) {
      effectiveCartId = await getOrCreateCartId(effectiveUserId);
      for (const item of guestItems) {
        await addItem(effectiveUserId, item.productId, item.quantity);
      }
    }
  }

  // Calculate discount if applicable
  let finalSubtotalCents = bag.subtotalCents;
  if (details?.discountCode) {
    const code = details.discountCode.trim().toUpperCase();
    if (code === "SAVE10" || code === "ANORA10") {
      finalSubtotalCents = Math.round(bag.subtotalCents * 0.9);
    }
  }

  const decimalAmount = (finalSubtotalCents / 100).toFixed(2);

  try {
    const session = await bachs.checkoutSessions.create(
      {
        pricing: {
          currency: "NGN",
          amount: decimalAmount,
        },
        customer: {
          email: customerEmail,
          name: customerName,
          ...(details?.phone ? { phone_number: details.phone.trim() } : {}),
        },
        metadata: {
          user_id: effectiveUserId ?? "guest",
          cart_id: effectiveCartId ?? "",
          delivery_mode: details?.deliveryMode ?? "ship",
          country: details?.country ?? "Nigeria",
          address: details?.address ?? "",
          city: details?.city ?? "",
          state: details?.state ?? "",
          postal_code: details?.postalCode ?? "",
          discount_code: details?.discountCode ?? "",
        },
        reference: `ORD-${(effectiveUserId || "GUEST").slice(0, 8).toUpperCase()}-${Date.now()}`,
        success_url: `${appUrl()}/checkout/success?checkout_id={CHECKOUT_ID}`,
        cancel_url: `${appUrl()}/checkout?cancelled=1`,
      },
      {
        idempotencyKey: `chk-${effectiveUserId || "guest"}-${finalSubtotalCents}-${Date.now().toString().slice(0, -3)}`,
      },
    );

    if (session?.checkout_url) {
      return { url: session.checkout_url };
    }
    return { error: "Could not create payment session." };
  } catch (error: unknown) {
    console.error("Failed to create Bachs Checkout Session:", error);
    const errObj = error as { body?: { detail?: string }; message?: string };
    const message = errObj?.body?.detail || errObj?.message;
    return {
      error: message
        ? `Payment error: ${message}`
        : "We could not start payment. Please check your details and try again.",
    };
  }
}

/**
 * Standard server action for direct form submissions (e.g. from the cart page).
 */
export async function startCheckout(
  _prev: CartFormState,
  _formData: FormData,
): Promise<CartFormState> {
  const result = await createBachsCheckoutSession();
  if (result.error) {
    return { error: result.error };
  }
  if (result.url) {
    redirect(result.url);
  }
  return { error: "Unable to redirect to checkout." };
}
