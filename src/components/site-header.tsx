"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { CartNavButton } from "@/components/cart-nav-button";
import { primaryNav } from "@/lib/sample-data";

/**
 * Centred wordmark, navigation split either side of it on desktop, drawer on
 * mobile. The header is sticky and gains a hairline only once the page has
 * scrolled, so it sits on the hero image without a seam.
 *
 * `account` and `bag` are slots rather than session reads of their own: this
 * stays a client component for the scroll hairline and the drawer, and pages
 * decide whether they can afford the dynamic render a live session lookup
 * forces. Each is rendered in two places, so pass something presentational.
 *
 * The four catalogue routes (`/`, `/new-arrivals`, `/collections/[slug]`,
 * `/products/[slug]`) deliberately pass neither: any server read of
 * `headers()` in this shell would make them dynamic and kill their
 * `revalidate = 300` and `generateStaticParams`. That is why the default bag
 * link carries no count. If a live count is wanted there one day, fetch it
 * from a client component after hydration — do not put a server component in
 * this shell.
 */
export function SiteHeader({
  account,
  bag,
}: {
  account?: ReactNode;
  bag?: ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  /* Close on navigation. The per-link handlers below cover most of it, but the
     `account` slot is rendered on the server and cannot carry one. Adjusted
     during render rather than in an effect, so the drawer never paints open
     on the new route. */
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="bg-paper/95 backdrop-blur-md sticky top-0 z-50 transition-shadow duration-200">
      <div className="bg-neutral-900 text-white text-[11px] font-medium py-2 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <span className="inline-block size-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>Express 24h dispatch | 128 Days Certified Hardware Warranty on all gadgets</span>
      </div>

      <div
        className={`container-page relative flex items-center justify-between gap-4 py-4 lg:py-4.5 ${
          scrolled ? "border-hairline border-b shadow-xs" : ""
        }`}
      >
        {/* Mobile: drawer trigger */}
        <button
          type="button"
          className="type-caps text-ink -my-3 -ml-2 px-2 py-3 lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen(true)}
        >
          Menu
        </button>

        {/* Desktop: the catalogue lives to the left of the wordmark */}
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-neutral-700">
            {primaryNav.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="link-nav py-1 hover:text-black">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          href="/"
          className="type-wordmark absolute left-1/2 -translate-x-1/2 lg:static lg:left-auto lg:translate-x-0 flex items-center gap-1.5"
        >
          <span className="text-neutral-950 font-black tracking-tight text-lg">ANORALITE</span>
          <span className="size-1.5 rounded-full bg-rose-500"></span>
        </Link>

        <ul className="type-caps -my-3 flex items-center gap-3 sm:gap-4 lg:gap-5">
          <li className="hidden md:block">
            <a href="#new-arrivals" className="link-nav py-3 text-neutral-600 hover:text-black">
              Deals
            </a>
          </li>
          <li>
            <Link
              href="#wishlist"
              className="link-nav flex items-center gap-1.5 py-3 text-neutral-700 hover:text-black transition-colors"
              title="Wishlist"
              aria-label="Wishlist"
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
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
              <span className="hidden sm:inline">Wishlist</span>
            </Link>
          </li>
          <li>
            {account ?? (
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
            )}
          </li>
          <li>
            {bag ?? <CartNavButton />}
          </li>
        </ul>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        hidden={!menuOpen}
        className="bg-paper fixed inset-0 z-50 flex flex-col lg:hidden"
      >
        <div className="container-page border-hairline flex items-center justify-between border-b py-5">
          <span className="text-neutral-950 font-black tracking-tight text-lg">ANORALITE</span>
          <button
            type="button"
            className="type-caps text-ink -my-3 -mr-2 px-2 py-3"
            onClick={() => setMenuOpen(false)}
          >
            Close
          </button>
        </div>
        <nav aria-label="Main" className="container-page section-tight">
          <ul className="stack-lg">
            {primaryNav.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="font-display text-3xl text-ink"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="type-caps stack rule-top mt-12 pt-8">
            <li>
              <a href="#" className="text-ash inline-block py-1">
                Search
              </a>
            </li>
            <li>
              <Link
                href="#wishlist"
                className="text-ash flex items-center gap-2 py-1.5"
                onClick={() => setMenuOpen(false)}
              >
                <svg
                  className="size-4 text-neutral-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.8"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
                <span>Wishlist</span>
              </Link>
            </li>
            <li>
              {account ?? (
                <Link
                  href="/account"
                  className="text-ash flex items-center gap-2 py-1.5"
                  onClick={() => setMenuOpen(false)}
                >
                  <svg
                    className="size-4 text-neutral-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.8"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                  <span>Account</span>
                </Link>
              )}
            </li>
            <li>
              {bag ?? (
                <div onClick={() => setMenuOpen(false)}>
                  <CartNavButton className="text-ash !py-1.5" />
                </div>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
