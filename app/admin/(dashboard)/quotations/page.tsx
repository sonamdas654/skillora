import { prisma } from "@/lib/db";
import QuotationsManager from "@/components/admin/QuotationsManager";

export const metadata = { title: "Quotations", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function QuotationsPage() {
  const [quotations, leads] = await Promise.all([
    prisma.quotation.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      include: { lead: { select: { clientName: true, serviceCategory: true } } },
    }),
    prisma.lead.findMany({
      where: { leadStatus: { notIn: ["Closed", "Rejected", "Spam"] } },
      orderBy: { createdAt: "desc" },
      take: 100,
      select: { id: true, clientName: true, serviceCategory: true },
    }),
  ]);

  return (
    <QuotationsManager
      quotations={quotations.map((q) => ({
        id: q.id,
        quoteNumber: q.quoteNumber,
        clientName: q.lead.clientName,
        service: q.lead.serviceCategory,
        amount: q.quoteAmount,
        scope: q.scope,
        timeline: q.timeline,
        validUntil: q.validUntil?.toISOString() ?? null,
        status: q.status,
        createdAt: q.createdAt.toISOString(),
      }))}
      leads={leads.map((l) => ({
        id: l.id,
        label: `${l.clientName} — ${l.serviceCategory}`,
      }))}
    />
  );
}
