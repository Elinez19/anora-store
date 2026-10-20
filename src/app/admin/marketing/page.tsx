import { requireAdmin } from "@/lib/admin";
import { getAdminMarketingOverview } from "@/lib/admin-data";
import { BroadcastComposer } from "@/components/admin/broadcast-composer";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Email Marketing & Broadcasts | Admin Control Studio",
};

export default async function AdminMarketingPage() {
  const admin = await requireAdmin("/admin/marketing");
  const { total, active, unsubscribed, subscribers } =
    await getAdminMarketingOverview();

  const defaultSegmentId = process.env.RESEND_MARKETING_SEGMENT_ID || "";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
            Email Marketing & Broadcasts
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Grow your audience, sync contacts with Resend, and dispatch high-converting marketing campaigns.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 text-white text-xs font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Resend Contacts Synced</span>
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-xs">
          <span className="text-2xs font-mono font-bold uppercase tracking-wider text-zinc-400">
            Total Subscribers
          </span>
          <div className="text-2xl font-extrabold text-zinc-950 mt-1 font-mono">
            {total}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-emerald-200/80 shadow-xs">
          <span className="text-2xs font-mono font-bold uppercase tracking-wider text-emerald-600">
            Active Audience
          </span>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1 font-mono">
            {active}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-xs">
          <span className="text-2xs font-mono font-bold uppercase tracking-wider text-zinc-400">
            Unsubscribed
          </span>
          <div className="text-2xl font-extrabold text-zinc-600 mt-1 font-mono">
            {unsubscribed}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-xs">
          <span className="text-2xs font-mono font-bold uppercase tracking-wider text-zinc-400">
            Delivery Engine
          </span>
          <div className="text-sm font-bold text-zinc-900 mt-2 flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span>Resend Broadcasts API</span>
          </div>
        </div>
      </div>

      {/* Campaign Broadcast Composer */}
      <BroadcastComposer
        adminEmail={admin.email}
        defaultSegmentId={defaultSegmentId}
      />

      {/* Subscribers Table */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white overflow-hidden shadow-xs">
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-zinc-950">
              Newsletter Subscribers ({subscribers.length})
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Synced automatically from the storefront newsletter signup and synced to Resend.
            </p>
          </div>
          <span className="text-2xs font-mono text-zinc-400">
            Auto-Sync Active
          </span>
        </div>

        {subscribers.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-xs text-zinc-500">
              No newsletter subscribers yet. Submissions on the homepage will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/60 text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-400">
                  <th className="py-3 px-5">Subscriber Email</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5">Resend Contact ID</th>
                  <th className="py-3 px-5 text-right">Subscribed Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs">
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3.5 px-5 font-mono font-semibold text-zinc-900">
                      {sub.email}
                    </td>
                    <td className="py-3.5 px-5">
                      {sub.status === "subscribed" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Subscribed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-600 border border-zinc-200">
                          Unsubscribed
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 font-mono text-2xs text-zinc-500">
                      {sub.resendContactId ? (
                        <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
                          {sub.resendContactId}
                        </span>
                      ) : (
                        <span className="text-zinc-400">&mdash;</span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-right text-zinc-500">
                      {new Date(sub.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
