import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { nextNumber } from "@/lib/numbering";

const createSchema = z.object({
  leadId: z.string().min(1),
  quoteAmount: z.number().positive(),
  scope: z.string().min(5).max(10000),
  timeline: z.string().max(200).optional().or(z.literal("")),
  validDays: z.number().int().min(1).max(90).default(15),
});

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const quotations = await prisma.quotation.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { lead: { select: { clientName: true, serviceCategory: true } } },
  });
  return NextResponse.json({ quotations });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }
  const d = parsed.data;

  const lead = await prisma.lead.findUnique({ where: { id: d.leadId } });
  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

  const quotation = await prisma.quotation.create({
    data: {
      leadId: d.leadId,
      quoteNumber: await nextNumber("quotation"),
      quoteAmount: d.quoteAmount,
      scope: d.scope,
      timeline: d.timeline || null,
      validUntil: new Date(Date.now() + d.validDays * 24 * 3600 * 1000),
    },
  });

  await prisma.lead.update({ where: { id: d.leadId }, data: { leadStatus: "Quoted" } });

  return NextResponse.json({ ok: true, quotation });
}
