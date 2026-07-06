import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

const schema = z.object({ note: z.string().min(1).max(3000) });

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid note" }, { status: 400 });

  const note = await prisma.note.create({
    data: { leadId: id, userId: session.userId, note: parsed.data.note },
    include: { user: { select: { name: true } } },
  });
  return NextResponse.json({ ok: true, note });
}
