import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { notifyContactMessage } from "@/lib/notify";

const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  phone: z.string().max(20).optional().or(z.literal("")),
  message: z.string().min(5).max(5000),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }
  const d = parsed.data;
  await prisma.contactMessage.create({
    data: { name: d.name, email: d.email, phone: d.phone || null, message: d.message },
  });
  notifyContactMessage(d).catch(() => {});
  return NextResponse.json({ ok: true });
}
