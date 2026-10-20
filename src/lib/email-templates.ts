/**
 * Responsive, brand-aligned email templates for Anoraa Store.
 * Styled with robust inline CSS compatible across modern & legacy email clients.
 */

interface BaseEmailWrapperOptions {
  title: string;
  preheader?: string;
  content: string;
  showUnsubscribe?: boolean;
}

export function renderEmailWrapper({
  title,
  preheader = "",
  content,
  showUnsubscribe = false,
}: BaseEmailWrapperOptions): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #18181b; }
    table { border-collapse: collapse; }
    a { color: #18181b; text-decoration: underline; }
    .btn:hover { background-color: #27272a !important; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5;">
  ${
    preheader
      ? `<div style="display: none; max-height: 0px; overflow: hidden; mso-hide: all; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">${escapeHtml(
          preheader,
        )}</div>`
      : ""
  }
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f4f5; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e4e4e7; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 40px 24px; background-color: #09090b; text-align: left;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <span style="display: inline-block; padding: 4px 10px; background-color: #27272a; border: 1px solid #3f3f46; border-radius: 6px; font-family: monospace; font-size: 11px; font-weight: 700; color: #fafafa; letter-spacing: 1.5px; text-transform: uppercase;">
                      ANORAA
                    </span>
                    <h1 style="margin: 12px 0 0; font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
                      ${escapeHtml(title)}
                    </h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 36px 40px; font-size: 14px; line-height: 24px; color: #3f3f46;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px 32px; background-color: #fafafa; border-top: 1px solid #f4f4f5; text-align: center; font-size: 12px; color: #a1a1aa; line-height: 18px;">
              <p style="margin: 0 0 8px; font-weight: 600; color: #71717a;">
                Anoraa Tech Store &bull; High-Performance Workstations & Gadgets
              </p>
              <p style="margin: 0 0 12px;">
                Engineered for speed, durability, and next-generation workflow.
              </p>
              ${
                showUnsubscribe
                  ? `<p style="margin: 12px 0 0; font-size: 11px;">
                      You received this email because you subscribed to updates.
                      <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color: #71717a; text-decoration: underline; margin-left: 4px;">Unsubscribe from marketing emails</a>
                    </p>`
                  : ""
              }
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Order Confirmation / Receipt Email
 */
export function renderOrderConfirmationEmail({
  orderId,
  customerName,
  email,
  items,
  totalFormatted,
  viewOrderUrl,
}: {
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
}): { html: string; text: string; subject: string } {
  const subject = `Order Confirmed: #${orderId.slice(0, 8).toUpperCase()} - Anoraa Store`;

  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #f4f4f5;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            ${
              item.imageUrl
                ? `<td width="56" style="padding-right: 14px; vertical-align: top;">
                    <img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(
                    item.name,
                  )}" width="56" height="56" style="border-radius: 8px; object-fit: cover; border: 1px solid #e4e4e7; display: block;" />
                  </td>`
                : ""
            }
            <td style="vertical-align: top;">
              <strong style="color: #18181b; font-size: 14px;">${escapeHtml(
                item.name,
              )}</strong>
              ${
                item.colour
                  ? `<div style="font-size: 12px; color: #71717a; margin-top: 2px;">Color: ${escapeHtml(
                      item.colour,
                    )}</div>`
                  : ""
              }
              <div style="font-size: 12px; color: #71717a; margin-top: 2px;">Qty: ${
                item.quantity
              } &times; ${item.unitPriceFormatted}</div>
            </td>
            <td align="right" style="vertical-align: top; font-weight: 600; color: #18181b; font-size: 14px;">
              ${item.lineTotalFormatted}
            </td>
          </tr>
        </table>
      </td>
    </tr>`,
    )
    .join("");

  const content = `
    <p style="margin-top: 0; font-size: 16px; color: #18181b;">
      Hi ${customerName ? escapeHtml(customerName) : "there"},
    </p>
    <p>
      Thank you for your purchase! We've received your order and our fulfillment team is preparing your hardware for secure, tracked dispatch.
    </p>

    <div style="margin: 24px 0; padding: 18px 20px; background-color: #fafafa; border-radius: 10px; border: 1px solid #f4f4f5;">
      <div style="font-size: 11px; text-transform: uppercase; font-family: monospace; letter-spacing: 1px; color: #71717a;">Order Reference</div>
      <div style="font-size: 16px; font-weight: 700; color: #18181b; margin-top: 4px; font-family: monospace;">#${orderId.toUpperCase()}</div>
      <div style="font-size: 12px; color: #71717a; margin-top: 4px;">Receipt sent to ${escapeHtml(email)}</div>
    </div>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 24px 0;">
      <thead>
        <tr>
          <th align="left" style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #a1a1aa; padding-bottom: 8px;">Items</th>
          <th align="right" style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #a1a1aa; padding-bottom: 8px;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
      <tfoot>
        <tr>
          <td style="padding-top: 16px; font-weight: 700; font-size: 15px; color: #18181b;">Total Charged</td>
          <td align="right" style="padding-top: 16px; font-weight: 800; font-size: 18px; color: #18181b;">${totalFormatted}</td>
        </tr>
      </tfoot>
    </table>

    ${
      viewOrderUrl
        ? `<div style="text-align: center; margin: 32px 0 16px;">
            <a href="${escapeHtml(
              viewOrderUrl,
            )}" class="btn" style="display: inline-block; padding: 12px 28px; background-color: #09090b; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 13px;">
              View Order in Your Account
            </a>
          </div>`
        : ""
    }

    <p style="margin-bottom: 0; font-size: 13px; color: #71717a; line-height: 20px;">
      Questions or special delivery instructions? Simply reply to this email or visit our Support Center.
    </p>
  `;

  const html = renderEmailWrapper({
    title: "Order Confirmed",
    preheader: `We've received your order #${orderId.slice(0, 8).toUpperCase()}. Total: ${totalFormatted}`,
    content,
  });

  const text = `Hi ${customerName || "there"},\n\nThank you for your order!\nOrder Reference: #${orderId.toUpperCase()}\nTotal: ${totalFormatted}\n\nWe are preparing your shipment now.\n\nAnoraa Store`;

  return { html, text, subject };
}

