import type { Metadata } from "next";
import Link from "next/link";
import PageShell, { PageHero } from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icons";
import { Section } from "@/components/Section";
import { PortfolioCard } from "@/components/Cards";
import TrustBand from "@/components/TrustBand";
import { portfolioItems, type PortfolioItem } from "@/lib/portfolio";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/portfolio" },
  title: "Portfolio — Featured Work & Concepts",
  description:
    "Explore live, working concept demos across websites, ecommerce, AI chatbots and dashboards — see exactly what Skilloura builds.",
};

const dbAccents = ["#2857ff", "#0fbf8f", "#f59e0b", "#a855f7", "#e11d48", "#ff6b35"];

export default async function PortfolioPage() {
  const dbItems = await prisma.portfolio.findMany({
    where: { status: "active" },
    orderBy: { createdAt: "desc" },
  });
  const allItems: PortfolioItem[] = [
    ...dbItems.map((i, idx) => ({
      slug: i.id,
      title: i.projectTitle,
      industry: i.industry,
      category: i.category,
      problem: i.problem,
      solution: i.solution,
      features: i.features ? (JSON.parse(i.features) as string[]) : [],
      technology: i.technologyUsed ?? "",
      isDemo: i.isDemo,
      accent: dbAccents[idx % dbAccents.length],
      icon: "spark",
    })),
    ...portfolioItems,
  ];

  return (
    <PageShell>
      <PageHero
        eyebrow="Portfolio"
        title={
          <>
            Work that shows{" "}
            <span className="font-accent font-normal text-accent">what&apos;s possible</span>
          </>
        }
        subtitle="Click any concept to explore a live, interactive demo — real, working pages that show exactly what we build."
      />
      <Section>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {allItems.map((item, i) => (
            <Reveal key={item.slug} delay={Math.min(i * 0.06, 0.3)}>
              <PortfolioCard item={item} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="mt-14">
            <TrustBand />
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-8 rounded-3xl border border-line bg-white p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-ink">
              Want a project like these —{" "}
              <span className="font-accent font-normal text-accent">built for you?</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-ink-soft">
              Tell me your industry and requirement. I&apos;ll show you a relevant sample and a clear
              plan before you commit to anything.
            </p>
            <Link
              href="/start-project"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-deep transition-colors"
            >
              Submit Project Requirement <Icon name="arrow" className="size-4" />
            </Link>
          </div>
        </Reveal>
      </Section>
    </PageShell>
  );
}
