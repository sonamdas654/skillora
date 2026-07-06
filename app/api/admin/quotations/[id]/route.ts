import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

const patchSchema = z.object({
  status: z.enum(["Draft", "Sent", "Accepted", "Rejected", "Expired"]),
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

  const quotation = await prisma.quotation.update({
    where: { id },
    data: { status: parsed.data.status },
  });

  if (parsed.data.status === "Accepted") {
    await prisma.lead.update({
      where: { id: quotation.leadId },
      data: { leadStatus: "Waiting for Payment" },
    });
  }

  return NextResponse.json({ ok: true, quotation });
}