/**
 * Better Auth Password Reset Email
 */
export function renderPasswordResetEmail({
  email,
  name,
  url,
}: {
  email: string;
  name?: string;
  url: string;
}): { html: string; text: string; subject: string } {
  const subject = "Reset your password - Anoraa Store";
  const content = `
    <p style="margin-top: 0; font-size: 15px; color: #18181b;">
      Hi ${name ? escapeHtml(name) : "there"},
    </p>
    <p>
      We received a request to reset the password for your Anoraa account associated with <strong>${escapeHtml(
        email,
      )}</strong>.
    </p>
    <p>
      Click the button below to set a new password. This link is secure and will expire in 1 hour.
    </p>
    <div style="text-align: center; margin: 32px 0;">
      <a href="${escapeHtml(
        url,
      )}" class="btn" style="display: inline-block; padding: 13px 32px; background-color: #09090b; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 13px; letter-spacing: 0.3px;">
        Reset Password
      </a>
    </div>
    <p style="font-size: 12px; color: #71717a; line-height: 18px;">
      If you did not request this change, you can safely ignore this email. Your password will remain unchanged.
    </p>
    <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #f4f4f5; font-size: 11px; color: #a1a1aa; word-break: break-all;">
      Or copy and paste this URL into your browser:<br/>
      <a href="${escapeHtml(url)}" style="color: #71717a;">${escapeHtml(url)}</a>
    </div>
  `;

  const html = renderEmailWrapper({
    title: "Reset Password",
    preheader: "Reset instructions for your Anoraa account",
    content,
  });

  const text = `Hi ${name || "there"},\n\nClick the link below to reset your password:\n${url}\n\nIf you did not request this, please ignore this email.`;
  return { html, text, subject };
}

/**
 * Better Auth Email Verification Email
 */
export function renderEmailVerificationEmail({
  email,
  name,
  url,
}: {
  email: string;
  name?: string;
  url: string;
}): { html: string; text: string; subject: string } {
  const subject = "Verify your email address - Anoraa Store";
  const content = `
    <p style="margin-top: 0; font-size: 15px; color: #18181b;">
      Hi ${name ? escapeHtml(name) : "there"},
    </p>
    <p>
      Welcome to Anoraa Store. Please confirm your email address (<strong>${escapeHtml(
        email,
      )}</strong>) to activate all account features and order tracking.
    </p>
    <div style="text-align: center; margin: 32px 0;">
      <a href="${escapeHtml(
        url,
      )}" class="btn" style="display: inline-block; padding: 13px 32px; background-color: #09090b; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 13px;">
        Verify Email Address
      </a>
    </div>
    <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #f4f4f5; font-size: 11px; color: #a1a1aa; word-break: break-all;">
      Or copy and paste this link:<br/>
      <a href="${escapeHtml(url)}" style="color: #71717a;">${escapeHtml(url)}</a>
    </div>
  `;

  const html = renderEmailWrapper({
    title: "Verify Your Email",
    preheader: "Confirm your email to complete your Anoraa Store registration",
    content,
  });

  const text = `Hi ${name || "there"},\n\nPlease verify your email address by opening this link:\n${url}\n\nWelcome to Anoraa Store!`;
  return { html, text, subject };
}

