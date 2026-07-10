import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getClientSession } from "@/lib/clientAuth";
import ClientPortalShell from "@/components/client/ClientPortalShell";
import AcceptQuotationButton from "@/components/client/AcceptQuotationButton";

export const metadata: Metadata = {
  title: "Quotation",
  robots: { index: false },
};
export const dynamic = "force-dynamic";

function money(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

export default async function ClientQuotationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getClientSession();
  if (!session) redirect("/client/login");

  const { id } = await params;
  const q = await prisma.quotation.findUnique({
    where: { id },
    include: { lead: true },
  });
  if (!q || q.lead.email.toLowerCase() !== session.email.toLowerCase() || q.status === "Draft") {
    notFound();
  }

  return (
    <ClientPortalShell email={session.email}>
      <Link href="/client" className="text-sm font-semibold text-accent hover:text-accent-deep">
        ← Back to dashboard
      </Link>

      <div className="mt-4 rounded-3xl border border-line bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-ink-soft">Quotation</p>
            <h1 className="mt-1 text-2xl font-bold text-ink">{q.quoteNumber}</h1>
          </div>
          <span
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold ${
              q.status === "Accepted"
                ? "bg-mint/10 text-mint"
                : q.status === "Sent"
                  ? "bg-accent-soft text-accent"
                  : "bg-black/[0.05] text-ink-soft"
            }`}
          >
            {q.status}
          </span>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-line bg-background p-4">
            <p className="text-xs font-semibold text-ink-soft">Amount</p>
            <p className="mt-1 text-2xl font-extrabold text-ink">{money(q.quoteAmount)}</p>
          </div>
          <div className="rounded-2xl border border-line bg-background p-4">
            <p className="text-xs font-semibold text-ink-soft">Timeline</p>
            <p className="mt-1 text-base font-bold text-ink">{q.timeline || "As discussed"}</p>
          </div>
          <div className="rounded-2xl border border-line bg-background p-4">
            <p className="text-xs font-semibold text-ink-soft">Valid until</p>
            <p className="mt-1 text-base font-bold text-ink">
              {q.validUntil
                ? q.validUntil.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                : "—"}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink-soft">
            Scope of work
          </h2>
          <div className="mt-2 whitespace-pre-line rounded-2xl border border-line bg-background p-5 text-sm leading-7 text-ink">
            {q.scope}
          </div>
        </div>

        <p className="mt-4 text-xs leading-5 text-ink-soft">
          Included: what&apos;s written above. Domain, hosting, paid APIs and other third-party
          costs are separate unless listed. Revisions follow the{" "}
          <Link href="/revision-policy" className="font-semibold text-accent">
            revision policy
          </Link>
          .
        </p>

        <div className="mt-8">
          {q.status === "Sent" ? (
            <AcceptQuotationButton quotationId={q.id} />
          ) : q.status === "Accepted" ? (
            <div className="rounded-2xl border border-mint/25 bg-mint/5 p-4 text-sm font-medium text-ink">
              ✓ Accepted. Next step: advance payment — check your dashboard for the invoice, or
              we&apos;ll contact you on WhatsApp with payment details.
            </div>
          ) : null}
        </div>
      </div>
    </ClientPortalShell>
  );
}
