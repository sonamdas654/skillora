// Email notifications — plan section 28. Uses Resend HTTP API when
// RESEND_API_KEY is set; otherwise logs to server console (dev mode).
const FROM = process.env.EMAIL_FROM || "Skilloura <onboarding@resend.dev>";
const ADMIN = process.env.ADMIN_EMAIL || "sonamdasdj00@gmail.com";

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
      body: JSON.stringify({ from: FROM, to, subject, html }),
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
}

export async function notifyContactMessage(msg: { name: string; email: string; message: string }) {
  await sendEmail(
    ADMIN,
    `Contact message from ${msg.name}`,
    `<p><b>From:</b> ${msg.name} (${msg.email})</p><p>${msg.message}</p>`
  );
}