/**
 * Customer Support Receipt Email (Sent to customer when they submit contact form)
 */
export function renderSupportCustomerReceiptEmail({
  ticketNumber,
  customerName,
  subject,
  message,
}: {
  ticketNumber: string;
  customerName?: string;
  subject: string;
  message: string;
}): { html: string; text: string; subject: string } {
  const emailSubject = `[${ticketNumber}] Request Received: ${subject}`;
  const content = `
    <p style="margin-top: 0; font-size: 15px; color: #18181b;">
      Hi ${customerName ? escapeHtml(customerName) : "there"},
    </p>
    <p>
      Thank you for contacting Anoraa Support. We have received your inquiry and our tech specialists are reviewing it.
    </p>
    <div style="margin: 20px 0; padding: 18px 20px; background-color: #fafafa; border-radius: 10px; border: 1px solid #e4e4e7;">
      <div style="font-size: 11px; text-transform: uppercase; font-family: monospace; letter-spacing: 1px; color: #71717a;">Ticket Number</div>
      <div style="font-size: 16px; font-weight: 700; color: #18181b; margin-top: 2px; font-family: monospace;">${escapeHtml(
        ticketNumber,
      )}</div>
      <div style="margin-top: 12px; font-size: 12px; font-weight: 600; color: #3f3f46;">Subject: ${escapeHtml(
        subject,
      )}</div>
      <div style="margin-top: 8px; font-size: 13px; color: #52525b; white-space: pre-wrap; line-height: 20px;">${escapeHtml(
        message,
      )}</div>
    </div>
    <p style="font-size: 13px; color: #71717a; margin-bottom: 0;">
      Our average response time is under 12 hours. You can reply directly to this email to add more details or attachments.
    </p>
  `;

  const html = renderEmailWrapper({
    title: "Support Request Received",
    preheader: `We've received your inquiry #${ticketNumber}. Our team will respond shortly.`,
    content,
  });

  const text = `Hi ${customerName || "there"},\n\nWe have received your support request #${ticketNumber}.\nSubject: ${subject}\n\nOur team will review your inquiry and get back to you shortly.\n\nAnoraa Store Support`;
  return { html, text, subject: emailSubject };
}

/**
 * Admin Notification Email for New Contact Inquiry / Inbound Email
 */
export function renderAdminSupportAlertEmail({
  ticketNumber,
  customerName,
  customerEmail,
  subject,
  message,
  category,
  orderNumber,
  source = "contact_form",
}: {
  ticketNumber: string;
  customerName?: string;
  customerEmail: string;
  subject: string;
  message: string;
  category?: string;
  orderNumber?: string;
  source?: string;
}): { html: string; text: string; subject: string } {
  const emailSubject = `[Support Alert] ${ticketNumber} - ${subject} (${customerEmail})`;
  const content = `
    <div style="display: inline-block; padding: 4px 10px; background-color: #fef2f2; border: 1px solid #fee2e2; border-radius: 6px; font-size: 12px; font-weight: 600; color: #b91c1c; margin-bottom: 16px;">
      Source: ${source === "inbound_email" ? "Inbound Email" : "Storefront Contact Form"}
    </div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 20px; font-size: 13px;">
      <tr>
        <td width="100" style="color: #71717a; padding: 4px 0;">Customer:</td>
        <td style="color: #18181b; font-weight: 600; padding: 4px 0;">${escapeHtml(
          customerName || "Unknown",
        )} &lt;${escapeHtml(customerEmail)}&gt;</td>
      </tr>
      <tr>
        <td style="color: #71717a; padding: 4px 0;">Category:</td>
        <td style="color: #18181b; padding: 4px 0;">${escapeHtml(
          category || "General",
        )}</td>
      </tr>
      ${
        orderNumber
          ? `<tr>
              <td style="color: #71717a; padding: 4px 0;">Order #:</td>
              <td style="color: #18181b; font-family: monospace; padding: 4px 0;">${escapeHtml(
                orderNumber,
              )}</td>
            </tr>`
          : ""
      }
      <tr>
        <td style="color: #71717a; padding: 4px 0;">Ticket:</td>
        <td style="color: #18181b; font-family: monospace; padding: 4px 0;">${escapeHtml(
          ticketNumber,
        )}</td>
      </tr>
    </table>

    <div style="padding: 16px; background-color: #fafafa; border-radius: 8px; border: 1px solid #e4e4e7; font-size: 14px; line-height: 22px; color: #18181b; white-space: pre-wrap;">${escapeHtml(
      message,
    )}</div>

    <p style="margin-top: 24px; font-size: 12px; color: #71717a;">
      You can reply directly to this notification to email the customer, or manage this ticket in your Admin Control Studio.
    </p>
  `;

  const html = renderEmailWrapper({
    title: "New Customer Inquiry",
    preheader: `Ticket ${ticketNumber} from ${customerEmail}: ${subject}`,
    content,
  });

  const text = `New Support Ticket: ${ticketNumber}\nFrom: ${customerName || ""} <${customerEmail}>\nCategory: ${category || "General"}\nOrder: ${orderNumber || "N/A"}\nSubject: ${subject}\n\n${message}`;
  return { html, text, subject: emailSubject };
}

