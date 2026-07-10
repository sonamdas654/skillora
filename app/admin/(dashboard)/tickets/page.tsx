import { prisma } from "@/lib/db";
import TicketsManager from "@/components/admin/TicketsManager";

export const metadata = { title: "Tickets", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function TicketsAdminPage() {
  const tickets = await prisma.ticket.findMany({
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
    include: {
      messages: { orderBy: { createdAt: "asc" } },
      lead: { select: { clientName: true } },
    },
  });

  return (
    <TicketsManager
      tickets={tickets.map((t) => ({
        id: t.id,
        email: t.email,
        subject: t.subject,
        status: t.status,
        updatedAt: t.updatedAt.toISOString(),
        clientName: t.lead?.clientName ?? null,
        messages: t.messages.map((m) => ({
          id: m.id,
          sender: m.sender,
          message: m.message,
          date: m.createdAt.toISOString(),
        })),
      }))}
    />
  );
}
