// Email notifications — plan section 28. Uses Resend HTTP API when
// RESEND_API_KEY is set; otherwise logs to server console (dev mode).
const FROM = process.env.EMAIL_FROM || "Skilloura <onboarding@resend.dev>";
// ADMIN_EMAIL can be comma-separated to notify multiple inboxes
// (e.g. "contact@skilloura.com, owner-personal@gmail.com").
const ADMIN = process.env.ADMIN_EMAIL || "contact@skilloura.com";

// Instant WhatsApp ping to the owner via CallMeBot (free). No-ops unless
// CALLMEBOT_PHONE + CALLMEBOT_APIKEY are set. Never throws — an alert
// failure must not break the main flow.
export async function sendOwnerWhatsApp(text: string) {
  const phone = process.env.CALLMEBOT_PHONE;
  const apikey = process.env.CALLMEBOT_APIKEY;
  if (!phone || !apikey) return;
  try {
    await fetch(
      `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&apikey=${encodeURIComponent(apikey)}&text=${encodeURIComponent(text)}`,
      { signal: AbortSignal.timeout(10_000) }
    );
  } catch (err) {
    console.error("[whatsapp-alert] failed:", err);
  }
}

// Instant Telegram ping to the owner. No-ops unless TELEGRAM_BOT_TOKEN +
// TELEGRAM_CHAT_ID are set. Never throws.
export async function sendOwnerTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch (err) {
    console.error("[telegram-alert] failed:", err);
  }
}

// One call → every instant channel the owner has configured.
export async function ownerPing(text: string) {
  await Promise.all([sendOwnerWhatsApp(text), sendOwnerTelegram(text)]);
}

async function sendEmail(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(`[email:dev] to=${to} subject="${subject}"`);
    return;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      // Resend needs an array when there are multiple recipients.
      body: JSON.stringify({
        from: FROM,
        to: to.includes(",") ? to.split(",").map((s) => s.trim()).filter(Boolean) : to,
        subject,
        html,
      }),
    });
    if (!res.ok) {
      console.error(`[email] send rejected (${res.status}):`, await res.text());
    }
  } catch (err) {
    console.error("[email] send failed:", err);
  }
}

type LeadEmailData = {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  businessName?: string | null;
  cityCountry?: string | null;
  serviceCategory: string;
  serviceType?: string | null;
  projectDescription: string;
  budgetRange: string;
  deadline?: string | null;
  projectStatus?: string | null;
  preferredContact?: string | null;
  bestTimeToContact?: string | null;
  readyToStart?: string | null;
  advancePaymentComfort?: string | null;
  additionalNotes?: string | null;
  hasDomain?: string | null;
  hasHosting?: string | null;
  needsMaintenance?: string | null;
  leadScore?: string;
};

const NOT_GIVEN = `<em style="color:#94a3b8">Not provided by client</em>`;

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function row(label: string, value?: string | null) {
  const v = value && value.trim() ? esc(value).replace(/\n/g, "<br/>") : NOT_GIVEN;
  return `<tr>
    <td style="padding:6px 14px 6px 0;color:#475569;font-size:13px;vertical-align:top;white-space:nowrap"><b>${esc(label)}</b></td>
    <td style="padding:6px 0;font-size:13px;color:#0f172a">${v}</td>
  </tr>`;
}

function section(title: string, rows: string) {
  return `<h3 style="margin:20px 0 6px;font-size:14px;color:#1a3fd6;border-bottom:1px solid #e4e4e7;padding-bottom:4px">${title}</h3>
  <table cellpadding="0" cellspacing="0" style="width:100%">${rows}</table>`;
}

