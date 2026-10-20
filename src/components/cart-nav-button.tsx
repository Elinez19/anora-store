"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export const CART_UPDATED_EVENT = "anora_cart_updated";

/** Dispatches a global event that triggers cart badge count re-fetch across the UI */
export function emitCartUpdate() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
  }
}

/** Helper to parse guest_cart cookie on the client side */
function readGuestCartCountFromCookie(): number {
  if (typeof document === "undefined") return 0;
  const match = document.cookie.match(/(?:^|;\s*)guest_cart=([^;]*)/);
  if (!match) return 0;
  try {
    const parsed = JSON.parse(decodeURIComponent(match[1]));
    if (Array.isArray(parsed)) {
      return parsed.reduce((acc: number, item: { quantity?: number }) => acc + (item?.quantity || 0), 0);
    }
  } catch {
    // Ignore JSON parse errors
  }
  return 0;
}

type Props = {
  initialCount?: number;
  className?: string;
};

export function CartNavButton({ initialCount = 0, className = "" }: Props) {
  const [count, setCount] = useState<number>(initialCount);

  useEffect(() => {
    let isMounted = true;

    const fetchCount = async () => {
      // First optimistic check from cookie if available
      const localCount = readGuestCartCountFromCookie();
      if (localCount > 0 && isMounted) {
        setCount(localCount);
      }

      try {
        const res = await fetch("/api/cart/count", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && typeof data.count === "number") {
            setCount(data.count);
          }
        }
      } catch {
        // Keep current state on fetch error
      }
    };

    fetchCount();

    const handleUpdate = () => {
      fetchCount();
    };

    window.addEventListener(CART_UPDATED_EVENT, handleUpdate);
    window.addEventListener("focus", handleUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener(CART_UPDATED_EVENT, handleUpdate);
      window.removeEventListener("focus", handleUpdate);
    };
  }, []);

  return (
    <Link
      href="/bag"
      className={`link-nav flex items-center gap-1.5 py-3 text-neutral-900 font-bold hover:text-black transition-colors ${className}`}
      title="Cart"
      aria-label="Cart"
    >
      <div className="relative flex items-center">
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
        {count > 0 && (
          <span className="absolute -top-1.5 -right-2 bg-neutral-900 text-white text-[10px] font-bold rounded-full size-4 flex items-center justify-center leading-none">
            {count}
          </span>
        )}
      </div>
      <span className="hidden sm:inline">Cart</span>
    </Link>
  );
}
