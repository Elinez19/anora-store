"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  {
    href: "/admin",
    label: "Overview",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    href: "/admin/products",
    label: "Products",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    href: "/admin/categories",
    label: "Categories",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    href: "/admin/customers",
    label: "Customers",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    href: "/admin/support",
    label: "Support & Inbound",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    href: "/admin/marketing",
    label: "Marketing & Drops",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    ),
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger toggle button */}
      <button
        type="button"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed bottom-5 right-5 z-50 p-3.5 rounded-full bg-zinc-950 text-white shadow-2xl border border-zinc-800 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
        aria-label="Toggle navigation"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {mobileOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Backdrop overlay on mobile */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-zinc-950/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Sidebar Shell: Glossy Premium White with touch black active items */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white/85 backdrop-blur-2xl text-zinc-900 border-r border-zinc-200/80 shadow-[1px_0_30px_rgba(0,0,0,0.03)] flex flex-col transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand identity header */}
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
          <Link href="/admin" className="group flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-zinc-950 text-white font-extrabold text-sm flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.18)] ring-1 ring-zinc-800 group-hover:scale-105 transition-transform">
              A
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-wider text-zinc-950 group-hover:text-zinc-700 transition-colors">
                ANORAA
              </span>
              <span className="text-[10px] tracking-wider uppercase font-mono text-zinc-400 font-medium">
                Control Studio
              </span>
            </div>
          </Link>
          <span className="px-2 py-0.5 text-[10px] uppercase font-mono font-bold rounded-full bg-zinc-100 text-zinc-800 border border-zinc-200">
            PRO
          </span>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          <p className="px-3 pb-2 text-[10px] uppercase tracking-widest font-mono text-zinc-400 font-semibold">
            Management
          </p>
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                  isActive
                    ? "bg-zinc-950 text-white shadow-[0_4px_16px_rgba(0,0,0,0.15)] font-semibold"
                    : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/80 font-medium"
                }`}
              >
                <span
                  className={`${
                    isActive
                      ? "text-white"
                      : "text-zinc-400 group-hover:text-zinc-900 transition-colors"
                  }`}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Storefront return & footer info */}
        <div className="p-4 border-t border-zinc-100 bg-white/60 backdrop-blur-md">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/80 hover:border-zinc-300 transition-all border border-zinc-200/90 shadow-sm font-medium"
          >
            <div className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span>View Live Store</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-400">↗</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