// Full lead notification — every field the form collects, with an explicit
// "Not provided by client" marker for anything left empty, plus every
// service-specific question the client answered.
export async function notifyNewLead(
  lead: LeadEmailData,
  answers: { question: string; answer: string }[] = []
) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.skilloura.com";
  const html = `
    <h2 style="margin:0 0 4px">New project request</h2>
    <p style="margin:0 0 8px;color:#475569;font-size:13px">
      Lead score: <b>${esc(lead.leadScore ?? "—")}</b> · ${esc(lead.serviceCategory)}
    </p>
    ${section(
      "Client details",
      row("Name", lead.clientName) +
        row("Email", lead.email) +
        row("WhatsApp", lead.phone) +
        row("Business name", lead.businessName) +
        row("City / Country", lead.cityCountry)
    )}
    ${section(
      "Project",
      row("Service", lead.serviceCategory) +
        row("Service type", lead.serviceType) +
        row("Description", lead.projectDescription) +
        row("Budget", lead.budgetRange) +
        row("Deadline", lead.deadline) +
        row("Project status", lead.projectStatus)
    )}
    ${section(
      "Domain / hosting / maintenance",
      row("Has domain", lead.hasDomain) +
        row("Has hosting", lead.hasHosting) +
        row("Needs maintenance", lead.needsMaintenance)
    )}
    ${section(
      "Contact preferences",
      row("Preferred contact", lead.preferredContact) +
        row("Best time to contact", lead.bestTimeToContact) +
        row("Ready to start", lead.readyToStart) +
        row("Advance payment comfort", lead.advancePaymentComfort)
    )}
    ${section("Additional notes", row("Notes", lead.additionalNotes))}
    ${section(
      `Service-specific answers (${answers.length})`,
      answers.length
        ? answers.map((a) => row(a.question, a.answer)).join("")
        : `<tr><td style="padding:6px 0;font-size:13px">${NOT_GIVEN}</td></tr>`
    )}
    <p style="margin:18px 0 0;font-size:12px;color:#475569">
      Files (if the client attached any) are uploaded right after submission — they appear on the lead page.
    </p>
    <p style="margin:8px 0 0">
      <a href="${siteUrl}/admin/leads/${lead.id}" style="color:#2857ff;font-weight:bold;font-size:13px">
        Open lead in admin dashboard →
      </a>
    </p>`;

  await sendEmail(
    ADMIN,
    `New lead: ${lead.clientName} — ${lead.serviceCategory} [${lead.leadScore ?? "Lead"}]`,
    html
  );

  // Instant heads-up on the owner's phone (WhatsApp/Telegram — whichever is configured)
  await ownerPing(
    `🔔 New Skilloura lead!\n${lead.clientName} — ${lead.serviceCategory}${lead.serviceType ? ` (${lead.serviceType})` : ""}\nBudget: ${lead.budgetRange}\nPhone: ${lead.phone}\n${siteUrl}/admin/leads/${lead.id}`
  );
}

export async function confirmLeadToClient(lead: { clientName: string; email: string }) {
  await sendEmail(
    lead.email,
    "Your project request is received — Skilloura",
    `<h2>Thank you, ${lead.clientName}!</h2>
     <p>Your project request has been received. I will review your details and contact you
     soon on WhatsApp or email — usually within 24 hours.</p>
     <p>— Skilloura · Smart Digital Services, Delivered with Skill.</p>`
  );
}

export async function notifyNewReview(review: {
  clientName: string;
  clientBusiness?: string | null;
  rating: number;
  review: string;
}) {
  await sendEmail(
    ADMIN,
    `New client review (${review.rating}★) from ${review.clientName}`,
    `<h2>New review submitted</h2>
     ${section(
       "Review",
       row("Client", review.clientName) +
         row("Business", review.clientBusiness) +
         row("Rating", "★".repeat(review.rating) + ` (${review.rating}/5)`) +
         row("Review", review.review)
     )}
     <p style="font-size:13px;color:#475569">It is saved as <b>Pending</b> — approve it in
     Admin → Testimonials to show it on the homepage.</p>`
  );
  await ownerPing(
    `⭐ New review: ${review.rating}/5 from ${review.clientName}!\nAdmin → Testimonials me approve karo.`
  );
}

export async function sendClientOtp(email: string, code: string) {
  await sendEmail(
    email,
    `${code} is your Skilloura login code`,
    `<h2 style="margin:0 0 8px">Your login code</h2>
     <p style="font-size:32px;font-weight:800;letter-spacing:6px;margin:12px 0;color:#1a3fd6">${esc(code)}</p>
     <p style="font-size:13px;color:#475569">Enter this code on the Skilloura client portal to sign in.
     It expires in <b>10 minutes</b>. If you didn't request it, you can safely ignore this email.</p>`
  );
}

export async function notifyQuotationAccepted(q: {
  quoteNumber: string;
  quoteAmount: number;
  clientName: string;
  email: string;
}) {
  await sendEmail(
    ADMIN,
    `Quotation ${q.quoteNumber} ACCEPTED by ${q.clientName}`,
    `<h2>Quotation accepted 🎉</h2>
     ${section(
       "Details",
       row("Quotation", q.quoteNumber) +
         row("Amount", "₹" + q.quoteAmount.toLocaleString("en-IN")) +
         row("Client", q.clientName) +
         row("Email", q.email)
     )}
     <p style="font-size:13px;color:#475569">Next step: share advance payment details / confirm payment in Admin → Payments.</p>`
  );
  await ownerPing(
    `✅ Quotation ACCEPTED!\n${q.clientName} ne ${q.quoteNumber} accept kiya — ₹${q.quoteAmount.toLocaleString("en-IN")}`
  );
}

