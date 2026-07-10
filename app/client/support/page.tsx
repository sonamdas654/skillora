import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getClientSession } from "@/lib/clientAuth";
import ClientPortalShell from "@/components/client/ClientPortalShell";
import NewTicketForm from "@/components/client/NewTicketForm";

export const metadata: Metadata = {
  title: "Support",
  robots: { index: false },
};
export const dynamic = "force-dynamic";

const statusStyle: Record<string, string> = {
  Open: "bg-amber-50 text-amber-600",
  Replied: "bg-accent-soft text-accent",
  Closed: "bg-black/[0.05] text-ink-soft",
};

export default async function ClientSupportPage() {
  const session = await getClientSession();
  if (!session) redirect("/client/login");

  const tickets = await prisma.ticket.findMany({
    where: { email: { equals: session.email, mode: "insensitive" } },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { messages: true } } },
  });

  return (
    <ClientPortalShell email={session.email}>
      <h1 className="text-2xl font-bold text-ink">Support</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Raise anything about your project — reply within 24 hours. Urgent? Use WhatsApp.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink-soft">
            Your tickets
          </h2>
          {tickets.length === 0 ? (
            <p className="mt-3 rounded-2xl border border-line bg-white p-6 text-sm text-ink-soft">
              No tickets yet. If you need anything, open one on the right →
            </p>
          ) : (
            <div className="mt-3 space-y-2">
              {tickets.map((t) => (
                <Link
                  key={t.id}
                  href={`/client/support/${t.id}`}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-white px-4 py-3.5 transition-colors hover:border-accent"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-ink">
                      {t.subject}
                    </span>
                    <span className="text-xs text-ink-soft">
                      {t._count.messages} message{t._count.messages === 1 ? "" : "s"} · updated{" "}
                      {t.updatedAt.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </span>
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${statusStyle[t.status] ?? statusStyle.Open}`}
                  >
                    {t.status === "Replied" ? "Reply received" : t.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-line bg-white p-6">
          <h2 className="text-base font-bold text-ink">Open a new ticket</h2>
          <div className="mt-4">
            <NewTicketForm />
          </div>
        </div>
      </div>
    </ClientPortalShell>
  );
}
