import { notFound } from "next/navigation";
import { getBag, getGuestBag } from "@/lib/cart";
import { getGuestCart } from "@/lib/cart-guest";
import { getCurrentUser } from "@/lib/session";
import { ModernCheckoutView } from "@/components/modern-checkout-view";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Checkout | Shopinverse",
};

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  const bag = user ? await getBag(user.id) : await getGuestCart().then(getGuestBag);

  if (!bag || bag.lines.length === 0) {
    // If empty bag, show empty state or redirect
  }

  return (
    <ModernCheckoutView
      bag={bag}
      userEmail={user?.email}
      userName={user?.name}
    />
  );
}
