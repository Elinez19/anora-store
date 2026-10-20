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
            <div className="p-4 rounded-xl bg-zinc-950 text-white flex items-center justify-between border border-zinc-800 shadow-md">
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                  Staff Access
                </div>
                <div className="font-bold text-sm text-white mt-0.5">
                  Admin Control Studio
                </div>
              </div>
              <Link
                href="/admin"
                className="px-4 py-2 rounded-lg bg-white text-zinc-950 text-xs font-bold hover:bg-zinc-200 transition"
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
