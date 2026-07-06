import Link from "next/link";
import { prisma } from "@/lib/db";

export const metadata = { title: "Admin Dashboard", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [
    totalLeads,
    newLeads,
    highQuality,
    inProgress,
    delivered,
    contactMsgs,
    byService,
    recent,
    monthRevenue,
    pendingPayments,
    pendingFollowups,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { leadStatus: "New" } }),
    prisma.lead.count({ where: { leadScore: "High" } }),
    prisma.lead.count({ where: { leadStatus: "In Progress" } }),
    prisma.lead.count({ where: { leadStatus: "Delivered" } }),
    prisma.contactMessage.count({ where: { status: "new" } }),
    prisma.lead.groupBy({
      by: ["serviceCategory"],
      _count: { serviceCategory: true },
      orderBy: { _count: { serviceCategory: "desc" } },
      take: 5,
    }),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { paymentDate: { gte: monthStart } },
    }),
    prisma.invoice.aggregate({
      _sum: { balanceAmount: true },
      where: { status: { in: ["Sent", "Partially Paid", "Overdue"] } },
    }),
    prisma.followup.count({
      where: { status: "Pending", followupDate: { lte: new Date() } },
    }),
  ]);

  const stats = [
    { label: "Total leads", value: String(totalLeads) },
    { label: "New leads", value: String(newLeads) },
    { label: "High-quality leads", value: String(highQuality) },
    { label: "Active projects", value: String(inProgress) },
    { label: "Delivered", value: String(delivered) },
    { label: "New messages", value: String(contactMsgs) },
    {
      label: "Revenue this month",
      value: `₹${(monthRevenue._sum.amount ?? 0).toLocaleString("en-IN")}`,
    },
    {
      label: "Pending payments",
      value: `₹${(pendingPayments._sum.balanceAmount ?? 0).toLocaleString("en-IN")}`,
    },
    { label: "Due follow-ups", value: String(pendingFollowups) },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-line bg-white p-5">
            <p className="text-2xl font-extrabold text-accent truncate">{s.value}</p>
            <p className="mt-1 text-xs font-medium text-ink-soft">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-line bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-ink">Recent leads</h2>
            <Link href="/admin/leads" className="text-sm font-semibold text-accent hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4 divide-y divide-line">
            {recent.length === 0 && (
              <p className="py-6 text-sm text-ink-soft">No leads yet. Share your website to start receiving requests.</p>
            )}
            {recent.map((lead) => (
              <Link
                key={lead.id}
                href={`/admin/leads/${lead.id}`}
                className="flex items-center justify-between gap-3 py-3 hover:bg-background px-2 rounded-lg transition-colors"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{lead.clientName}</p>
                  <p className="truncate text-xs text-ink-soft">
                    {lead.serviceCategory} · {lead.budgetRange}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    lead.leadScore === "High"
                      ? "bg-mint/10 text-mint"
                      : lead.leadScore === "Low"
                        ? "bg-red-50 text-red-500"
                        : "bg-amber-50 text-amber-600"
                  }`}
                >
                  {lead.leadScore}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-white p-6">
          <h2 className="text-base font-bold text-ink">Most requested services</h2>
          <div className="mt-4 space-y-3">
            {byService.length === 0 && <p className="text-sm text-ink-soft">No data yet.</p>}
            {byService.map((row) => (
              <div key={row.serviceCategory}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-ink">{row.serviceCategory}</span>
                  <span className="text-ink-soft">{row._count.serviceCategory}</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-line">
                  <div
                    className="h-1.5 rounded-full bg-accent"
                    style={{
                      width: `${Math.min(100, (row._count.serviceCategory / Math.max(totalLeads, 1)) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
