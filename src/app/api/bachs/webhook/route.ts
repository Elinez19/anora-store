import { BachsWebhookError, type WebhookEvent, webhooks } from "@bachs/sdk";

import { fulfillBachsCheckout } from "@/lib/orders";
import { webhookSecret } from "@/lib/bachs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface WebhookData {
  checkout_id?: string;
  charge_id?: string | null;
  charge?: { id?: string | null };
  amount?: string;
  currency?: string;
  payment_status?: string;
  status?: string;
  customer?: { email?: string | null };
  customer_details?: { email?: string | null };
  metadata?: Record<string, unknown> | null;
}

export async function POST(request: Request) {
  const payload = await request.text();

  let event: WebhookEvent;
  try {
    event = webhooks.constructEvent(
      payload,
      request.headers,
      webhookSecret(),
    );
  } catch (err) {
    if (err instanceof BachsWebhookError) {
      console.warn("Bachs webhook signature verification failed:", err.message);
      return new Response("Invalid signature", { status: 400 });
    }
    console.error("Unexpected error verifying Bachs webhook signature:", err);
    return new Response("Internal error", { status: 500 });
  }

  try {
    switch (event.type) {
      case "collection.succeeded": {
        const data = event.data as WebhookData;
        if (data.checkout_id) {
          await fulfillBachsCheckout({
            checkoutId: data.checkout_id,
            chargeId: data.charge_id ?? null,
            amount: data.amount,
            currency: data.currency,
            customerEmail: data.customer?.email ?? null,
            metadata: data.metadata,
          });
        }
        break;
      }

      case "checkout.completed": {
        const data = event.data as WebhookData;
        if (data.payment_status === "paid" || data.status === "completed") {
          await fulfillBachsCheckout({
            checkoutId: data.checkout_id ?? "",
            chargeId: data.charge?.id ?? null,
            amount: data.amount,
            currency: data.currency,
            customerEmail:
              data.customer_details?.email ?? data.customer?.email ?? null,
            metadata: data.metadata,
          });
        }
        break;
      }

      case "collection.failed":
        console.info(
          "Bachs collection payment failed:",
          (event.data as Record<string, unknown>)?.checkout_id,
        );
        break;

      default:
        // Acknowledge other event types
        break;
    }
  } catch (error) {
    console.error("Bachs webhook handler failed:", event.type, error);
    return new Response("Handler error", { status: 500 });
  }

  return new Response(null, { status: 200 });
}
