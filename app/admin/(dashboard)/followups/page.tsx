import { prisma } from "@/lib/db";
import FollowupsManager from "@/components/admin/FollowupsManager";

export const metadata = { title: "Follow-ups", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function FollowupsPage() {
  const [followups, leads] = await Promise.all([
    prisma.followup.findMany({
      orderBy: { followupDate: "asc" },
      take: 200,
      include: { lead: { select: { clientName: true, phone: true, serviceCategory: true } } },
    }),
    prisma.lead.findMany({
      where: { leadStatus: { notIn: ["Closed", "Rejected", "Spam", "Delivered"] } },
      orderBy: { createdAt: "desc" },
      take: 100,
      select: { id: true, clientName: true, serviceCategory: true },
    }),
  ]);

  return (
    <FollowupsManager
      followups={followups.map((f) => ({
        id: f.id,
        clientName: f.lead.clientName,
        phone: f.lead.phone,
        service: f.lead.serviceCategory,
        date: f.followupDate.toISOString(),
        type: f.followupType ?? "whatsapp",
        message: f.message,
        status: f.status,
      }))}
      leads={leads.map((l) => ({
        id: l.id,
        label: `${l.clientName} — ${l.serviceCategory}`,
      }))}
    />
  );
}
