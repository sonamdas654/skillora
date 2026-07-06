import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

const patchSchema = z.object({
  status: z
    .enum(["Draft", "Sent", "Partially Paid", "Paid", "Overdue", "Cancelled"])
    .optional(),
  // record a payment against this invoice
  payment: z
    .object({
      amount: z.number().positive(),
      paymentType: z.enum(["advance", "milestone", "final"]),
      transactionId: z.string().max(120).optional().or(z.literal("")),
    })
    .optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success || (!parsed.data.status && !parsed.data.payment)) {
    return NextResponse.json({ error: "Invalid update" }, { status: 400 });
  }

  const invoice = await prisma.invoice.findUnique({ where: { id } });
  if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (parsed.data.payment) {
    const p = parsed.data.payment;
    const paidAmount = invoice.paidAmount + p.amount;
    if (paidAmount > invoice.totalAmount + 0.01) {
      return NextResponse.json({ error: "Payment exceeds invoice total" }, { status: 400 });
    }
    const balanceAmount = Math.max(0, invoice.totalAmount - paidAmount);

    await prisma.payment.create({
      data: {
        leadId: invoice.leadId,
        invoiceId: invoice.id,
        amount: p.amount,
        paymentType: p.paymentType,
        paymentStatus: "Received",
        transactionId: p.transactionId || null,
        paymentDate: new Date(),
      },
    });

    const updated = await prisma.invoice.update({
      where: { id },
      data: {
        paidAmount,
        balanceAmount,
        status: balanceAmount === 0 ? "Paid" : "Partially Paid",
      },
    });

    // advance/milestone received → work is on; final delivery is marked manually
    await prisma.lead.update({
      where: { id: invoice.leadId },
      data: { leadStatus: "In Progress" },
    });

    return NextResponse.json({ ok: true, invoice: updated });
  }

  const updated = await prisma.invoice.update({
    where: { id },
    data: { status: parsed.data.status },
  });
  return NextResponse.json({ ok: true, invoice: updated });
}
