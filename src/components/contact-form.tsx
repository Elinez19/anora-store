"use client";

import { useActionState } from "react";
import { submitContactFormAction, type ContactFormState } from "@/lib/support-actions";

export function ContactForm() {
  const [state, formAction, isPending] = useActionState<ContactFormState, FormData>(
    submitContactFormAction,
    {},
  );

  if (state.success) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-8 text-center sm:p-10">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
          <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-emerald-950">
          Support Request Received
        </h3>
        <p className="mt-2 text-xs text-emerald-800 leading-relaxed max-w-md mx-auto">
          {state.message}
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 border border-emerald-200 text-xs font-mono text-emerald-900 shadow-xs">
          <span>Ticket Reference:</span>
          <strong className="font-bold">{state.ticketNumber}</strong>
        </div>
        <p className="mt-6 text-2xs text-emerald-700">
          A confirmation with tracking information has been delivered to your email.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {state.error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-4 text-xs font-medium text-rose-800 flex items-start gap-2.5">
          <svg className="size-4 text-rose-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{state.error}</span>
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-xs font-semibold text-neutral-900 mb-1.5">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            disabled={isPending}
            placeholder="e.g. Elijah Ndenwa"
            className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-neutral-900 mb-1.5">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            disabled={isPending}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 focus:outline-none transition-colors"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="block text-xs font-semibold text-neutral-900 mb-1.5">
            Topic & Inquiry Type
          </label>
          <select
            id="category"
            name="category"
            disabled={isPending}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-900 focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 focus:outline-none transition-colors"
            defaultValue="order_status"
          >
            <option value="order_status">Order Status & Tracking</option>
            <option value="product_specs">Hardware Specifications & Compatibility</option>
            <option value="warranty_repair">128-Day Warranty & Repairs</option>
            <option value="corporate_orders">Corporate & Bulk Procurement</option>
            <option value="general">General Inquiries</option>
          </select>
        </div>

        <div>
          <label htmlFor="orderNumber" className="block text-xs font-semibold text-neutral-900 mb-1.5">
            Order Reference (Optional)
          </label>
          <input
            id="orderNumber"
            name="orderNumber"
            type="text"
            disabled={isPending}
            placeholder="e.g. chk_... or receipt number"
            className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 focus:outline-none font-mono transition-colors"
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-xs font-semibold text-neutral-900 mb-1.5">
          Subject <span className="text-rose-500">*</span>
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          disabled={isPending}
          placeholder="Brief summary of your inquiry"
          className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 focus:outline-none transition-colors"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-xs font-semibold text-neutral-900 mb-1.5">
          Message <span className="text-rose-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          disabled={isPending}
          placeholder="Please describe your question or issue in detail..."
          className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 focus:outline-none transition-colors leading-relaxed"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-neutral-950 px-6 py-3.5 text-xs font-semibold text-white shadow-md hover:bg-neutral-800 disabled:bg-neutral-600 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        {isPending ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Submitting Ticket...</span>
          </>
        ) : (
          <span>Send Support Request</span>
        )}
      </button>
    </form>
  );
}
