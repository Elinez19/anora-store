"use client";

import { useState, useTransition } from "react";
import { replyToSupportTicketAction } from "@/lib/support-actions";

export function SupportReplyForm({
  ticketId,
  customerEmail,
}: {
  ticketId: string;
  customerEmail: string;
}) {
  const [replyText, setReplyText] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setError(null);
    setSuccess(false);

    startTransition(async () => {
      const res = await replyToSupportTicketAction(ticketId, replyText);
      if (res.error) {
        setError(res.error);
      } else {
        setReplyText("");
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
      }
    });
  };

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
        <div>
          <h3 className="text-sm font-bold text-zinc-950">Send Email Reply</h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Delivered directly to <strong className="text-zinc-800 font-mono">{customerEmail}</strong> via Resend.
          </p>
        </div>
        <span className="px-2.5 py-1 text-[11px] font-mono font-bold bg-zinc-100 text-zinc-700 rounded-full border border-zinc-200">
          Resend API
        </span>
      </div>

      {success && (
        <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-medium text-emerald-800 flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Reply sent successfully to customer via Resend!</span>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-medium text-rose-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <textarea
            rows={5}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            disabled={isPending}
            required
            placeholder="Type your response to the customer here. Markdown or plain text will be formatted cleanly in the email..."
            className="w-full rounded-xl border border-zinc-300 bg-zinc-50/50 p-4 text-xs text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 transition-all font-sans leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <p className="text-2xs text-zinc-400">
            Customer will receive an email styled with Anoraa branding and ticket reference.
          </p>
          <button
            type="submit"
            disabled={isPending || !replyText.trim()}
            className="px-5 py-2.5 rounded-xl bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800 disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            {isPending ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Sending...</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>Send Email to Customer</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
