"use client";

import { useTransition } from "react";
import { updateSupportTicketStatusAction } from "@/lib/support-actions";

export function TicketStatusSelect({
  ticketId,
  currentStatus,
}: {
  ticketId: string;
  currentStatus: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as "open" | "in_progress" | "resolved" | "closed";
    startTransition(async () => {
      await updateSupportTicketStatusAction(ticketId, newStatus);
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "in_progress":
        return "bg-sky-50 text-sky-800 border-sky-200";
      case "resolved":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "closed":
        return "bg-zinc-100 text-zinc-600 border-zinc-200";
      default:
        return "bg-zinc-100 text-zinc-700 border-zinc-200";
    }
  };

  return (
    <div className="relative inline-block">
      <select
        value={currentStatus}
        onChange={handleChange}
        disabled={isPending}
        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border appearance-none pr-7 cursor-pointer focus:outline-none focus:ring-1 focus:ring-zinc-950 transition-all ${getStatusColor(
          currentStatus,
        )} ${isPending ? "opacity-60" : ""}`}
      >
        <option value="open">Open</option>
        <option value="in_progress">In Progress</option>
        <option value="resolved">Resolved</option>
        <option value="closed">Closed</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-zinc-500">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
