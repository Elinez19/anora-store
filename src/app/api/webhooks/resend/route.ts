import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { supportTickets } from "@/db/schema";
import { getResend, sendAdminSupportNotification } from "@/lib/resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface InboundWebhookEvent {
  type: string;
  created_at: string;
  data: {
    email_id?: string;
    from?: string;
    to?: string[] | string;
    bcc?: string[];
    cc?: string[];
    subject?: string;
    attachments?: Array<{
      id: string;
      filename: string;
      content_type: string;
    }>;
  };
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET?.trim();

  // 1. Verify webhook signature if secret is configured
  if (webhookSecret) {
    const svixId =
      req.headers.get("svix-id") || req.headers.get("webhook-id") || "";
    const svixTimestamp =
      req.headers.get("svix-timestamp") ||
      req.headers.get("webhook-timestamp") ||
      "";
    const svixSignature =
      req.headers.get("svix-signature") ||
      req.headers.get("webhook-signature") ||
      "";

    const client = getResend();
    if (client) {
      try {
        client.webhooks.verify({
          payload: rawBody,
          headers: {
            id: svixId,
            timestamp: svixTimestamp,
            signature: svixSignature,
          },
          webhookSecret,
        });
      } catch (err) {
        console.warn("Resend webhook signature verification failed:", err);
        return new NextResponse("Invalid signature", { status: 400 });
      }
    }
  }

  // 2. Parse event payload
  let event: InboundWebhookEvent;
  try {
    event = JSON.parse(rawBody) as InboundWebhookEvent;
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 });
  }

  // 3. Handle email.received (Inbound Email)
  if (event.type === "email.received" && event.data) {
    const emailId = event.data.email_id;
    const from = event.data.from || "unknown@sender.com";
    const to = Array.isArray(event.data.to)
      ? event.data.to.join(", ")
      : event.data.to || "";
    const subject = event.data.subject || "No Subject";

    let textContent = subject;
    let htmlContent: string | null = null;

    // Fetch full email content from Resend Receiving API
    const client = getResend();
    if (client && emailId) {
      try {
        const { data: fullEmail, error } =
          await client.emails.receiving.get(emailId);
        if (error) {
          console.error("Failed to fetch inbound email content:", error);
        } else if (fullEmail) {
          textContent = fullEmail.text || fullEmail.html || subject;
          htmlContent = fullEmail.html || null;
        }
      } catch (err) {
        console.error("Error retrieving inbound email content:", err);
      }
    }

    const ticketNumber = `INB-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      // Store in supportTickets
      await db.insert(supportTickets).values({
        ticketNumber,
        source: "inbound_email",
        fromEmail: from,
        toEmail: to,
        subject,
        message: textContent,
        html: htmlContent,
        category: "inbound_email",
        resendEmailId: emailId ?? null,
        status: "open",
      });

      // Send admin notification
      void sendAdminSupportNotification({
        ticketNumber,
        customerEmail: from,
        subject,
        message: textContent,
        category: "Inbound Email",
        source: "inbound_email",
      }).catch((err) => {
        console.error("Failed to notify admin of inbound email:", err);
      });

      console.info("Processed inbound email successfully:", {
        emailId,
        from,
        ticketNumber,
      });
    } catch (err) {
      console.error("Failed to persist inbound email ticket:", err);
      return new NextResponse("Database error", { status: 500 });
    }

    return NextResponse.json({
      received: true,
      ticketNumber,
      emailId,
    });
  }

  // Acknowledge other event types (email.sent, email.delivered, email.bounced, etc.)
  return NextResponse.json({ received: true, type: event.type });
}
