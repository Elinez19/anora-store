import "server-only";

import { Bachs } from "@bachs/sdk";

/**
 * Secret API key validator for Bachs.
 * Validates lazily on first use so build/render without payment config succeeds.
 */
function requireSecretKey(): string {
  const key = process.env.BACHS_API_KEY?.trim();

  if (!key) {
    throw new Error(
      "BACHS_API_KEY is not set. Copy it from your Bachs dashboard (https://app.bachs.io) into .env.",
    );
  }

  if (!key.startsWith("sk_sandbox_") && !key.startsWith("sk_live_")) {
    throw new Error(
      "BACHS_API_KEY must start with sk_sandbox_ or sk_live_.",
    );
  }

  return key;
}

let client: Bachs | null = null;

export function getBachs(): Bachs {
  if (!client) {
    const key = requireSecretKey();
    const environment =
      process.env.BACHS_ENVIRONMENT === "production" || key.startsWith("sk_live_")
        ? "production"
        : "sandbox";

    client = new Bachs({
      apiKey: key,
      environment,
    });
  }
  return client;
}

/**
 * Proxy so call sites read `bachs.checkoutSessions.create(...)` cleanly,
 * while initialization stays lazy.
 */
export const bachs = new Proxy({} as Bachs, {
  get(_target, property, receiver) {
    return Reflect.get(getBachs(), property, receiver);
  },
});

export function webhookSecret(): string {
  const secret = process.env.BACHS_WEBHOOK_SECRET?.trim();
  if (!secret) {
    throw new Error(
      "BACHS_WEBHOOK_SECRET is not set. Copy the webhook secret from your Bachs dashboard into .env.",
    );
  }
  return secret;
}

/** Absolute origin for Bachs return URLs. */
export function appUrl(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!url) throw new Error("NEXT_PUBLIC_APP_URL is not set.");
  return url.replace(/\/$/, "");
}
