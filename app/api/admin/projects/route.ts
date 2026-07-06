import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

const createSchema = z.object({
  leadId: z.string().min(1),
  projectName: z.string().min(2).max(200),
  expectedDeliveryDate: z.string().max(30).optional().or(z.literal("")),
});

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { lead: { select: { clientName: true, serviceCategory: true } } },
  });
  return NextResponse.json({ projects });
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

  const project = await prisma.project.create({
    data: {
      leadId: d.leadId,
      projectName: d.projectName,
      serviceType: lead.serviceCategory,
      startDate: new Date(),
      expectedDeliveryDate: d.expectedDeliveryDate ? new Date(d.expectedDeliveryDate) : null,
    },
  });
  return NextResponse.json({ ok: true, project });
}
