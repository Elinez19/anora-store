/** Storefront catalogue currency formatter in NGN (₦). */
export const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

/**
 * Money derived from cents/kobo: the bag, checkout and receipts.
 */
export const currencyExact = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

/** Formats integer kobo/cents into formatted NGN string. */
export function formatCents(cents: number): string {
  return currencyExact.format(cents / 100);
}

/**
 * Month and year only — "September 2026". A day would be noise beside a
 * "member since", and the coarser format keeps the server's rendering from
 * disagreeing with a client in another timezone.
 */
export const monthYear = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});
