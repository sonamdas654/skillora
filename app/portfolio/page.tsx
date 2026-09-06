import type { Metadata } from "next";
import PageShell, { PageHero } from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import { Section } from "@/components/Section";
import { PortfolioCard } from "@/components/Cards";
import TrustBand from "@/components/TrustBand";
import { portfolioItems, type PortfolioItem } from "@/lib/portfolio";
import { createPublicClient } from "@/lib/supabase/public";
import JsonLd from "@/components/JsonLd";
import { site } from "@/lib/site";

// Public content only, so this is statically generated and refreshed on a
// timer instead of server-rendered per request. See lib/supabase/public.ts
// for why the cookie-bound client cannot be used here.
export const revalidate = 3600;

export const metadata: Metadata = {
  alternates: { canonical: "/portfolio" },
  title: "Portfolio — Featured Work & Concepts",
  description:
    "Explore live, working concept demos across websites, ecommerce, AI chatbots and dashboards — see exactly what Skilloura builds.",
};

const dbAccents = ["#2857ff", "#0fbf8f", "#f59e0b", "#a855f7", "#e11d48", "#ff6b35"];

export default async function PortfolioPage() {
  const supabase = createPublicClient();
  const { data: dbItems } = await supabase
    .from("portfolio_items")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  const allItems: PortfolioItem[] = [
    ...(dbItems ?? []).map((i, idx) => ({
      slug: i.id,
      title: i.project_title,
      industry: i.industry,
      category: i.category,
      problem: i.problem,
      solution: i.solution,
      features: i.features ?? [],
      technology: i.technology_used ?? "",
      isDemo: i.is_demo,
      accent: dbAccents[idx % dbAccents.length],
      icon: "spark",
    })),
    ...portfolioItems,
  ];

  // Concept builds and real client work were merged into one grid with no
  // way to tell them apart — which is both a design problem and an honesty
  // problem. They are now separate, labelled groups.
  const concepts = allItems.filter((i) => i.isDemo);
  const clientWork = allItems.filter((i) => !i.isDemo);

  const groups = [
    {
      key: "client",
      label: "Client work",
      blurb: "Projects built for real businesses.",
      items: clientWork,
    },
    {
      key: "concept",
      label: "Concept builds",
      blurb:
        "Made by Skilloura to show quality, not for live businesses. Every one opens as a working page you can click through.",
      items: concepts,
    },
  ].filter((g) => g.items.length > 0);

  return (
    <PageShell>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Skilloura portfolio",
          url: `${site.url}/portfolio`,
          numberOfItems: allItems.length,
          itemListElement: allItems.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.title,
            url: `${site.url}/portfolio/${item.slug}`,
          })),
        }}
      />

      <PageHero
        eyebrow="Portfolio"
        title={
          <>
            Work that shows{" "}
            <span className="font-accent italic text-brand">what&apos;s possible</span>
          </>
        }
        subtitle="Click any build to explore a live, interactive page — not screenshots, and no sign-up."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Portfolio", path: "/portfolio" },
        ]}
      />

      <Section>
        {groups.map((group, gi) => (
          <div key={group.key} className={gi > 0 ? "mt-16" : ""}>
            <Reveal>
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-line-strong pb-3">
                <h2 className="font-display text-title-1 text-ink">{group.label}</h2>
                <p className="max-w-xl text-body-sm text-ink-soft">{group.blurb}</p>
              </div>
            </Reveal>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item, i) => (
                <Reveal key={item.slug} delay={Math.min(i * 0.06, 0.3)}>
                  <PortfolioCard item={item} />
                </Reveal>
              ))}
            </div>
          </div>
        ))}

        {/* The closing offer lives in the footer now, so this page ends on
            proof rather than on a ninth near-identical CTA card. */}
        <Reveal delay={0.15}>
          <div className="mt-16">
            <TrustBand />
          </div>
        </Reveal>
      </Section>
    </PageShell>
  );
}
