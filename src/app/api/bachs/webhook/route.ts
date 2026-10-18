import { BachsWebhookError, webhooks } from "@bachs/sdk";

import { fulfillBachsCheckout } from "@/lib/orders";
import { webhookSecret } from "@/lib/bachs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const payload = await request.text();

  let event: any;
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
        const data = event.data;
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
        const data = event.data;
        if (data.payment_status === "paid" || data.status === "completed") {
          await fulfillBachsCheckout({
            checkoutId: data.checkout_id,
            chargeId: data.charge?.id ?? null,
            amount: data.amount,
            currency: data.currency,
            customerEmail: data.customer_details?.email ?? data.customer?.email ?? null,
            metadata: data.metadata,
          });
        }
        break;
      }

      case "collection.failed":
        console.info("Bachs collection payment failed:", event.data?.checkout_id);
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