export async function notifyPaymentClaimed(p: {
  clientName: string;
  email: string;
  amount: number;
  reference: string;
  invoiceNumber?: string | null;
}) {
  await sendEmail(
    ADMIN,
    `Payment reference submitted by ${p.clientName} — ₹${p.amount.toLocaleString("en-IN")}`,
    `<h2>Client says they paid</h2>
     ${section(
       "Details",
       row("Client", p.clientName) +
         row("Email", p.email) +
         row("Amount", "₹" + p.amount.toLocaleString("en-IN")) +
         row("UPI/Txn reference", p.reference) +
         row("Invoice", p.invoiceNumber)
     )}
     <p style="font-size:13px;color:#475569">Verify the credit in your bank/UPI app, then mark this payment
     as <b>Completed</b> in Admin → the client sees it as confirmed.</p>`
  );
  await ownerPing(
    `💰 Payment claim: ${p.clientName} says paid ₹${p.amount.toLocaleString("en-IN")}${p.invoiceNumber ? ` (${p.invoiceNumber})` : ""}\nRef: ${p.reference}\nBank me check karke Admin me Completed karo.`
  );
}

export async function notifyFilesDelivered(d: {
  clientName: string;
  email: string;
  fileCount: number;
}) {
  await sendEmail(
    d.email,
    `Your project files are ready — Skilloura`,
    `<h2>Hi ${esc(d.clientName)},</h2>
     <p>${d.fileCount} ${d.fileCount === 1 ? "file has" : "files have"} been delivered to your
     client portal. Log in to view and download them:</p>
     <p><a href="https://www.skilloura.com/client/login" style="display:inline-block;background:#2857ff;color:#fff;padding:10px 22px;border-radius:999px;text-decoration:none;font-weight:bold">Open client portal</a></p>
     <p style="font-size:13px;color:#475569">Sign in with this email address — a login code will be sent to you.</p>
     <p>— Skilloura · Smart Digital Services, Delivered with Skill.</p>`
  );
}

export async function notifyNewTicket(t: {
  clientName?: string | null;
  email: string;
  subject: string;
  message: string;
  ticketId: string;
}) {
  await sendEmail(
    ADMIN,
    `Support ticket: ${t.subject}`,
    `<h2>New support ticket</h2>
     ${section(
       "Ticket",
       row("From", t.clientName || t.email) +
         row("Email", t.email) +
         row("Subject", t.subject) +
         row("Message", t.message)
     )}
     <p style="font-size:13px;color:#475569">Reply from Admin → Tickets — the client sees it in
     their portal and gets an email.</p>`
  );
  await ownerPing(`🎫 New support ticket: "${t.subject}"\nFrom: ${t.clientName || t.email}`);
}

export async function notifyTicketReply(t: {
  toClient: boolean;
  email: string;
  subject: string;
  message: string;
}) {
  if (t.toClient) {
    await sendEmail(
      t.email,
      `Reply to your ticket: ${t.subject}`,
      `<h2>You have a reply</h2>
       <p style="white-space:pre-line">${esc(t.message)}</p>
       <p><a href="https://www.skilloura.com/client/login" style="display:inline-block;background:#2857ff;color:#fff;padding:10px 22px;border-radius:999px;text-decoration:none;font-weight:bold">View in portal</a></p>
       <p>— Skilloura</p>`
    );
  } else {
    await sendEmail(
      ADMIN,
      `Client replied: ${t.subject}`,
      `<h2>Client reply on ticket</h2>
       ${section("Reply", row("From", t.email) + row("Message", t.message))}`
    );
  }
}

export async function sendPaymentReminderToClient(p: {
  clientName: string;
  email: string;
  invoiceNumber: string;
  invoiceId: string;
  balance: number;
  reminderNo: number;
}) {
  await sendEmail(
    p.email,
    `Gentle reminder: invoice ${p.invoiceNumber} — Skilloura`,
    `<h2>Hi ${esc(p.clientName)},</h2>
     <p>A friendly reminder that invoice <b>${esc(p.invoiceNumber)}</b> has a pending balance of
     <b>₹${p.balance.toLocaleString("en-IN")}</b>.</p>
     <p>You can pay in under a minute from your client portal (UPI QR / UPI ID):</p>
     <p><a href="https://www.skilloura.com/client/pay/${p.invoiceId}" style="display:inline-block;background:#2857ff;color:#fff;padding:10px 22px;border-radius:999px;text-decoration:none;font-weight:bold">Pay now</a></p>
     <p style="font-size:13px;color:#475569">Already paid? Just submit your transaction reference on the same page and we'll confirm it.
     Any questions — reply to this email or message on WhatsApp.</p>
     <p>— Skilloura</p>`
  );
}

export async function notifyPaymentReminderSent(count: number) {
  await sendEmail(
    ADMIN,
    `Auto payment reminders sent: ${count}`,
    `<p>${count} gentle payment reminder${count === 1 ? "" : "s"} ${count === 1 ? "was" : "were"} emailed to client${count === 1 ? "" : "s"} today for overdue invoices. Details are logged as follow-ups on each lead.</p>`
  );
}

export async function notifyContactMessage(msg: { name: string; email: string; message: string }) {
  await sendEmail(
    ADMIN,
    `Contact message from ${msg.name}`,
    `<p><b>From:</b> ${msg.name} (${msg.email})</p><p>${msg.message}</p>`
  );
}
