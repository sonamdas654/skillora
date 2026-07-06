import { prisma } from "@/lib/db";
import ProjectsManager from "@/components/admin/ProjectsManager";

export const metadata = { title: "Projects", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const [projects, leads] = await Promise.all([
    prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      include: { lead: { select: { clientName: true } } },
    }),
    prisma.lead.findMany({
      where: { leadStatus: { in: ["Qualified", "Quoted", "Waiting for Payment", "In Progress"] } },
      orderBy: { createdAt: "desc" },
      take: 100,
      select: { id: true, clientName: true, serviceCategory: true },
    }),
  ]);

  return (
    <ProjectsManager
      projects={projects.map((p) => ({
        id: p.id,
        projectName: p.projectName,
        clientName: p.lead.clientName,
        serviceType: p.serviceType,
        status: p.status,
        startDate: p.startDate?.toISOString() ?? null,
        expectedDeliveryDate: p.expectedDeliveryDate?.toISOString() ?? null,
      }))}
      leads={leads.map((l) => ({
        id: l.id,
        label: `${l.clientName} — ${l.serviceCategory}`,
      }))}
    />
  );
}
