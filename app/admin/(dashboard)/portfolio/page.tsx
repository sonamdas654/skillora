import { prisma } from "@/lib/db";
import PortfolioManager from "@/components/admin/PortfolioManager";

export const metadata = { title: "Portfolio CMS", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function PortfolioAdminPage() {
  const items = await prisma.portfolio.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <PortfolioManager
      items={items.map((i) => ({
        id: i.id,
        projectTitle: i.projectTitle,
        industry: i.industry,
        category: i.category,
        problem: i.problem,
        solution: i.solution,
        demoLink: i.demoLink,
        technologyUsed: i.technologyUsed,
        isDemo: i.isDemo,
        status: i.status,
      }))}
    />
  );
}
