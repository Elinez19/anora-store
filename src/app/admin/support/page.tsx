import Link from "next/link";
import { getAdminSupportTickets } from "@/lib/admin-data";
import { TicketStatusSelect } from "@/components/admin/ticket-status-select";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Support & Inbound Inbox | Admin Control Studio",
};

interface SupportPageProps {
  searchParams: Promise<{
    status?: string;
    source?: string;
    q?: string;
  }>;
}

export default async function AdminSupportPage({ searchParams }: SupportPageProps) {
  const { status = "all", source = "all", q = "" } = await searchParams;

  const tickets = await getAdminSupportTickets({
    status: status === "all" ? undefined : status,
    source: source === "all" ? undefined : source,
    search: q || undefined,
  });

  const totalCount = tickets.length;
  const openCount = tickets.filter((t) => t.status === "open").length;
  const inProgressCount = tickets.filter((t) => t.status === "in_progress").length;
  const inboundCount = tickets.filter((t) => t.source === "inbound_email").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
            Support & Inbound Inbox
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Manage incoming inquiries, customer tickets, and Resend inbound emails in one unified control hub.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 text-white text-xs font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Resend Inbound Active</span>
          </span>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-xs">
          <span className="text-2xs font-mono font-bold uppercase tracking-wider text-zinc-400">
            Total Tickets
          </span>
          <div className="text-2xl font-extrabold text-zinc-950 mt-1 font-mono">
            {totalCount}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-amber-200/80 shadow-xs">
          <span className="text-2xs font-mono font-bold uppercase tracking-wider text-amber-600">
            Needs Attention (Open)
          </span>
          <div className="text-2xl font-extrabold text-amber-700 mt-1 font-mono">
            {openCount}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-sky-200/80 shadow-xs">
          <span className="text-2xs font-mono font-bold uppercase tracking-wider text-sky-600">
            In Progress
          </span>
          <div className="text-2xl font-extrabold text-sky-700 mt-1 font-mono">
            {inProgressCount}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-xs">
          <span className="text-2xs font-mono font-bold uppercase tracking-wider text-zinc-400">
            Inbound Emails
          </span>
          <div className="text-2xl font-extrabold text-zinc-950 mt-1 font-mono">
            {inboundCount}
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {["all", "open", "in_progress", "resolved", "closed"].map((st) => {
            const isActive = status === st;
            return (
              <Link
                key={st}
                href={`/admin/support?status=${st}&source=${source}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                  isActive
                    ? "bg-zinc-950 text-white shadow-xs"
                    : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
                }`}
              >
                {st.replace("_", " ")}
              </Link>
            );
          })}
        </div>

        <form method="get" className="flex items-center gap-2">
          <input type="hidden" name="status" value={status} />
          <input type="hidden" name="source" value={source} />
          <div className="relative">
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search ticket, email or subject..."
              className="w-64 rounded-xl border border-zinc-300 bg-zinc-50/50 px-3 py-1.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-zinc-950 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      {/* Tickets List */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white overflow-hidden shadow-xs">
        {tickets.length === 0 ? (
          <div className="p-12 text-center">
            <div className="size-12 rounded-full bg-zinc-100 text-zinc-400 mx-auto flex items-center justify-center mb-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-zinc-900">No support tickets found</h3>
            <p className="text-xs text-zinc-500 mt-1">
              Inquiries from the contact page and inbound emails received via Resend will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/60 text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-400">
                  <th className="py-3 px-4">Ticket</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Replies</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs">
                {tickets.map((t) => (
                  <tr key={t.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-zinc-950">
                      <Link
                        href={`/admin/support/${t.id}`}
                        className="hover:underline text-zinc-900"
                      >
                        {t.ticketNumber}
                      </Link>
                    </td>

                    <td className="py-3.5 px-4">
                      {t.source === "inbound_email" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                          Inbound Email
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          Contact Form
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-zinc-900">
                        {t.fromName || "Unknown"}
                      </div>
                      <div className="text-2xs font-mono text-zinc-500">
                        {t.fromEmail}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs truncate">
                      <Link
                        href={`/admin/support/${t.id}`}
                        className="font-medium text-zinc-900 hover:underline"
                      >
                        {t.subject}
                      </Link>
                      {t.orderNumber && (
                        <div className="text-2xs font-mono text-zinc-400 mt-0.5">
                          Order: {t.orderNumber}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <TicketStatusSelect
                        ticketId={t.id}
                        currentStatus={t.status}
                      />
                    </td>

                    <td className="py-3.5 px-4 font-mono text-zinc-600">
                      {t.replies.length}
                    </td>

                    <td className="py-3.5 px-4 text-zinc-500 whitespace-nowrap">
                      {new Date(t.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/support/${t.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors shadow-2xs"
                      >
                        <span>View & Reply</span>
                        <span>&rarr;</span>
                      </Link>
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
