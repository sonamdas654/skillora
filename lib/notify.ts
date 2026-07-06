// Email notifications — plan section 28. Uses Resend HTTP API when
// RESEND_API_KEY is set; otherwise logs to server console (dev mode).
const FROM = process.env.EMAIL_FROM || "Skillora <onboarding@resend.dev>";
const ADMIN = process.env.ADMIN_EMAIL || "sonamdasdj00@gmail.com";

async function sendEmail(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(`[email:dev] to=${to} subject="${subject}"`);
    return;
  }
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM, to, subject, html }),
    });
  } catch (err) {
    console.error("[email] send failed:", err);
  }
}

export async function notifyNewLead(lead: {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  serviceCategory: string;
  budgetRange: string;
  projectDescription: string;
}) {
  await sendEmail(
    ADMIN,
    `New lead: ${lead.clientName} — ${lead.serviceCategory}`,
    `<h2>New project request</h2>
     <p><b>Name:</b> ${lead.clientName}</p>
     <p><b>Email:</b> ${lead.email}</p>
     <p><b>WhatsApp:</b> ${lead.phone}</p>
     <p><b>Service:</b> ${lead.serviceCategory}</p>
     <p><b>Budget:</b> ${lead.budgetRange}</p>
     <p><b>Description:</b> ${lead.projectDescription}</p>
     <p>Open the admin dashboard to review the full requirement and files.</p>`
  );
}

export async function confirmLeadToClient(lead: { clientName: string; email: string }) {
  await sendEmail(
    lead.email,
    "Your project request is received — Skillora",
    `<h2>Thank you, ${lead.clientName}!</h2>
     <p>Your project request has been received. I will review your details and contact you
     soon on WhatsApp or email — usually within 24 hours.</p>
     <p>— Skillora · Smart Digital Services, Delivered with Skill.</p>`
  );
}

export async function notifyContactMessage(msg: { name: string; email: string; message: string }) {
  await sendEmail(
    ADMIN,
    `Contact message from ${msg.name}`,
    `<p><b>From:</b> ${msg.name} (${msg.email})</p><p>${msg.message}</p>`
  );
}
