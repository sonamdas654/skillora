import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getClientSession } from "@/lib/clientAuth";
import ClientPortalShell from "@/components/client/ClientPortalShell";
import TicketReplyForm from "@/components/client/TicketReplyForm";

export const metadata: Metadata = {
  title: "Ticket",
  robots: { index: false },
};
export const dynamic = "force-dynamic";

export default async function ClientTicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getClientSession();
  if (!session) redirect("/client/login");

  const { id } = await params;
  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });
  if (!ticket || ticket.email.toLowerCase() !== session.email.toLowerCase()) notFound();

  return (
    <ClientPortalShell email={session.email}>
      <Link href="/client/support" className="text-sm font-semibold text-accent hover:text-accent-deep">
        ← All tickets
      </Link>

      <div className="mt-4 rounded-3xl border border-line bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-xl font-bold text-ink">{ticket.subject}</h1>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              ticket.status === "Closed"
                ? "bg-black/[0.05] text-ink-soft"
                : ticket.status === "Replied"
                  ? "bg-accent-soft text-accent"
                  : "bg-amber-50 text-amber-600"
            }`}
          >
            {ticket.status}
          </span>
        </div>

        <div className="mt-6 space-y-3">
          {ticket.messages.map((m) => (
            <div
              key={m.id}
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                m.sender === "client"
                  ? "ml-auto rounded-tr-sm bg-accent-soft"
                  : "rounded-tl-sm border border-line bg-background"
              }`}
            >
              <p className="text-xs font-bold text-ink-soft">
                {m.sender === "client" ? "You" : "Skilloura"} ·{" "}
                {m.createdAt.toLocaleString("en-IN", {
                  day: "numeric",
                  month: "short",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
              <p className="mt-1 whitespace-pre-line text-sm leading-6 text-ink">{m.message}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-line pt-6">
          {ticket.status === "Closed" ? (
            <p className="text-sm text-ink-soft">
              This ticket is closed.{" "}
              <Link href="/client/support" className="font-semibold text-accent">
                Open a new one
              </Link>{" "}
              if you need more help.
            </p>
          ) : (
            <TicketReplyForm ticketId={ticket.id} />
          )}
        </div>
      </div>
    </ClientPortalShell>
  );
}
