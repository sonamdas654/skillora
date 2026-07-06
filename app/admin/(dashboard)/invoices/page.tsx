import { prisma } from "@/lib/db";
import InvoicesManager from "@/components/admin/InvoicesManager";

export const metadata = { title: "Invoices", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
  const [invoices, leads] = await Promise.all([
    prisma.invoice.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      include: {
        lead: { select: { clientName: true, serviceCategory: true } },
        payments: { orderBy: { createdAt: "desc" } },
      },
    }),
    prisma.lead.findMany({
      where: { leadStatus: { notIn: ["Closed", "Rejected", "Spam"] } },
      orderBy: { createdAt: "desc" },
      take: 100,
      select: { id: true, clientName: true, serviceCategory: true },
    }),
  ]);

  return (
    <InvoicesManager
      invoices={invoices.map((inv) => ({
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        clientName: inv.lead.clientName,
        service: inv.lead.serviceCategory,
        totalAmount: inv.totalAmount,
        paidAmount: inv.paidAmount,
        balanceAmount: inv.balanceAmount,
        status: inv.status,
        dueDate: inv.dueDate?.toISOString() ?? null,
        payments: inv.payments.map((p) => ({
          id: p.id,
          amount: p.amount,
          type: p.paymentType ?? "payment",
          date: (p.paymentDate ?? p.createdAt).toISOString(),
        })),
      }))}
      leads={leads.map((l) => ({
        id: l.id,
        label: `${l.clientName} — ${l.serviceCategory}`,
      }))}
    />
  );
}
