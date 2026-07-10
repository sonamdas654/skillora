import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getClientSession } from "@/lib/clientAuth";
import ClientPortalShell from "@/components/client/ClientPortalShell";
import PrintButton from "@/components/client/PrintButton";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Invoice",
  robots: { index: false },
};
export const dynamic = "force-dynamic";

function money(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

function fmtDate(d: Date | null) {
  return d
    ? d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "—";
}

export default async function ClientInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getClientSession();
  if (!session) redirect("/client/login");

  const { id } = await params;
  const inv = await prisma.invoice.findUnique({
    where: { id },
    include: { lead: true, payments: { orderBy: { createdAt: "desc" } } },
  });
  if (!inv || inv.lead.email.toLowerCase() !== session.email.toLowerCase() || inv.status === "Draft") {
    notFound();
  }

  return (
    <ClientPortalShell email={session.email}>
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/client" className="text-sm font-semibold text-accent hover:text-accent-deep">
          ← Back to dashboard
        </Link>
        <div className="flex gap-2">
          <PrintButton />
          {inv.balanceAmount > 0 && (
            <Link
              href={`/client/pay/${inv.id}`}
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-accent-deep transition-colors"
            >
              Pay {money(inv.balanceAmount)}
            </Link>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-3xl border border-line bg-white p-6 sm:p-10 print:border-0 print:p-0">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-6">
          <div>
            <p className="text-2xl font-extrabold tracking-tight text-ink">
              Skill<span className="text-accent">oura</span>.
            </p>
            <p className="mt-1 text-xs text-ink-soft">{site.tagline}</p>
            <p className="text-xs text-ink-soft">{site.email} · www.skilloura.com</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-soft">Invoice</p>
            <p className="text-xl font-bold text-ink">{inv.invoiceNumber}</p>
            <p className="mt-1 text-xs text-ink-soft">Due: {fmtDate(inv.dueDate)}</p>
            <p
              className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${
                inv.status === "Paid"
                  ? "bg-mint/10 text-mint"
                  : "bg-accent-soft text-accent"
              }`}
            >
              {inv.status}
            </p>
          </div>
        </div>

        <div className="grid gap-6 border-b border-line py-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-ink-soft">Billed to</p>
            <p className="mt-1 text-sm font-bold text-ink">{inv.lead.clientName}</p>
            {inv.lead.businessName && (
              <p className="text-sm text-ink-soft">{inv.lead.businessName}</p>
            )}
            <p className="text-sm text-ink-soft">{inv.lead.email}</p>
          </div>
          <div className="sm:text-right">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-soft">Project</p>
            <p className="mt-1 text-sm font-bold text-ink">
              {inv.lead.serviceCategory}
              {inv.lead.serviceType ? ` — ${inv.lead.serviceType}` : ""}
            </p>
          </div>
        </div>

        <div className="space-y-3 py-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-soft">Total amount</span>
            <span className="font-bold text-ink">{money(inv.totalAmount)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-soft">Paid</span>
            <span className="font-bold text-mint">{money(inv.paidAmount)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-line pt-3 text-base">
            <span className="font-bold text-ink">Balance due</span>
            <span className="font-extrabold text-ink">{money(inv.balanceAmount)}</span>
          </div>
        </div>

        {inv.payments.length > 0 && (
          <div className="border-t border-line pt-5">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-soft">
              Payment history
            </p>
            <div className="mt-2 space-y-1.5">
              {inv.payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <span className="text-ink-soft">
                    {fmtDate(p.paymentDate ?? p.createdAt)}
                    {p.paymentType ? ` · ${p.paymentType}` : ""}
                  </span>
                  <span className="font-semibold text-ink">
                    {money(p.amount)}{" "}
                    <span
                      className={
                        p.paymentStatus === "Completed" ? "text-mint" : "text-amber-600"
                      }
                    >
                      ({p.paymentStatus === "Completed" ? "confirmed" : "verifying"})
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="mt-8 border-t border-line pt-4 text-[11px] leading-4 text-ink-soft">
          Payment terms: project starts after advance payment; final delivery after full payment.
          Domain, hosting and third-party costs are separate unless listed. Refunds follow the
          refund policy at www.skilloura.com/refund-policy.
        </p>
      </div>
    </ClientPortalShell>
  );
}
