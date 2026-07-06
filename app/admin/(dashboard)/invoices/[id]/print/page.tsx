import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { site } from "@/lib/site";
import PrintButton from "@/components/admin/PrintButton";

export const metadata = { title: "Invoice", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function InvoicePrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: { lead: true, payments: { orderBy: { createdAt: "asc" } } },
  });
  if (!invoice) notFound();

  return (
    <div className="mx-auto max-w-2xl bg-white print:max-w-none">
      <div className="mb-6 flex justify-end print:hidden">
        <PrintButton />
      </div>

      <div className="rounded-2xl border border-line p-8 print:border-0 print:p-0">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-line pb-6">
          <div>
            <p className="text-2xl font-extrabold text-ink">
              Skillora<span className="text-accent">.</span>
            </p>
            <p className="mt-1 text-xs text-ink-soft">{site.tagline}</p>
            <p className="text-xs text-ink-soft">{site.email} · +91 63701 33101</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-ink">INVOICE</p>
            <p className="mt-1 text-sm font-semibold text-accent">{invoice.invoiceNumber}</p>
            <p className="text-xs text-ink-soft">
              Date: {invoice.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </p>
            {invoice.dueDate && (
              <p className="text-xs text-ink-soft">
                Due: {invoice.dueDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            )}
          </div>
        </div>

        {/* Bill to */}
        <div className="mt-6 grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">Billed to</p>
            <p className="mt-1.5 font-bold text-ink">{invoice.lead.clientName}</p>
            {invoice.lead.businessName && <p className="text-sm text-ink-soft">{invoice.lead.businessName}</p>}
            <p className="text-sm text-ink-soft">{invoice.lead.email}</p>
            <p className="text-sm text-ink-soft">{invoice.lead.phone}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">Status</p>
            <p className="mt-1.5 inline-block rounded-full bg-accent-soft px-3 py-1 text-sm font-bold text-accent">
              {invoice.status}
            </p>
          </div>
        </div>

        {/* Line */}
        <table className="mt-8 w-full text-sm">
          <thead>
            <tr className="border-b-2 border-ink text-left">
              <th className="pb-2 font-bold text-ink">Description</th>
              <th className="pb-2 text-right font-bold text-ink">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-line">
              <td className="py-3 text-ink">
                {invoice.lead.serviceCategory}
                {invoice.lead.serviceType ? ` — ${invoice.lead.serviceType}` : ""}
              </td>
              <td className="py-3 text-right font-semibold text-ink">
                ₹{invoice.totalAmount.toLocaleString("en-IN")}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Totals */}
        <div className="mt-4 ml-auto w-64 space-y-1.5 text-sm">
          <p className="flex justify-between">
            <span className="text-ink-soft">Total</span>
            <span className="font-bold text-ink">₹{invoice.totalAmount.toLocaleString("en-IN")}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-ink-soft">Paid</span>
            <span className="font-semibold text-mint">₹{invoice.paidAmount.toLocaleString("en-IN")}</span>
          </p>
          <p className="flex justify-between border-t border-line pt-1.5">
            <span className="font-bold text-ink">Balance due</span>
            <span className="font-extrabold text-ink">₹{invoice.balanceAmount.toLocaleString("en-IN")}</span>
          </p>
        </div>

        {/* Payments */}
        {invoice.payments.length > 0 && (
          <div className="mt-8">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">Payments received</p>
            <ul className="mt-2 space-y-1 text-sm text-ink-soft">
              {invoice.payments.map((p) => (
                <li key={p.id}>
                  ₹{p.amount.toLocaleString("en-IN")} ({p.paymentType}) —{" "}
                  {(p.paymentDate ?? p.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  {p.transactionId && ` · Ref: ${p.transactionId}`}
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-10 border-t border-line pt-4 text-xs leading-5 text-ink-soft">
          Payment methods: UPI, bank transfer, Razorpay, payment link. Final delivery follows
          full payment as per the payment policy on {site.domain}. Thank you for your business!
        </p>
      </div>
    </div>
  );
}
