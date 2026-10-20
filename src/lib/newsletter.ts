"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";
import { addNewsletterContact } from "@/lib/resend";

/** Pragmatic shape check; the real test is whether the address accepts mail. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** RFC 5321 caps a forward path at 254 characters. */
const MAX_EMAIL_LENGTH = 254;

export type NewsletterState = {
  success?: boolean;
  message?: string;
  error?: string;
};

/**
 * Newsletter signup.
 *
 * Persists the subscriber to the database and syncs to Resend Contacts.
 */
export async function subscribeToNewsletter(
  prevState: NewsletterState | null,
  formData: FormData,
): Promise<NewsletterState> {
  const submitted = formData.get("email");
  if (typeof submitted !== "string") {
    return { error: "Please enter a valid email address." };
  }

  const address = submitted.trim().toLowerCase();
  if (address.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(address)) {
    return { error: "Please enter a valid email address." };
  }

  try {
    // 1. Sync to Resend Contacts API
    const resendResult = await addNewsletterContact({ email: address });

    // 2. Persist to local database
    const existing = await db
      .select({ id: newsletterSubscribers.id, status: newsletterSubscribers.status })
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, address))
      .limit(1);

    if (existing.length > 0) {
      if (existing[0].status === "unsubscribed") {
        await db
          .update(newsletterSubscribers)
          .set({
            status: "subscribed",
            resendContactId: resendResult.id ?? null,
            updatedAt: new Date(),
          })
          .where(eq(newsletterSubscribers.id, existing[0].id));
      }
      return {
        success: true,
        message: "You're all set! You are subscribed to Anoraa updates.",
      };
    }

    await db.insert(newsletterSubscribers).values({
      email: address,
      resendContactId: resendResult.id ?? null,
      status: "subscribed",
    });

    return {
      success: true,
      message: "Thank you for subscribing! Watch your inbox for exclusive drops.",
    };
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return {
      error: "Something went wrong while subscribing. Please try again later.",
    };
  }
}
