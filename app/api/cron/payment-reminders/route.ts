import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { notifyPaymentReminderSent, sendPaymentReminderToClient } from "@/lib/notify";

// Daily Vercel cron: gently remind clients about unpaid invoices.
// Rules (deliberately polite, never spammy):
//  - only invoices with balance > 0 whose dueDate has passed
//  - at most one reminder every 5 days per invoice
//  - at most 3 automatic reminders per invoice, then it's the owner's call
// Auth: Vercel sends Authorization: Bearer <CRON_SECRET> automatically.
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const invoices = await prisma.invoice.findMany({
    where: {
      balanceAmount: { gt: 0 },
      status: { in: ["Sent", "Partially Paid", "Overdue"] },
      dueDate: { lt: now },
    },
    include: { lead: { select: { id: true, clientName: true, email: true } } },
  });

  let sent = 0;
  for (const inv of invoices) {
    // Skip if a payment reference is already being verified
    const pendingClaim = await prisma.payment.findFirst({
      where: { invoiceId: inv.id, paymentStatus: "Client claimed" },
    });
    if (pendingClaim) continue;

    const marker = `auto-payment-reminder:${inv.invoiceNumber}`;
    const past = await prisma.followup.findMany({
      where: { leadId: inv.lead.id, message: { startsWith: marker } },
      orderBy: { followupDate: "desc" },
    });
    if (past.length >= 3) continue;
    if (past[0] && now.getTime() - past[0].followupDate.getTime() < 5 * 24 * 60 * 60 * 1000) {
      continue;
    }

    await sendPaymentReminderToClient({
      clientName: inv.lead.clientName,
      email: inv.lead.email,
      invoiceNumber: inv.invoiceNumber,
      invoiceId: inv.id,
      balance: inv.balanceAmount,
      reminderNo: past.length + 1,
    });
    await prisma.followup.create({
      data: {
        leadId: inv.lead.id,
        followupDate: now,
        followupType: "email",
        message: `${marker} (#${past.length + 1} of 3)`,
        status: "Done",
      },
    });
    sent++;
  }

  if (sent > 0) {
    await notifyPaymentReminderSent(sent);
  }
  return NextResponse.json({ ok: true, checked: invoices.length, remindersSent: sent });
}
