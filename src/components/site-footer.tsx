import Link from "next/link";

import { footerNav } from "@/lib/sample-data";

export function SiteFooter() {
  return (
    <footer className="rule-top bg-paper">
      <div className="container-page section-tight">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="stack">
            <span className="type-wordmark text-lg font-bold">Anoralite</span>
            <p className="type-meta max-w-xs text-xs text-neutral-500">
              High-performance laptops, desktop workstations, AI wearables, and premium desk accessories.
            </p>
          </div>

          {footerNav.map((group) => (
            <nav key={group.heading} aria-labelledby={`f-${group.heading}`}>
              <h2
                id={`f-${group.heading}`}
                className="type-caps text-ink font-sans text-xs font-semibold"
              >
                {group.heading}
              </h2>
              <ul className="stack mt-4">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-ash hover:text-ink inline-block py-1 text-xs"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="rule-top mt-16 flex flex-col gap-4 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="type-meta text-2xs">
            &copy; <span data-numeric>2026</span> Anoralite Tech Store. All rights reserved.
          </p>
          <ul className="type-meta text-2xs flex flex-wrap gap-6">
            <li>
              <a href="#" className="hover:text-ink">
                Warranty Terms
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-ink">
                Certified Quality
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-ink">
                Shipping Nationwide
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
