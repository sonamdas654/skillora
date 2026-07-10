import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getClientSession } from "@/lib/clientAuth";
import { notifyPaymentClaimed } from "@/lib/notify";

const schema = z.object({
  invoiceId: z.string().min(5),
  reference: z.string().min(4).max(80),
});

// Client submits their UPI/bank transaction reference after paying.
// Creates a "Client claimed" payment that the owner verifies in Admin.
export async function POST(req: NextRequest) {
  const session = await getClientSession();
  if (!session) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please enter the transaction/UTR reference from your payment app." },
      { status: 400 }
    );
  }

  const invoice = await prisma.invoice.findUnique({
    where: { id: parsed.data.invoiceId },
    include: { lead: { select: { id: true, email: true, clientName: true } } },
  });
  if (!invoice || invoice.lead.email.toLowerCase() !== session.email.toLowerCase()) {
    return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
  }
  if (invoice.balanceAmount <= 0) {
    return NextResponse.json({ error: "This invoice is already fully paid." }, { status: 400 });
  }

  const pending = await prisma.payment.findFirst({
    where: { invoiceId: invoice.id, paymentStatus: "Client claimed" },
  });
  if (pending) {
    return NextResponse.json(
      { error: "We already received a reference for this invoice and are verifying it. No need to submit again." },
      { status: 409 }
    );
  }

  const payment = await prisma.payment.create({
    data: {
      leadId: invoice.lead.id,
      invoiceId: invoice.id,
      amount: invoice.balanceAmount,
      paymentType: invoice.paidAmount > 0 ? "final" : "advance",
      paymentStatus: "Client claimed",
      transactionId: parsed.data.reference.trim(),
      paymentDate: new Date(),
    },
  });

  // Serverless rule: must await or the email silently drops on Vercel.
  await notifyPaymentClaimed({
    clientName: invoice.lead.clientName,
    email: invoice.lead.email,
    amount: payment.amount,
    reference: payment.transactionId ?? "",
    invoiceNumber: invoice.invoiceNumber,
  });

  return NextResponse.json({ ok: true });
}
