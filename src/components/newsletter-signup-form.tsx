"use client";

import { useActionState } from "react";
import { subscribeToNewsletter, type NewsletterState } from "@/lib/newsletter";

export function NewsletterSignupForm() {
  const [state, formAction, isPending] = useActionState<NewsletterState, FormData>(
    subscribeToNewsletter,
    {},
  );

  return (
    <div className="mt-6">
      {state.success ? (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-xs font-medium text-emerald-800 flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{state.message}</span>
        </div>
      ) : (
        <form className="flex flex-col sm:flex-row gap-3" action={formAction}>
          <div className="flex-1 relative">
            <input
              id="newsletter-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={isPending}
              placeholder="Enter your email address"
              className="w-full rounded-md border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none disabled:opacity-60 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-neutral-950 px-6 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-neutral-800 disabled:bg-neutral-600 transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            {isPending ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Subscribing...</span>
              </>
            ) : (
              <span>Subscribe</span>
            )}
          </button>
        </form>
      )}

      {state.error ? (
        <p className="mt-2 text-xs text-rose-600 font-medium">
          {state.error}
        </p>
      ) : null}
    </div>
  );
}
