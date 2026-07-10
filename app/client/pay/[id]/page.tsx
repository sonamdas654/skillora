import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import QRCode from "qrcode";
import { prisma } from "@/lib/db";
import { getClientSession } from "@/lib/clientAuth";
import { site, whatsappLink } from "@/lib/site";
import ClientPortalShell from "@/components/client/ClientPortalShell";
import PaymentReferenceForm from "@/components/client/PaymentReferenceForm";
import { WhatsAppIcon } from "@/components/Header";

export const metadata: Metadata = {
  title: "Pay Invoice",
  robots: { index: false },
};
export const dynamic = "force-dynamic";

function money(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

export default async function ClientPayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getClientSession();
  if (!session) redirect("/client/login");

  const { id } = await params;
  const inv = await prisma.invoice.findUnique({
    where: { id },
    include: { lead: true, payments: true },
  });
  if (!inv || inv.lead.email.toLowerCase() !== session.email.toLowerCase() || inv.status === "Draft") {
    notFound();
  }

  const upiId = process.env.UPI_ID;
  const upiName = process.env.UPI_PAYEE_NAME || site.name;
  const amount = inv.balanceAmount;
  const hasPendingClaim = inv.payments.some((p) => p.paymentStatus === "Client claimed");

  let qrDataUrl: string | null = null;
  let upiLink: string | null = null;
  if (upiId && amount > 0) {
    upiLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(inv.invoiceNumber)}`;
    qrDataUrl = await QRCode.toDataURL(upiLink, { width: 280, margin: 1 });
  }

  return (
    <ClientPortalShell email={session.email}>
      <Link href={`/client/invoices/${inv.id}`} className="text-sm font-semibold text-accent hover:text-accent-deep">
        ← Back to invoice
      </Link>

      <div className="mt-4 rounded-3xl border border-line bg-white p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-ink">
          Pay <span className="text-accent">{money(amount)}</span>
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          Invoice {inv.invoiceNumber} · {inv.lead.serviceCategory}
        </p>

        {amount <= 0 ? (
          <div className="mt-6 rounded-2xl border border-mint/25 bg-mint/5 p-5 text-sm font-medium text-ink">
            ✓ This invoice is fully paid. Thank you!
          </div>
        ) : (
          <>
            {upiId && qrDataUrl ? (
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div className="rounded-2xl border border-line bg-background p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                    Scan with any UPI app
                  </p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrDataUrl}
                    alt={`UPI QR code to pay ${money(amount)}`}
                    className="mx-auto mt-3 size-52 rounded-xl border border-line bg-white p-2"
                  />
                  <p className="mt-3 text-xs text-ink-soft">
                    GPay · PhonePe · Paytm · BHIM — sab chalega
                  </p>
                </div>
                <div className="flex flex-col justify-center gap-3">
                  <div className="rounded-2xl border border-line bg-background p-4">
                    <p className="text-xs font-semibold text-ink-soft">UPI ID</p>
                    <p className="mt-0.5 break-all text-base font-bold text-ink">{upiId}</p>
                  </div>
                  <div className="rounded-2xl border border-line bg-background p-4">
                    <p className="text-xs font-semibold text-ink-soft">Amount</p>
                    <p className="mt-0.5 text-base font-bold text-ink">{money(amount)}</p>
                  </div>
                  <a
                    href={upiLink!}
                    className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-bold text-white hover:bg-accent-deep transition-colors sm:hidden"
                  >
                    Open in UPI app
                  </a>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-line bg-background p-5">
                <p className="text-sm leading-6 text-ink-soft">
                  Message us on WhatsApp and we&apos;ll share the payment details (UPI / bank
                  transfer / payment link) right away.
                </p>
                <a
                  href={whatsappLink(`Hi! I want to pay invoice ${inv.invoiceNumber} (${money(amount)}). Please share payment details.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-full bg-mint px-5 py-2.5 text-sm font-bold text-white"
                >
                  <WhatsAppIcon className="size-4" /> Get payment details
                </a>
              </div>
            )}

            <div className="mt-8 border-t border-line pt-6">
              {hasPendingClaim ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm font-medium text-ink">
                  ⏳ We received your payment reference and are verifying it. You&apos;ll see it
                  confirmed on your dashboard soon.
                </div>
              ) : (
                <PaymentReferenceForm invoiceId={inv.id} />
              )}
            </div>
          </>
        )}
      </div>
    </ClientPortalShell>
  );
}
