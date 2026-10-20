import "server-only";

import { Resend } from "resend";
import {
  renderAdminSupportAlertEmail,
  renderEmailVerificationEmail,
  renderOrderConfirmationEmail,
  renderPasswordResetEmail,
  renderSupportCustomerReceiptEmail,
  renderSupportReplyEmail,
} from "./email-templates";

let resendInstance: Resend | null = null;
let warnedNoApiKey = false;

/**
 * Returns the lazily initialized Resend client, or null if API key is not configured.
 */
export function getResend(): Resend | null {
  if (resendInstance) return resendInstance;

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    if (!warnedNoApiKey) {
      console.warn(
        "⚠️ RESEND_API_KEY is not set. Email delivery will be simulated in development. Add RESEND_API_KEY to your .env file.",
      );
      warnedNoApiKey = true;
    }
    return null;
  }

  resendInstance = new Resend(apiKey);
  return resendInstance;
}

/**
 * Get verified sender email address.
 * Resend provides 'onboarding@resend.dev' for sandbox/testing before a custom domain is verified.
 */
export function getFromEmail(): string {
  return (
    process.env.RESEND_FROM_EMAIL?.trim() ||
    "Anoraa Store <onboarding@resend.dev>"
  );
}

/**
 * Get the designated support/admin inbox address.
 */
export function getSupportEmail(): string {
  const customSupport = process.env.CONTACT_SUPPORT_EMAIL?.trim();
  if (customSupport) return customSupport;

  const adminList = process.env.ADMIN_EMAILS?.split(",")[0]?.trim();
  if (adminList) return adminList;

  return "support@anoraastore.com";
}

/**
 * Generic email sender using Resend.
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
  tags,
}: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string | string[];
  tags?: Array<{ name: string; value: string }>;
}): Promise<{ id?: string; error?: string | null }> {
  const client = getResend();
  const recipientList = Array.isArray(to) ? to : [to];

  if (!client) {
    console.info(
      `[Resend Simulation] Email to ${recipientList.join(", ")}: "${subject}" (RESEND_API_KEY not configured)`,
    );
    return { id: `sim_${Date.now()}` };
  }

  try {
    const { data, error } = await client.emails.send({
      from: getFromEmail(),
      to: recipientList,
      subject,
      html,
      text,
      replyTo,
      tags,
    });

    if (error) {
      console.error("Resend API error:", error);
      return { error: error.message };
    }

    return { id: data?.id };
  } catch (err) {
    console.error("Failed to send email via Resend:", err);
    return {
      error: err instanceof Error ? err.message : "Unknown email error",
    };
  }
}

/**
 * Send order confirmation receipt to customer
 */
