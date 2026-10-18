import "server-only";

import type { BatchItem } from "drizzle-orm/batch";
import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { sql } from "drizzle-orm";

import { db } from "@/db";
import {
  cartItems,
  orderItems,
  orders,
  productImages,
  products,
} from "@/db/schema";
import { bachs } from "@/lib/bachs";
import { getBag } from "@/lib/cart";

/**
 * Order fulfillment for Bachs Checkout.
 *
 * This runs from the Bachs webhook (e.g. `collection.succeeded` or `checkout.completed`),
 * never from client-side redirects or the success page.
 *
 * It is fully idempotent. The `orders.stripeCheckoutSessionId` UNIQUE constraint
 * (used to store the unique checkout session id `chk_...`) prevents duplicate orders.
 */

/** Postgres unique_violation code. */
const UNIQUE_VIOLATION = "23505";

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === UNIQUE_VIOLATION
  );
}

export async function getOrderBySessionId(sessionId: string) {
  return db.query.orders.findFirst({
    where: eq(orders.stripeCheckoutSessionId, sessionId),
    with: {
      items: {
        with: {
          product: {
            with: { images: { orderBy: [asc(productImages.position)], limit: 1 } },
          },
        },
      },
    },
  });
}

// Keep legacy alias so existing components don't break during migration
export const getOrderByStripeSessionId = getOrderBySessionId;
export const fulfillCheckoutSession = async (sessionId: string) => {
  return fulfillBachsCheckout({ checkoutId: sessionId });
};

export async function getOrdersForUser(userId: string) {
  return db.query.orders.findMany({
    where: eq(orders.userId, userId),
    orderBy: [desc(orders.createdAt)],
    with: { items: true },
  });
}

export interface FulfillBachsOptions {
  checkoutId: string;
  chargeId?: string | null;
  amount?: string;
  currency?: string;
  customerEmail?: string | null;
  metadata?: Record<string, unknown> | null;
}

export async function fulfillBachsCheckout(options: FulfillBachsOptions): Promise<void> {
  const { checkoutId, chargeId, amount, currency, customerEmail, metadata } = options;

  // Fast path for duplicate deliveries
  const existing = await db
    .select({ id: orders.id })
    .from(orders)
    .where(eq(orders.stripeCheckoutSessionId, checkoutId))
    .limit(1);

  if (existing.length > 0) return;

  // Retrieve checkout session from Bachs to confirm status and retrieve fresh details
  const session = await bachs.checkoutSessions.get(checkoutId);

  const effectiveMetadata = (session.metadata as Record<string, string> | undefined) ?? 
    (metadata as Record<string, string> | undefined) ?? {};
    
  const userId = effectiveMetadata.user_id;
  const cartId = effectiveMetadata.cart_id;

  if (!userId) {
    console.warn("Bachs session has no user_id in metadata, skipping", checkoutId);
    return;
  }

  // Get the bag items snapshot
  const bag = await getBag(userId);
  if (bag.lines.length === 0) {
    console.warn("User bag is empty upon fulfillment, order might already be processed or cleared", userId, checkoutId);
  }

  const orderId = crypto.randomUUID();

  const lines = bag.lines.map((line) => ({
    orderId,
    productId: line.productId,
    productSlug: line.slug,
    name: line.name,
    sku: line.sku,
    colour: line.colour,
    imageUrl: line.image?.src ?? null,
    unitPriceCents: line.unitPriceCents,
    quantity: line.quantity,
    lineTotalCents: line.lineTotalCents,
  }));

  const decrements = bag.lines.map((line) =>
    db
      .update(products)
      .set({
        stockQuantity: sql`greatest(${products.stockQuantity} - ${line.quantity}, 0)`,
      })
      .where(
        and(
          eq(products.id, line.productId),
          eq(products.madeToOrder, false),
        ),
      ),
  );

  // Convert decimal amount to cents if available, otherwise fallback to bag subtotal
  const chargedCents = amount
    ? Math.round(parseFloat(amount) * 100)
    : bag.subtotalCents;

  const email =
    customerEmail ??
    session.customer?.email ??
    session.customer_details?.email ??
    "unknown";

  const statements = [
    db.insert(orders).values({
      id: orderId,
      userId,
      stripeCheckoutSessionId: checkoutId,
      stripePaymentIntentId: chargeId ?? null,
      email,
      totalCents: chargedCents,
      currency: currency?.toLowerCase() ?? "usd",
    }),
    ...(lines.length > 0 ? [db.insert(orderItems).values(lines)] : []),
    ...decrements,
    ...(cartId
      ? [db.delete(cartItems).where(eq(cartItems.cartId, cartId))]
      : []),
  ] as [BatchItem<"pg">, ...BatchItem<"pg">[]];

  try {
    await db.batch(statements);
    console.info("Bachs order fulfilled successfully", { orderId, checkoutId });
  } catch (error) {
    if (isUniqueViolation(error)) {
      console.info("Order already fulfilled concurrently", checkoutId);
      return;
    }
    throw error;
  }
}
