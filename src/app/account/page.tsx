import Link from "next/link";
import { Suspense } from "react";

import {
  AccountNavLink,
  AccountNavLinkFallback,
} from "@/components/account-nav-link";
import { BagCount, BagCountFallback } from "@/components/bag-count";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCurrentAdminUser } from "@/lib/admin";
import { signOutAction } from "@/lib/auth-actions";
import { monthYear } from "@/lib/format";
import { requireUser } from "@/lib/session";

/**
 * `requireUser()` reads `headers()`, which already opts this route out of
 * caching — but say it outright. A cached `/account` would serve one
 * customer's name and address to the next visitor.
 */
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Your account",
};

export default async function AccountPage() {
  const user = await requireUser("/account");
  const adminUser = await getCurrentAdminUser();

  return (
    <>
      <SiteHeader
        account={
          <Suspense fallback={<AccountNavLinkFallback />}>
            <AccountNavLink />
          </Suspense>
        }
        bag={
          <Suspense fallback={<BagCountFallback />}>
            <BagCount />
          </Suspense>
        }
      />

      <main className="flex-1">
        <div className="container-prose section stack-lg">
          <header className="stack-sm">
            <p className="type-caps text-ash">Account</p>
            <h1 className="text-4xl">{user.name}</h1>
          </header>

          <dl className="stack">
            <div className="rule pb-6">
              <dt className="field-label">Name</dt>
              <dd className="text-ink">{user.name}</dd>
            </div>
            <div className="rule pb-6">
              <dt className="field-label">Email</dt>
              <dd className="text-ink">{user.email}</dd>
            </div>
            <div className="rule pb-6">
              <dt className="field-label">Member since</dt>
              <dd className="text-ink" data-numeric>
                {monthYear.format(user.createdAt)}
              </dd>
            </div>
          </dl>

          {/* Admin Dashboard Entrypoint */}
          {adminUser?.isAdmin && (
            <div className="p-5 rounded-2xl bg-white/95 backdrop-blur-xl text-zinc-950 flex items-center justify-between border border-zinc-200/90 shadow-[0_4px_25px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.9)]">
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-semibold">
                  Staff Access
                </div>
                <div className="font-bold text-base text-zinc-950 mt-0.5">
                  Admin Control Studio
                </div>
              </div>
              <Link
                href="/admin"
                className="px-5 py-2.5 rounded-xl bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800 transition-all shadow-[0_4px_14px_rgba(0,0,0,0.12)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.18)] active:scale-[0.98] border border-black/10"
              >
                Open Studio →
              </Link>
            </div>
          )}

          {/* A plain form, so signing out needs no JavaScript. */}
          <form action={signOutAction}>
            <button
              type="submit"
              className="btn btn-outline btn-block sm:min-w-56"
            >
              Sign out
            </button>
          </form>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
