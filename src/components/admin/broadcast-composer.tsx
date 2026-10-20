"use client";

import { useState, useTransition } from "react";
import {
  createBroadcastCampaignAction,
  sendTestBroadcastPreviewAction,
} from "@/lib/support-actions";

export function BroadcastComposer({
  adminEmail,
  defaultSegmentId = "",
}: {
  adminEmail: string;
  defaultSegmentId?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [testPending, setTestPending] = useState(false);

  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formDataState, setFormDataState] = useState({
    title: "",
    preheader: "",
    headline: "",
    bodyText: "",
    ctaText: "Explore Collection",
    ctaUrl: "https://anoraa-store.vercel.app/collections/laptops",
    segmentId: defaultSegmentId,
    testEmail: adminEmail,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormDataState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendTest = async () => {
    if (!formDataState.title || !formDataState.bodyText) {
      setStatusMessage({
        type: "error",
        text: "Please enter a title and message body before sending a test preview.",
      });
      return;
    }

    setTestPending(true);
    setStatusMessage(null);

    const fd = new FormData();
    fd.append("title", formDataState.title);
    fd.append("preheader", formDataState.preheader);
    fd.append("headline", formDataState.headline);
    fd.append("bodyText", formDataState.bodyText);
    fd.append("ctaText", formDataState.ctaText);
    fd.append("ctaUrl", formDataState.ctaUrl);
    fd.append("testEmail", formDataState.testEmail);

    try {
      const res = await sendTestBroadcastPreviewAction(fd);
      if (res.error) {
        setStatusMessage({ type: "error", text: res.error });
      } else {
        setStatusMessage({
          type: "success",
          text: `Test preview email delivered to ${formDataState.testEmail}! Check your inbox.`,
        });
      }
    } catch {
      setStatusMessage({ type: "error", text: "Failed to send test email." });
    } finally {
      setTestPending(false);
    }
  };

  const handleBroadcastSubmit = (isDraft: boolean) => {
    setStatusMessage(null);

    startTransition(async () => {
      const fd = new FormData();
      fd.append("title", formDataState.title);
      fd.append("preheader", formDataState.preheader);
      fd.append("headline", formDataState.headline);
      fd.append("bodyText", formDataState.bodyText);
      fd.append("ctaText", formDataState.ctaText);
      fd.append("ctaUrl", formDataState.ctaUrl);
      fd.append("segmentId", formDataState.segmentId);
      fd.append("isDraft", isDraft ? "true" : "false");

      const res = await createBroadcastCampaignAction(fd);
      if (res.error) {
        setStatusMessage({ type: "error", text: res.error });
      } else {
        setStatusMessage({
          type: "success",
          text: isDraft
            ? "Draft broadcast created in Resend dashboard!"
            : "Broadcast campaign dispatched successfully via Resend!",
        });
        if (!isDraft) {
          setFormDataState((prev) => ({
            ...prev,
            title: "",
            preheader: "",
            headline: "",
            bodyText: "",
          }));
        }
      }
    });
  };

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100">
        <div>
          <h2 className="text-base font-bold text-zinc-950">
            Compose Broadcast Campaign
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Send high-converting marketing campaigns and inventory drops to your Resend contact segments.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-zinc-100 text-zinc-800 border border-zinc-200">
          Resend Broadcasts API
        </span>
      </div>

      {statusMessage && (
        <div
          className={`mt-4 p-4 rounded-xl text-xs font-medium border flex items-center gap-2 ${
            statusMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          {statusMessage.type === "success" ? (
            <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-rose-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <div className="mt-6 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-zinc-900 mb-1.5">
              Campaign Subject / Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formDataState.title}
              onChange={handleInputChange}
              placeholder="e.g. ⚡ Flash Drop: Next-Gen AI Smart Glasses & Laptops"
              className="w-full rounded-xl border border-zinc-300 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-zinc-950 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-900 mb-1.5">
              Preheader Snippet (Inbox preview line)
            </label>
            <input
              type="text"
              name="preheader"
              value={formDataState.preheader}
              onChange={handleInputChange}
              placeholder="e.g. Exclusive 15% discount for verified subscribers"
              className="w-full rounded-xl border border-zinc-300 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-zinc-950 focus:outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-zinc-900 mb-1.5">
              Main Headline (Optional)
            </label>
            <input
              type="text"
              name="headline"
              value={formDataState.headline}
              onChange={handleInputChange}
              placeholder="e.g. Engineered For Speed: Precision Ultrabooks"
              className="w-full rounded-xl border border-zinc-300 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-zinc-950 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-900 mb-1.5">
              Target Resend Segment ID
            </label>
            <input
              type="text"
              name="segmentId"
              value={formDataState.segmentId}
              onChange={handleInputChange}
              placeholder="e.g. 78261eea-8f8b-4381-83c6-79fa7120f1cf"
              className="w-full rounded-xl border border-zinc-300 bg-zinc-50/50 px-3.5 py-2.5 text-xs font-mono text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-zinc-950 focus:outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-900 mb-1.5">
            Email Body Content <span className="text-rose-500">*</span>
          </label>
          <textarea
            name="bodyText"
            rows={6}
            value={formDataState.bodyText}
            onChange={handleInputChange}
            placeholder="Type your campaign message here. Separate paragraphs with double newlines. Automatically includes Anoraa luxury branding and required Resend unsubscribe token..."
            className="w-full rounded-xl border border-zinc-300 bg-zinc-50/50 p-3.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-zinc-950 focus:outline-none transition-all leading-relaxed font-sans"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-zinc-900 mb-1.5">
              Call-to-Action Button Label
            </label>
            <input
              type="text"
              name="ctaText"
              value={formDataState.ctaText}
              onChange={handleInputChange}
              placeholder="e.g. Shop Now"
              className="w-full rounded-xl border border-zinc-300 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-zinc-950 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-900 mb-1.5">
              Call-to-Action URL
            </label>
            <input
              type="url"
              name="ctaUrl"
              value={formDataState.ctaUrl}
              onChange={handleInputChange}
              placeholder="https://anoraa-store.vercel.app/collections/laptops"
              className="w-full rounded-xl border border-zinc-300 bg-zinc-50/50 px-3.5 py-2.5 text-xs font-mono text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-zinc-950 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Live Test Preview Strip */}
        <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1">
            <span className="text-2xs font-mono font-bold uppercase text-zinc-500">
              Send Test Preview
            </span>
            <div className="text-xs text-zinc-600 mt-0.5">
              Verify layout and appearance directly in your inbox before broadcasting.
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="email"
              name="testEmail"
              value={formDataState.testEmail}
              onChange={handleInputChange}
              placeholder="test@yourdomain.com"
              className="w-56 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-mono text-zinc-900 focus:border-zinc-950 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleSendTest}
              disabled={testPending || isPending}
              className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold disabled:opacity-50 transition-colors shrink-0 cursor-pointer"
            >
              {testPending ? "Sending Test..." : "Send Test"}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-3 pt-3 border-t border-zinc-100">
          <button
            type="button"
            disabled={isPending || !formDataState.title || !formDataState.bodyText}
            onClick={() => handleBroadcastSubmit(true)}
            className="px-5 py-2.5 rounded-xl border border-zinc-300 hover:bg-zinc-100 text-zinc-800 text-xs font-semibold disabled:opacity-50 transition-all cursor-pointer"
          >
            Save as Draft in Resend
          </button>
          <button
            type="button"
            disabled={isPending || !formDataState.title || !formDataState.bodyText}
            onClick={() => handleBroadcastSubmit(false)}
            className="px-6 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold shadow-md disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isPending ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Dispatching Campaign...</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>Send Broadcast Campaign</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
