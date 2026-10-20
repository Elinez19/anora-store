"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
  supportReplies,
  supportTickets,
} from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import {
  sendAdminSupportNotification,
  sendEmail,
  sendSupportCustomerReceipt,
  sendSupportReplyEmail,
  sendBroadcastCampaign,
} from "@/lib/resend";
import { renderMarketingBroadcastEmail } from "@/lib/email-templates";

export type ContactFormState = {
  success?: boolean;
  ticketNumber?: string;
  message?: string;
  error?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Public Server Action for customer contact/support submissions.
 */
export async function submitContactFormAction(
  prevState: ContactFormState | null,
  formData: FormData,
): Promise<ContactFormState> {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const category = (formData.get("category") as string)?.trim() || "general";
  const orderNumber = (formData.get("orderNumber") as string)?.trim();
  const subject = (formData.get("subject") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();

  if (!email || !EMAIL_PATTERN.test(email)) {
    return { error: "Please provide a valid email address." };
  }
  if (!name || name.length < 2) {
    return { error: "Please enter your full name." };
  }
  if (!subject || subject.length < 3) {
    return { error: "Please enter a subject line." };
  }
  if (!message || message.length < 10) {
    return {
      error: "Please enter a detailed message (at least 10 characters).",
    };
  }

  const ticketNumber = `TICK-${Math.floor(100000 + Math.random() * 900000)}`;

  try {
    // 1. Persist ticket to database
    await db.insert(supportTickets).values({
      ticketNumber,
      source: "contact_form",
      fromEmail: email,
      fromName: name,
      category,
      orderNumber: orderNumber || null,
      subject,
      message,
      status: "open",
    });

    // 2. Send receipt confirmation to customer via Resend
    void sendSupportCustomerReceipt({
      ticketNumber,
      to: email,
      name,
      subject,
      message,
    }).catch((err) => {
      console.error("Failed to send customer support receipt:", err);
    });

    // 3. Send alert to support team / admin
    void sendAdminSupportNotification({
      ticketNumber,
      customerName: name,
      customerEmail: email,
      category,
      orderNumber: orderNumber || undefined,
      subject,
      message,
      source: "contact_form",
    }).catch((err) => {
      console.error("Failed to notify admin about support ticket:", err);
    });

    return {
      success: true,
      ticketNumber,
      message: `Your support request has been logged as #${ticketNumber}. We have sent a confirmation email to ${email}.`,
    };
  } catch (error) {
    console.error("Failed to submit contact form:", error);
    return {
      error:
        "An unexpected error occurred while submitting your ticket. Please try again.",
    };
  }
}

/**
 * Admin action: Send email reply to a customer support ticket.
 */
export async function replyToSupportTicketAction(
  ticketId: string,
  replyMessage: string,
): Promise<{ success?: boolean; error?: string }> {
  const admin = await requireAdmin();

  if (!ticketId) return { error: "Ticket ID is required." };
  const trimmed = replyMessage?.trim();
  if (!trimmed) return { error: "Reply message cannot be empty." };

  try {
    const [ticket] = await db
      .select()
      .from(supportTickets)
      .where(eq(supportTickets.id, ticketId))
      .limit(1);

    if (!ticket) return { error: "Support ticket not found." };

    // 1. Send reply email via Resend
    const resendResult = await sendSupportReplyEmail({
      ticketNumber: ticket.ticketNumber,
      to: ticket.fromEmail,
      customerName: ticket.fromName ?? undefined,
      replyMessage: trimmed,
      subject: ticket.subject,
    });

    // 2. Record reply in database
    await db.insert(supportReplies).values({
      ticketId,
      senderRole: "admin",
      senderEmail: admin.email,
      message: trimmed,
      resendEmailId: resendResult.id ?? null,
    });

    // 3. Mark ticket as in_progress if open
    if (ticket.status === "open") {
      await db
        .update(supportTickets)
        .set({ status: "in_progress", updatedAt: new Date() })
        .where(eq(supportTickets.id, ticketId));
    }

    revalidatePath("/admin/support");
    revalidatePath(`/admin/support/${ticketId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to reply to support ticket:", error);
    return { error: "Failed to send reply. Please try again." };
  }
}

/**
 * Admin action: Update status of a support ticket.
 */
export async function updateSupportTicketStatusAction(
  ticketId: string,
  status: "open" | "in_progress" | "resolved" | "closed",
): Promise<{ success?: boolean; error?: string }> {
  await requireAdmin();

  try {
    await db
      .update(supportTickets)
      .set({ status, updatedAt: new Date() })
      .where(eq(supportTickets.id, ticketId));

    revalidatePath("/admin/support");
    revalidatePath(`/admin/support/${ticketId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update ticket status:", error);
    return { error: "Database error updating ticket status." };
  }
}

/**
 * Admin action: Send or draft a marketing campaign via Resend Broadcasts.
 */
export async function createBroadcastCampaignAction(formData: FormData): Promise<{
  success?: boolean;
  id?: string;
  error?: string;
}> {
  await requireAdmin();

  const title = (formData.get("title") as string)?.trim();
  const preheader = (formData.get("preheader") as string)?.trim();
  const headline = (formData.get("headline") as string)?.trim();
  const bodyText = (formData.get("bodyText") as string)?.trim();
  const ctaText = (formData.get("ctaText") as string)?.trim();
  const ctaUrl = (formData.get("ctaUrl") as string)?.trim();
  const segmentId = (formData.get("segmentId") as string)?.trim();
  const isDraft = formData.get("isDraft") === "true";

  if (!title || title.length < 3) {
    return { error: "Please enter an email campaign title/subject." };
  }
  if (!bodyText || bodyText.length < 10) {
    return { error: "Please provide campaign body text." };
  }

  // Format body text with paragraphs
  const bodyHtml = bodyText
    .split("\n\n")
    .map((p) => `<p style="margin: 0 0 16px;">${p.replace(/\n/g, "<br/>")}</p>`)
    .join("");

  const { html, text } = renderMarketingBroadcastEmail({
    title,
    preheader,
    headline,
    bodyHtml,
    ctaText,
    ctaUrl,
  });

  try {
    const res = await sendBroadcastCampaign({
      segmentId,
      subject: title,
      html,
      text,
      sendNow: !isDraft,
    });

    if (res.error) {
      return { error: res.error };
    }

    revalidatePath("/admin/marketing");
    return { success: true, id: res.id };
  } catch (error) {
    console.error("Failed to create marketing broadcast:", error);
    return { error: "Failed to create broadcast campaign." };
  }
}

/**
 * Admin action: Send a test preview of a campaign email to admin
 */
export async function sendTestBroadcastPreviewAction(formData: FormData): Promise<{
  success?: boolean;
  error?: string;
}> {
  const admin = await requireAdmin();

  const testEmail =
    (formData.get("testEmail") as string)?.trim() || admin.email;
  const title = (formData.get("title") as string)?.trim() || "Test Campaign Preview";
  const preheader = (formData.get("preheader") as string)?.trim();
  const headline = (formData.get("headline") as string)?.trim();
  const bodyText = (formData.get("bodyText") as string)?.trim() || "Sample campaign message";
  const ctaText = (formData.get("ctaText") as string)?.trim();
  const ctaUrl = (formData.get("ctaUrl") as string)?.trim();

  const bodyHtml = bodyText
    .split("\n\n")
    .map((p) => `<p style="margin: 0 0 16px;">${p.replace(/\n/g, "<br/>")}</p>`)
    .join("");

  const { html, text } = renderMarketingBroadcastEmail({
    title: `[TEST PREVIEW] ${title}`,
    preheader,
    headline,
    bodyHtml,
    ctaText,
    ctaUrl,
  });

  try {
    const res = await sendEmail({
      to: testEmail,
      subject: `[TEST PREVIEW] ${title}`,
      html,
      text,
    });

    if (res.error) return { error: res.error };
    return { success: true };
  } catch {
    return { error: "Failed to send test email." };
  }
}
