import type { Metadata } from "next";
import Link from "next/link";
import PageShell, { PageHero } from "@/components/PageShell";
import { Section } from "@/components/Section";
import Icon from "@/components/Icons";
import Reveal from "@/components/Reveal";
import { solutions } from "@/lib/solutions";

export const metadata: Metadata = {
  alternates: { canonical: "/solutions" },
  title: "Solutions by Industry — Websites & AI Systems Built for Your Business",
  description:
    "Ready-made, honest solutions for restaurants, gyms, salons and local businesses — websites, booking and WhatsApp automation with transparent pricing and live demos.",
};

export default function SolutionsPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Solutions by industry"
        title={
          <>
            Built for{" "}
            <span className="font-accent font-normal text-accent">your kind of business</span>
          </>
        }
        subtitle="Focused solutions with honest guide prices, a live demo you can click, and a written scope before any payment."
      />
      <Section>
        <div className="grid gap-5 sm:grid-cols-2">
          {solutions.map((s, i) => (
            <Reveal key={s.slug} delay={Math.min(i * 0.06, 0.24)}>
              <Link
                href={`/solutions/${s.slug}`}
                className="card-lift group flex h-full flex-col rounded-3xl border border-line bg-white p-6 hover:border-accent/40"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-accent">{s.audience}</p>
                <h2 className="mt-2 text-lg font-bold leading-snug text-ink group-hover:text-accent transition-colors">
                  {s.h1}
                </h2>
                <p className="mt-2 text-sm leading-6 text-ink-soft line-clamp-3">{s.intro}</p>
                <div className="mt-4 flex items-center gap-3 text-xs font-semibold text-ink-soft">
                  <span className="rounded-full bg-accent-soft px-2.5 py-1 text-accent">From {s.priceFrom}</span>
                  <span>{s.timeline}</span>
                </div>
                <span className="mt-auto pt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                  See details <Icon name="arrow" className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
