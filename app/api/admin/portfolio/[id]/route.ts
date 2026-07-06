import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

const patchSchema = z.object({
  status: z.enum(["active", "hidden"]).optional(),
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
  if (!parsed.success || !parsed.data.status) {
    return NextResponse.json({ error: "Invalid update" }, { status: 400 });
  }
  const item = await prisma.portfolio.update({ where: { id }, data: { status: parsed.data.status } });
  return NextResponse.json({ ok: true, item });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.portfolio.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
