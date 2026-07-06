import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { nextNumber } from "@/lib/numbering";

const createSchema = z.object({
  leadId: z.string().min(1),
  totalAmount: z.number().positive(),
  dueDays: z.number().int().min(1).max(90).default(7),
});

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      lead: { select: { clientName: true, serviceCategory: true, email: true } },
      payments: true,
    },
  });
  return NextResponse.json({ invoices });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  const d = parsed.data;

  const lead = await prisma.lead.findUnique({ where: { id: d.leadId } });
  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

  const invoice = await prisma.invoice.create({
    data: {
      leadId: d.leadId,
      invoiceNumber: await nextNumber("invoice"),
      totalAmount: d.totalAmount,
      balanceAmount: d.totalAmount,
      dueDate: new Date(Date.now() + d.dueDays * 24 * 3600 * 1000),
    },
  });

  return NextResponse.json({ ok: true, invoice });
}
