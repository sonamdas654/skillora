import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getClientSession } from "@/lib/clientAuth";
import { notifyTicketReply } from "@/lib/notify";

const schema = z.object({ message: z.string().min(2).max(4000) });

// Client adds a reply to their own ticket.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getClientSession();
  if (!session) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Please write a message." }, { status: 400 });

  const { id } = await params;
  const ticket = await prisma.ticket.findUnique({ where: { id } });
  if (!ticket || ticket.email.toLowerCase() !== session.email.toLowerCase()) {
    return NextResponse.json({ error: "Ticket not found." }, { status: 404 });
  }
  if (ticket.status === "Closed") {
    return NextResponse.json(
      { error: "This ticket is closed. Open a new one if you need more help." },
      { status: 400 }
    );
  }

  await prisma.$transaction([
    prisma.ticketMessage.create({
      data: { ticketId: id, sender: "client", message: parsed.data.message.trim() },
    }),
    prisma.ticket.update({ where: { id }, data: { status: "Open" } }),
  ]);

  // Serverless rule: must await or the email silently drops on Vercel.
  await notifyTicketReply({
    toClient: false,
    email: session.email,
    subject: ticket.subject,
    message: parsed.data.message.trim(),
  });

  return NextResponse.json({ ok: true });
}
