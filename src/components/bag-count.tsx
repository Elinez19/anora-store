import Link from "next/link";
import { getBagCount } from "@/lib/cart";
import { getGuestCart } from "@/lib/cart-guest";
import { getCurrentUser } from "@/lib/session";
import { CartNavButton } from "@/components/cart-nav-button";

/**
 * The header's bag affordance with a live count.
 */
export async function BagCount() {
  const user = await getCurrentUser();
  let count = 0;

  if (user) {
    count = await getBagCount(user.id);
  } else {
    const guestItems = await getGuestCart();
    count = guestItems.reduce((acc, item) => acc + item.quantity, 0);
  }

  return <CartNavButton initialCount={count} />;
}

/** Shown while the count query is in flight; same shape, no layout shift. */
export function BagCountFallback() {
  return (
    <Link
      href="/bag"
      className="link-nav flex items-center gap-1.5 py-3 text-neutral-900 font-bold hover:text-black transition-colors"
      title="Cart"
      aria-label="Cart"
    >
      <svg
        className="size-4.5 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.8"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25c-.669 0-1.189-.578-1.119-1.243l1.263-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z"
        />
      </svg>
      <span className="hidden sm:inline">Cart</span>
    </Link>
  );
}
