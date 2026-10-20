import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminSupportTicketById } from "@/lib/admin-data";
import { TicketStatusSelect } from "@/components/admin/ticket-status-select";
import { SupportReplyForm } from "@/components/admin/support-reply-form";

export const dynamic = "force-dynamic";

interface TicketPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminTicketDetailPage({ params }: TicketPageProps) {
  const { id } = await params;
  const ticket = await getAdminSupportTicketById(id);

  if (!ticket) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/support"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-950 transition-colors"
        >
          <span>&larr;</span>
          <span>Back to Inbox</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-2xs text-zinc-500 font-mono">Status:</span>
          <TicketStatusSelect ticketId={ticket.id} currentStatus={ticket.status} />
        </div>
      </div>

      {/* Ticket Overview Card */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-zinc-100">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-mono font-bold text-zinc-950">
                {ticket.ticketNumber}
              </span>
              {ticket.source === "inbound_email" ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                  Inbound Email
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  Contact Form
                </span>
              )}
              {ticket.category && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-zinc-100 text-zinc-600 border border-zinc-200 uppercase">
                  {ticket.category}
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold text-zinc-950">
              {ticket.subject}
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Received on{" "}
              {new Date(ticket.createdAt).toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/70 text-xs sm:w-72 shrink-0">
            <span className="text-2xs font-mono font-bold uppercase text-zinc-400">
              Customer Info
            </span>
            <div className="font-semibold text-zinc-950 mt-1">
              {ticket.fromName || "Unknown"}
            </div>
            <div className="font-mono text-zinc-600 text-[11px] mt-0.5">
              {ticket.fromEmail}
            </div>
            {ticket.orderNumber && (
              <div className="mt-2 pt-2 border-t border-zinc-200/60 text-2xs">
                <span className="text-zinc-500">Order: </span>
                <span className="font-mono font-bold text-zinc-900">{ticket.orderNumber}</span>
              </div>
            )}
            {ticket.resendEmailId && (
              <div className="mt-1 text-2xs text-zinc-400 font-mono truncate" title={ticket.resendEmailId}>
                Resend ID: {ticket.resendEmailId}
              </div>
            )}
          </div>
        </div>

        {/* Original Message */}
        <div className="mt-6">
          <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold mb-3">
            Customer Message
          </h3>
          <div className="rounded-xl bg-zinc-50/70 border border-zinc-200/60 p-5 text-xs text-zinc-900 leading-relaxed whitespace-pre-wrap font-sans">
            {ticket.message}
          </div>
        </div>
      </div>

      {/* Reply Thread History */}
      {ticket.replies.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-zinc-950 px-1">
            Reply History ({ticket.replies.length})
          </h2>
          {ticket.replies.map((reply) => (
            <div
              key={reply.id}
              className={`rounded-2xl border p-5 shadow-xs ${
                reply.senderRole === "admin"
                  ? "bg-zinc-950 text-white border-zinc-800 ml-6 sm:ml-12"
                  : "bg-white text-zinc-900 border-zinc-200/80 mr-6 sm:mr-12"
              }`}
            >
              <div className="flex items-center justify-between text-2xs opacity-75 pb-3 border-b border-white/10 mb-3">
                <span className="font-semibold">
                  {reply.senderRole === "admin" ? "Admin Support" : "Customer"} ({reply.senderEmail})
                </span>
                <span>
                  {new Date(reply.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="text-xs whitespace-pre-wrap leading-relaxed">
                {reply.message}
              </div>
              {reply.resendEmailId && (
                <div className="mt-3 pt-2 text-[10px] font-mono opacity-50 border-t border-white/5 truncate">
                  Resend Message ID: {reply.resendEmailId}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reply Form */}
      <SupportReplyForm
        ticketId={ticket.id}
        customerEmail={ticket.fromEmail}
      />
    </div>
  );
}
