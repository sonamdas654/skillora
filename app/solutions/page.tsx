import type { Metadata } from "next";
import Link from "next/link";
import PageShell, { PageHero } from "@/components/PageShell";
import { Section } from "@/components/Section";
import Icon from "@/components/Icons";
import HeroStack from "@/components/ui/HeroStack";
import { serviceCategories } from "@/lib/services";
import Reveal from "@/components/Reveal";
import { solutions } from "@/lib/solutions";

export const metadata: Metadata = {
  alternates: { canonical: "/solutions" },
  title: "Solutions by Industry — Websites & AI Systems",
  description:
    "Ready-made, honest solutions for restaurants, gyms, salons and local businesses — websites, booking and WhatsApp automation with transparent pricing and live demos.",
};

/**
 * Industry solutions index.
 *
 * This was the weakest page on the site: a hero and a single two-column card
 * grid, and nothing else — no structure, no proof, no schema, on a page
 * selling four productised offerings.
 *
 * Four items is too few for a grid to do anything useful; a grid just makes
 * each one small. As full-width rows they get the room to actually sell: the
 * audience, the promise, the guide price and timeline side by side, and a
 * direct route into the live build for that industry.
 */
export default function SolutionsPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Solutions by industry"
        title={
          <>
            Built for{" "}
            <span className="font-accent italic text-brand">your kind of business</span>
          </>
        }
        subtitle="Focused solutions with honest guide prices, a live build you can click through, and a written scope before any payment."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Solutions", path: "/solutions" },
        ]}
        aside={
          <HeroStack
            cards={solutions.slice(0, 3).map((s) => ({
              icon: serviceCategories.find((c) => c.slug === s.serviceSlug)?.icon ?? "briefcase",
              title: s.audience,
              body: s.h1,
              href: `/solutions/${s.slug}`,
              cta: "See this solution",
            }))}
          />
        }
        actions={
          <Link href="/start-project" className="inline-flex items-center gap-2 rounded-pill bg-brand px-6 py-3.5 text-body-base font-semibold text-on-brand shadow-brand transition-colors hover:bg-brand-deep">
            Tell us your industry
            <Icon name="arrow" className="size-4" />
          </Link>
        }
      />

      <Section>
        <div className="border-t border-line-strong">
          {solutions.map((s, i) => (
            <Reveal key={s.slug} delay={Math.min(i * 0.06, 0.24)}>
              <article className="grid gap-x-10 gap-y-5 border-b border-line py-9 lg:grid-cols-[auto_1fr_auto]">
                <span className="hidden pt-2 font-mono text-micro text-ink-muted lg:block">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0">
                  <p className="text-micro font-mono uppercase text-ink-muted">{s.audience}</p>
                  <h2 className="mt-2 max-w-2xl font-display text-display-3 text-ink">
                    <Link
                      href={`/solutions/${s.slug}`}
                      className="transition-colors hover:text-brand"
                    >
                      {s.h1}
                    </Link>
                  </h2>
                  <p className="mt-3 max-w-2xl text-body-lg text-ink-soft">{s.intro}</p>

                  <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
                    <Link
                      href={`/solutions/${s.slug}`}
                      className="tap-safe group inline-flex items-center gap-1.5 text-body-sm font-semibold text-brand"
                    >
                      See what&apos;s included
                      <Icon
                        name="arrow"
                        className="size-4 transition-transform group-hover:translate-x-0.5"
                      />
                    </Link>
                    {s.demoPath && (
                      <Link
                        href={s.demoPath}
                        className="tap-safe inline-block text-body-sm font-semibold text-ink-soft transition-colors hover:text-ink"
                      >
                        {s.demoLabel ?? "Open the live build"}
                      </Link>
                    )}
                  </div>
                </div>

                <dl className="shrink-0 lg:w-52 lg:border-l lg:border-line lg:pl-10">
                  <div className="flex items-baseline justify-between gap-4 py-1.5">
                    <dt className="text-body-sm text-ink-soft">From</dt>
                    <dd className="font-mono text-body-base font-medium text-ink">
                      {s.priceFrom}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 py-1.5">
                    <dt className="text-body-sm text-ink-soft">Timeline</dt>
                    <dd className="font-mono text-body-sm text-ink">{s.timeline}</dd>
                  </div>
                </dl>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
