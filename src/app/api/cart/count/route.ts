import { NextResponse } from "next/server";
import { getBagCount } from "@/lib/cart";
import { getGuestCart } from "@/lib/cart-guest";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (user) {
      const count = await getBagCount(user.id);
      return NextResponse.json({ count });
    }

    const guestItems = await getGuestCart();
    const count = guestItems.reduce((acc, item) => acc + item.quantity, 0);
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Failed to get cart count", error);
    return NextResponse.json({ count: 0 });
  }
}
