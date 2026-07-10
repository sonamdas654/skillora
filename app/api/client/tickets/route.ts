import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getClientSession } from "@/lib/clientAuth";
import { notifyNewTicket } from "@/lib/notify";

const schema = z.object({
  subject: z.string().min(3).max(150),
  message: z.string().min(5).max(4000),
});

// Client opens a support ticket from the portal.
export async function POST(req: NextRequest) {
  const session = await getClientSession();
  if (!session) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please add a subject and describe the issue." },
      { status: 400 }
    );
  }

  // Light rate limit: max 5 open tickets per client.
  const openCount = await prisma.ticket.count({
    where: { email: session.email, status: { not: "Closed" } },
  });
  if (openCount >= 5) {
    return NextResponse.json(
      { error: "You already have several open tickets — we'll reply soon. For anything urgent, message on WhatsApp." },
      { status: 429 }
    );
  }

  const lead = await prisma.lead.findFirst({
    where: { email: { equals: session.email, mode: "insensitive" } },
    orderBy: { createdAt: "desc" },
    select: { id: true, clientName: true },
  });

  const ticket = await prisma.ticket.create({
    data: {
      email: session.email,
      leadId: lead?.id ?? null,
      subject: parsed.data.subject.trim(),
      messages: { create: { sender: "client", message: parsed.data.message.trim() } },
    },
  });

  // Serverless rule: must await or the email silently drops on Vercel.
  await notifyNewTicket({
    clientName: lead?.clientName,
    email: session.email,
    subject: ticket.subject,
    message: parsed.data.message.trim(),
    ticketId: ticket.id,
  });

  return NextResponse.json({ ok: true, ticketId: ticket.id });
}
