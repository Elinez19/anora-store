"use server";

import { redirect } from "next/navigation";

import { getBag } from "@/lib/cart";
import type { CartFormState } from "@/lib/cart-form-state";
import { requireUser } from "@/lib/session";
import { appUrl, bachs } from "@/lib/bachs";

/**
 * Starts a Bachs-hosted Checkout Session for the caller's bag.
 *
 * The form posts nothing. Every amount, quantity and product identity is
 * re-derived here from `getBag(user.id)` — a fresh read of `cart_items`
 * joined to live `products.priceCents`. Nothing about money crosses the
 * browser, so there is nothing for a tampered form to change.
 */

export async function startCheckout(
  _prev: CartFormState,
  _formData: FormData,
): Promise<CartFormState> {
  const currentUser = await requireUser("/bag");
  const bag = await getBag(currentUser.id);

  if (!bag.cartId || bag.lines.length === 0) {
    return { error: "Your bag is empty." };
  }

  // Re-check stock against the same fresh read the prices came from, so a
  // piece that sold out while the bag sat open cannot reach payment.
  const unavailable = bag.lines.find(
    (line) =>
      line.stock === "sold_out" ||
      (line.availableQuantity !== null &&
        line.quantity > line.availableQuantity),
  );
  if (unavailable) {
    return {
      error: `${unavailable.name} is no longer available in that quantity. Please update your bag.`,
    };
  }

  let url: string | null = null;

  try {
    // Money in Bachs is always a decimal string at the currency's precision (e.g., "29.00").
    const decimalAmount = (bag.subtotalCents / 100).toFixed(2);

    const session = await bachs.checkoutSessions.create(
      {
        pricing: {
          currency: "USD",
          amount: decimalAmount,
        },
        customer: {
          email: currentUser.email,
          name: currentUser.name?.trim() || currentUser.email.split("@")[0] || "Customer",
        },
        metadata: {
          user_id: currentUser.id,
          cart_id: bag.cartId,
        },
        reference: `ORD-${currentUser.id.slice(0, 8)}-${Date.now()}`,
        success_url: `${appUrl()}/checkout/success?checkout_id={CHECKOUT_ID}`,
        cancel_url: `${appUrl()}/bag?cancelled=1`,
      },
      {
        idempotencyKey: `chk-${currentUser.id}-${bag.cartId}-${bag.subtotalCents}`,
      },
    );
    url = session.checkout_url;
  } catch (error: any) {
    console.error("Failed to create Bachs Checkout Session", error);
    const message = error?.body?.detail || error?.message;
    return {
      error: message
        ? `Checkout error: ${message}`
        : "We could not start checkout. Please try again.",
    };
  }

  if (!url) return { error: "We could not start checkout. Please try again." };

  // Outside the try: redirect() works by throwing, and the catch above would
  // swallow it into an error state instead of navigating.
  redirect(url);
}
