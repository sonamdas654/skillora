import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getClientSession } from "@/lib/clientAuth";
import { notifyQuotationAccepted } from "@/lib/notify";

// Client accepts a quotation → status Accepted, lead moves to payment stage,
// owner gets an email. Ownership is enforced via the session email.
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getClientSession();
  if (!session) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });

  const { id } = await params;
  const quotation = await prisma.quotation.findUnique({
    where: { id },
    include: { lead: { select: { id: true, email: true, clientName: true, leadStatus: true } } },
  });
  if (!quotation || quotation.lead.email.toLowerCase() !== session.email.toLowerCase()) {
    return NextResponse.json({ error: "Quotation not found." }, { status: 404 });
  }
  if (quotation.status === "Accepted") {
    return NextResponse.json({ ok: true, already: true });
  }
  if (quotation.status !== "Sent") {
    return NextResponse.json(
      { error: "This quotation can no longer be accepted. Please contact us." },
      { status: 400 }
    );
  }
  if (quotation.validUntil && quotation.validUntil < new Date()) {
    return NextResponse.json(
      { error: "This quotation has expired. Message us for a refreshed quote." },
      { status: 400 }
    );
  }

  await prisma.$transaction([
    prisma.quotation.update({ where: { id }, data: { status: "Accepted" } }),
    ...(["New", "Reviewed", "Contacted", "Qualified", "Quoted"].includes(quotation.lead.leadStatus)
      ? [
          prisma.lead.update({
            where: { id: quotation.lead.id },
            data: { leadStatus: "Waiting for Payment" },
          }),
        ]
      : []),
  ]);

  // Serverless rule: must await or the email silently drops on Vercel.
  await notifyQuotationAccepted({
    quoteNumber: quotation.quoteNumber,
    quoteAmount: quotation.quoteAmount,
    clientName: quotation.lead.clientName,
    email: quotation.lead.email,
  });

  return NextResponse.json({ ok: true });
}
