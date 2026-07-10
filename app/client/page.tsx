import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getClientSession } from "@/lib/clientAuth";
import ClientPortalShell from "@/components/client/ClientPortalShell";

export const metadata: Metadata = {
  title: "Your Projects",
  robots: { index: false },
};
export const dynamic = "force-dynamic";

// Client-facing view of the pipeline — simplified from internal lead statuses.
const STAGES = [
  "Received",
  "Under review",
  "Quotation sent",
  "Advance payment",
  "In progress",
  "Preview & revision",
  "Delivered",
];

function stageIndex(leadStatus: string): number {
  switch (leadStatus) {
    case "New":
      return 0;
    case "Reviewed":
    case "Contacted":
    case "Qualified":
      return 1;
    case "Quoted":
      return 2;
    case "Waiting for Payment":
      return 3;
    case "In Progress":
      return 4;
    case "Revision":
      return 5;
    case "Delivered":
    case "Closed":
      return 6;
    default:
      return 0;
  }
}

function money(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

function fmtDate(d: Date) {
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

const quoteStatusStyle: Record<string, string> = {
  Sent: "bg-accent-soft text-accent",
  Accepted: "bg-mint/10 text-mint",
  Rejected: "bg-red-50 text-red-500",
  Expired: "bg-black/[0.05] text-ink-soft",
  Draft: "bg-black/[0.05] text-ink-soft",
};

export default async function ClientDashboard() {
  const session = await getClientSession();
  if (!session) redirect("/client/login");

  const leads = await prisma.lead.findMany({
    where: {
      email: { equals: session.email, mode: "insensitive" },
      leadStatus: { notIn: ["Spam", "Rejected"] },
    },
    orderBy: { createdAt: "desc" },
    include: {
      quotations: { orderBy: { createdAt: "desc" } },
      invoices: { orderBy: { createdAt: "desc" } },
      payments: { orderBy: { createdAt: "desc" } },
    },
  });

  return (
    <ClientPortalShell email={session.email}>
      <h1 className="text-2xl font-bold text-ink">
        Your {leads.length === 1 ? "project" : "projects"}
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        Live status, quotations, invoices and payments — all in one place.
      </p>

      {leads.length === 0 && (
        <div className="mt-8 rounded-2xl border border-line bg-white p-8 text-center">
          <p className="text-sm text-ink-soft">
            No projects found for this email yet.{" "}
            <Link href="/start-project" className="font-semibold text-accent">
              Submit a project requirement
            </Link>{" "}
            to get started.
          </p>
        </div>
      )}

      <div className="mt-8 space-y-8">
        {leads.map((lead) => {
          const stage = stageIndex(lead.leadStatus);
          return (
            <div key={lead.id} className="rounded-3xl border border-line bg-white p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-ink">
                    {lead.serviceCategory}
                    {lead.serviceType ? ` — ${lead.serviceType}` : ""}
                  </h2>
                  <p className="mt-1 text-xs text-ink-soft">
                    Submitted {fmtDate(lead.createdAt)}
                  </p>
                </div>
                <span className="rounded-full bg-accent-soft px-3.5 py-1.5 text-xs font-bold text-accent">
                  {STAGES[stage]}
                </span>
              </div>

              {/* Status timeline */}
              <ol className="mt-6 grid grid-cols-4 gap-1.5 sm:grid-cols-7" aria-label="Project progress">
                {STAGES.map((label, i) => (
                  <li key={label}>
                    <div
                      className={`h-1.5 rounded-full ${i <= stage ? "bg-mint" : "bg-line"}`}
                    />
                    <p
                      className={`mt-1.5 text-[10px] font-semibold leading-3 ${
                        i === stage ? "text-ink" : "text-ink-soft/70"
                      }`}
                    >
                      {label}
                    </p>
                  </li>
                ))}
              </ol>

              {/* Quotations */}
              {lead.quotations.filter((q) => q.status !== "Draft").length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                    Quotations
                  </h3>
                  <div className="mt-2 space-y-2">
                    {lead.quotations
                      .filter((q) => q.status !== "Draft")
                      .map((q) => (
                        <Link
                          key={q.id}
                          href={`/client/quotations/${q.id}`}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line px-4 py-3 transition-colors hover:border-accent"
                        >
                          <span className="text-sm font-semibold text-ink">
                            {q.quoteNumber} · {money(q.quoteAmount)}
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                              quoteStatusStyle[q.status] ?? "bg-black/[0.05] text-ink-soft"
                            }`}
                          >
                            {q.status === "Sent" ? "Action needed — review & accept" : q.status}
                          </span>
                        </Link>
                      ))}
                  </div>
                </div>
              )}

              {/* Invoices */}
              {lead.invoices.filter((inv) => inv.status !== "Draft").length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                    Invoices
                  </h3>
                  <div className="mt-2 space-y-2">
                    {lead.invoices
                      .filter((inv) => inv.status !== "Draft")
                      .map((inv) => (
                        <Link
                          key={inv.id}
                          href={`/client/invoices/${inv.id}`}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line px-4 py-3 transition-colors hover:border-accent"
                        >
                          <span className="text-sm font-semibold text-ink">
                            {inv.invoiceNumber} · {money(inv.totalAmount)}
                          </span>
                          <span className="text-xs font-semibold text-ink-soft">
                            Paid {money(inv.paidAmount)} · Balance {money(inv.balanceAmount)}
                            {inv.balanceAmount > 0 && (
                              <span className="ml-2 rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold text-white">
                                Pay now
                              </span>
                            )}
                          </span>
                        </Link>
                      ))}
                  </div>
                </div>
              )}

              {/* Payments */}
              {lead.payments.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                    Payments
                  </h3>
                  <div className="mt-2 space-y-2">
                    {lead.payments.map((p) => (
                      <div
                        key={p.id}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line px-4 py-3"
                      >
                        <span className="text-sm font-semibold text-ink">
                          {money(p.amount)}
                          {p.paymentType ? ` · ${p.paymentType}` : ""}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                            p.paymentStatus === "Completed"
                              ? "bg-mint/10 text-mint"
                              : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          {p.paymentStatus === "Completed"
                            ? "Confirmed ✓"
                            : p.paymentStatus === "Client claimed"
                              ? "Being verified"
                              : p.paymentStatus}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ClientPortalShell>
  );
}