export async function sendOrderReceiptEmail(params: {
  orderId: string;
  customerName?: string;
  email: string;
  items: Array<{
    name: string;
    colour?: string;
    quantity: number;
    unitPriceFormatted: string;
    lineTotalFormatted: string;
    imageUrl?: string | null;
  }>;
  totalFormatted: string;
  viewOrderUrl?: string;
}) {
  const { html, text, subject } = renderOrderConfirmationEmail(params);
  return sendEmail({
    to: params.email,
    subject,
    html,
    text,
    tags: [
      { name: "category", value: "order_confirmation" },
      { name: "order_id", value: params.orderId },
    ],
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(params: {
  email: string;
  name?: string;
  url: string;
}) {
  const { html, text, subject } = renderPasswordResetEmail(params);
  return sendEmail({
    to: params.email,
    subject,
    html,
    text,
    tags: [{ name: "category", value: "password_reset" }],
  });
}

/**
 * Send account verification email
 */
export async function sendEmailVerificationEmail(params: {
  email: string;
  name?: string;
  url: string;
}) {
  const { html, text, subject } = renderEmailVerificationEmail(params);
  return sendEmail({
    to: params.email,
    subject,
    html,
    text,
    tags: [{ name: "category", value: "email_verification" }],
  });
}

/**
 * Send support request confirmation to customer
 */
export async function sendSupportCustomerReceipt(params: {
  ticketNumber: string;
  to: string;
  name?: string;
  subject: string;
  message: string;
}) {
  const { html, text, subject } = renderSupportCustomerReceiptEmail({
    ticketNumber: params.ticketNumber,
    customerName: params.name,
    subject: params.subject,
    message: params.message,
  });

  return sendEmail({
    to: params.to,
    subject,
    html,
    text,
    replyTo: getSupportEmail(),
    tags: [
      { name: "category", value: "support_receipt" },
      { name: "ticket_number", value: params.ticketNumber },
    ],
  });
}

/**
 * Send alert to admin about a new support ticket or inbound email
 */
export async function sendAdminSupportNotification(params: {
  ticketNumber: string;
  customerName?: string;
  customerEmail: string;
  subject: string;
  message: string;
  category?: string;
  orderNumber?: string;
  source?: string;
}) {
  const { html, text, subject } = renderAdminSupportAlertEmail(params);
  const supportEmail = getSupportEmail();

  return sendEmail({
    to: supportEmail,
    subject,
    html,
    text,
    replyTo: params.customerEmail, // Crucial: admin can hit Reply in their email client
    tags: [
      { name: "category", value: "admin_support_alert" },
      { name: "ticket_number", value: params.ticketNumber },
    ],
  });
}

/**
 * Send admin reply to customer support ticket
 */
export async function sendSupportReplyEmail(params: {
  ticketNumber: string;
  to: string;
  customerName?: string;
  replyMessage: string;
  subject: string;
}) {
  const { html, text, subject } = renderSupportReplyEmail({
    ticketNumber: params.ticketNumber,
    customerName: params.customerName,
    replyMessage: params.replyMessage,
    subject: params.subject,
  });

  return sendEmail({
    to: params.to,
    subject,
    html,
    text,
    replyTo: getSupportEmail(),
    tags: [
      { name: "category", value: "support_reply" },
      { name: "ticket_number", value: params.ticketNumber },
    ],
  });
}

/**
 * Marketing: Add contact to Resend global audience / contacts list
 */
export async function addNewsletterContact({
  email,
  firstName,
  lastName,
}: {
  email: string;
  firstName?: string;
  lastName?: string;
}): Promise<{ id?: string; error?: string | null }> {
  const client = getResend();
  if (!client) {
    console.info(`[Resend Simulation] Added contact ${email}`);
    return { id: `sim_contact_${Date.now()}` };
  }

  try {
    const { data, error } = await client.contacts.create({
      email,
      firstName,
      lastName,
      unsubscribed: false,
    });

    if (error) {
      console.warn("Resend contacts.create notice:", error);
      return { error: error.message };
    }

    return { id: data?.id };
  } catch (err) {
    console.error("Failed to add Resend contact:", err);
    return {
      error: err instanceof Error ? err.message : "Failed to add contact",
    };
  }
}

/**
 * Marketing: Create or send a broadcast campaign
 */
export async function sendBroadcastCampaign({
  segmentId,
  subject,
  html,
  text,
  sendNow = true,
}: {
  segmentId?: string;
  subject: string;
  html: string;
  text?: string;
  sendNow?: boolean;
}): Promise<{ id?: string; error?: string | null }> {
  const client = getResend();
  if (!client) {
    console.info(
      `[Resend Simulation] Broadcast: "${subject}" (RESEND_API_KEY not configured)`,
    );
    return { id: `sim_broadcast_${Date.now()}` };
  }

  try {
    const targetSegment =
      segmentId?.trim() || process.env.RESEND_MARKETING_SEGMENT_ID?.trim();

    if (!targetSegment) {
      return {
        error:
          "A target segment ID is required to send a broadcast. Please configure RESEND_MARKETING_SEGMENT_ID or supply a segment ID.",
      };
    }

    const { data, error } = await client.broadcasts.create({
      segmentId: targetSegment,
      from: getFromEmail(),
      subject,
      html,
      text,
      send: sendNow,
    } as unknown as Parameters<typeof client.broadcasts.create>[0]);

    if (error) {
      console.error("Resend broadcasts.create error:", error);
      return { error: error.message };
    }

    return { id: data?.id };
  } catch (err) {
    console.error("Failed to send broadcast via Resend:", err);
    return {
      error: err instanceof Error ? err.message : "Broadcast failed",
    };
  }
}
