import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { notifyTicketReply } from "@/lib/notify";

const patchSchema = z.object({ status: z.enum(["Open", "Replied", "Closed"]) });

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

  await prisma.ticket.update({ where: { id }, data: { status: parsed.data.status } });
  return NextResponse.json({ ok: true });
}

const replySchema = z.object({ message: z.string().min(2).max(4000) });

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = replySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Write a reply first" }, { status: 400 });

  const ticket = await prisma.ticket.findUnique({ where: { id } });
  if (!ticket) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.$transaction([
    prisma.ticketMessage.create({
      data: { ticketId: id, sender: "admin", message: parsed.data.message.trim() },
    }),
    prisma.ticket.update({ where: { id }, data: { status: "Replied" } }),
  ]);

  // Serverless rule: must await or the email silently drops on Vercel.
  await notifyTicketReply({
    toClient: true,
    email: ticket.email,
    subject: ticket.subject,
    message: parsed.data.message.trim(),
  });

  return NextResponse.json({ ok: true });
}