/**
 * Support Ticket Reply Email (Admin sending response to customer)
 */
export function renderSupportReplyEmail({
  ticketNumber,
  customerName,
  replyMessage,
  subject,
}: {
  ticketNumber: string;
  customerName?: string;
  replyMessage: string;
  subject: string;
}): { html: string; text: string; subject: string } {
  const emailSubject = `Re: [${ticketNumber}] ${subject}`;
  const content = `
    <p style="margin-top: 0; font-size: 15px; color: #18181b;">
      Hi ${customerName ? escapeHtml(customerName) : "there"},
    </p>
    <div style="font-size: 14px; line-height: 24px; color: #27272a; margin: 16px 0; white-space: pre-wrap;">
      ${escapeHtml(replyMessage)}
    </div>
    <div style="margin-top: 32px; padding: 14px 16px; background-color: #fafafa; border-radius: 8px; border: 1px solid #f4f4f5; font-size: 12px; color: #71717a;">
      <div>Ticket Reference: <strong style="color: #18181b; font-family: monospace;">${escapeHtml(
        ticketNumber,
      )}</strong></div>
      <div style="margin-top: 4px;">Reply directly to this email to continue the conversation.</div>
    </div>
  `;

  const html = renderEmailWrapper({
    title: "Anoraa Support Update",
    preheader: `Update regarding ticket #${ticketNumber}`,
    content,
  });

  const text = `Hi ${customerName || "there"},\n\n${replyMessage}\n\n---\nTicket #${ticketNumber}\nAnoraa Store Support`;
  return { html, text, subject: emailSubject };
}

/**
 * Marketing Campaign / Broadcast Template
 */
export function renderMarketingBroadcastEmail({
  title,
  preheader,
  headline,
  bodyHtml,
  ctaText,
  ctaUrl,
}: {
  title: string;
  preheader?: string;
  headline?: string;
  bodyHtml: string;
  ctaText?: string;
  ctaUrl?: string;
}): { html: string; text: string } {
  const content = `
    ${
      headline
        ? `<h2 style="margin-top: 0; font-size: 20px; font-weight: 700; color: #18181b; letter-spacing: -0.5px;">${escapeHtml(
            headline,
          )}</h2>`
        : ""
    }
    <div style="font-size: 14px; line-height: 24px; color: #3f3f46; margin: 16px 0;">
      ${bodyHtml}
    </div>
    ${
      ctaText && ctaUrl
        ? `<div style="text-align: center; margin: 32px 0 20px;">
            <a href="${escapeHtml(
              ctaUrl,
            )}" class="btn" style="display: inline-block; padding: 13px 32px; background-color: #09090b; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 13px; letter-spacing: 0.3px;">
              ${escapeHtml(ctaText)}
            </a>
          </div>`
        : ""
    }
  `;

  const html = renderEmailWrapper({
    title,
    preheader,
    content,
    showUnsubscribe: true,
  });

  const text = `${title}\n\n${headline ? headline + "\n\n" : ""}${bodyHtml.replace(/<[^>]*>/g, "")}\n\n${ctaText ? ctaText + ": " + ctaUrl : ""}`;
  return { html, text };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
