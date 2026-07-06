import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

const createSchema = z.object({
  leadId: z.string().min(1),
  followupDate: z.string().min(8),
  followupType: z.enum(["whatsapp", "email", "call"]).default("whatsapp"),
  message: z.string().max(2000).optional().or(z.literal("")),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  const d = parsed.data;

  const followup = await prisma.followup.create({
    data: {
      leadId: d.leadId,
      followupDate: new Date(d.followupDate),
      followupType: d.followupType,
      message: d.message || null,
    },
  });
  return NextResponse.json({ ok: true, followup });
}
