import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { LEAD_STATUSES } from "@/lib/leadStatus";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      formAnswers: true,
      uploadedFiles: true,
      notes: { orderBy: { createdAt: "desc" }, include: { user: { select: { name: true } } } },
      followups: { orderBy: { followupDate: "asc" } },
    },
  });
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ lead });
}

// Permanently delete a lead (used for spam). Children without FK cascade
// (quotations, invoices, payments, projects) are removed explicitly first.
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.$transaction([
    prisma.payment.deleteMany({ where: { leadId: id } }),
    prisma.invoice.deleteMany({ where: { leadId: id } }),
    prisma.quotation.deleteMany({ where: { leadId: id } }),
    prisma.project.deleteMany({ where: { leadId: id } }),
    // formAnswers/uploadedFiles/notes/followups cascade via FK
    prisma.lead.delete({ where: { id } }),
  ]);
  return NextResponse.json({ ok: true });
}

const patchSchema = z.object({
  leadStatus: z.enum(LEAD_STATUSES).optional(),
  leadScore: z.enum(["High", "Medium", "Low"]).optional(),
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
  if (!parsed.success || (!parsed.data.leadStatus && !parsed.data.leadScore)) {
    return NextResponse.json({ error: "Invalid update" }, { status: 400 });
  }

  const lead = await prisma.lead.update({
    where: { id },
    data: parsed.data,
  });
  return NextResponse.json({ ok: true, lead });
}
