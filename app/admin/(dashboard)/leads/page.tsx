import Link from "next/link";
import { prisma } from "@/lib/db";
import { LEAD_STATUSES } from "@/lib/leadStatus";
import { serviceCategories } from "@/lib/services";
import type { Prisma } from "@prisma/client";

export const metadata = { title: "Leads", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; service?: string; score?: string; q?: string }>;
}) {
  const { status, service, score, q } = await searchParams;

  const where: Prisma.LeadWhereInput = {};
  if (status) where.leadStatus = status;
  if (service) where.serviceCategory = service;
  if (score) where.leadScore = score;
  if (q) {
    where.OR = [
      { clientName: { contains: q } },
      { email: { contains: q } },
      { phone: { contains: q } },
      { businessName: { contains: q } },
    ];
  }

  const leads = await prisma.lead.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { _count: { select: { uploadedFiles: true } } },
  });

  const chip = (active: boolean) =>
    `rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
      active ? "bg-ink text-white" : "border border-line bg-white text-ink-soft hover:border-accent hover:text-accent"
    }`;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-ink">Leads</h1>
        <form className="flex gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search name, email, phone..."
            className="rounded-full border border-line bg-white px-4 py-2 text-sm focus:border-accent focus:outline-none"
          />
          <button className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white">
            Search
          </button>
        </form>
      </div>

      {/* Filters */}
      <div className="mt-5 space-y-2.5">
        <div className="flex flex-wrap gap-1.5">
          <Link href="/admin/leads" className={chip(!status)}>
            All statuses
          </Link>
          {LEAD_STATUSES.map((s) => (
            <Link key={s} href={`/admin/leads?status=${encodeURIComponent(s)}`} className={chip(status === s)}>
              {s}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["High", "Medium", "Low"].map((s) => (
            <Link key={s} href={`/admin/leads?score=${s}`} className={chip(score === s)}>
              {s} quality
            </Link>
          ))}
          {serviceCategories.map((s) => (
            <Link
              key={s.slug}
              href={`/admin/leads?service=${encodeURIComponent(s.name)}`}
              className={chip(service === s.name)}
            >
              {s.shortName}
            </Link>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-line bg-background text-xs uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Budget</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Files</th>
              <th className="px-4 py-3">Received</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {leads.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-ink-soft">
                  No leads match these filters.
                </td>
              </tr>
            )}
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-background transition-colors">
                <td className="px-4 py-3">
                  <Link href={`/admin/leads/${lead.id}`} className="font-semibold text-accent hover:underline">
                    {lead.clientName}
                  </Link>
                  <p className="text-xs text-ink-soft">{lead.email}</p>
                </td>
                <td className="px-4 py-3 text-ink">{lead.serviceCategory}</td>
                <td className="px-4 py-3 text-ink-soft">{lead.budgetRange}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      lead.leadScore === "High"
                        ? "bg-mint/10 text-mint"
                        : lead.leadScore === "Low"
                          ? "bg-red-50 text-red-500"
                          : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {lead.leadScore}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink">{lead.leadStatus}</td>
                <td className="px-4 py-3 text-ink-soft">{lead._count.uploadedFiles}</td>
                <td className="px-4 py-3 text-ink-soft">
                  {lead.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
