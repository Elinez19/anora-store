import Link from "next/link";

import { getCurrentUser } from "@/lib/session";

/**
 * The header's account affordance, resolved against the live session.
 *
 * Reading the session makes the whole route dynamic, so this only goes on
 * routes that are dynamic anyway — the auth pages and `/account`. The
 * catalogue pages keep a static link and let `requireUser()` do the bouncing,
 * which is what preserves their `revalidate`.
 *
 * `SiteHeader` renders whatever it is handed twice, once for desktop and once
 * in the mobile drawer, so this must stay presentational.
 */
export async function AccountNavLink() {
  const user = await getCurrentUser();

  return user ? (
    <Link
      href="/account"
      className="link-nav flex items-center gap-1.5 py-3 text-neutral-700 hover:text-black transition-colors"
      title="Account"
      aria-label="Account"
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
          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
        />
      </svg>
      <span className="hidden sm:inline">Account</span>
    </Link>
  ) : (
    <Link
      href="/sign-in"
      className="link-nav flex items-center gap-1.5 py-3 text-neutral-700 hover:text-black transition-colors"
      title="Sign in"
      aria-label="Sign in"
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
          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
        />
      </svg>
      <span className="hidden sm:inline">Sign in</span>
    </Link>
  );
}

/** Shown while the session query is in flight; same box, no layout shift. */
export function AccountNavLinkFallback() {
  return (
    <Link
      href="/account"
      className="link-nav flex items-center gap-1.5 py-3 text-neutral-700 hover:text-black transition-colors"
      title="Account"
      aria-label="Account"
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
          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
        />
      </svg>
      <span className="hidden sm:inline">Account</span>
    </Link>
  );
}
