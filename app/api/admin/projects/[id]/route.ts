import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { PROJECT_STATUSES } from "@/lib/projectStatus";

const patchSchema = z.object({
  status: z.enum(PROJECT_STATUSES),
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
  if (!parsed.success) return NextResponse.json({ error: "Invalid status" }, { status: 400 });

  const data: { status: string; finalDeliveryDate?: Date } = { status: parsed.data.status };
  if (parsed.data.status === "Delivered") data.finalDeliveryDate = new Date();

  const project = await prisma.project.update({ where: { id }, data });

  if (parsed.data.status === "Delivered") {
    await prisma.lead.update({
      where: { id: project.leadId },
      data: { leadStatus: "Delivered" },
    });
  }

  return NextResponse.json({ ok: true, project });
}
