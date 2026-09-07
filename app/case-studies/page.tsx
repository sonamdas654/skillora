import type { Metadata } from "next";
import Link from "next/link";
import PageShell, { PageHero } from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icons";
import JsonLd from "@/components/JsonLd";
import SpecLedger from "@/components/ui/SpecLedger";
import { Section } from "@/components/Section";
import { caseStudies, DELIVERY_PROFILE } from "@/lib/caseStudies";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/case-studies" },
  title: "Case Studies — How These Builds Were Actually Decided",
  description:
    "Six concept builds, each with the reasoning behind it and the trade-off that was accepted — restaurant, gym, salon, ecommerce, support chatbot and sales dashboard. Every build is live and explorable.",
};

/**
 * Case study index.
 *
 * Written as an editorial index rather than a grid of six cards, for the same
 * reason /services and /pricing were: a card grid is the shape this site was
 * told not to repeat, and six studies with real titles read better as a list
 * you scan than as tiles you compare.
 *
 * The honesty note is placed above the index, not buried at the bottom of each
 * study. A reader who works out for themselves that these are concept builds
 * has caught the site being coy; a reader who is told immediately is being
 * levelled with, and the reasoning below is worth more to them for it.
 */
export default function CaseStudiesPage() {
  return (
    <PageShell>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Skilloura case studies",
          itemListOrder: "https://schema.org/ItemListUnordered",
          numberOfItems: caseStudies.length,
          itemListElement: caseStudies.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${site.url}/case-studies/${c.slug}`,
            name: c.title,
          })),
        }}
      />

      <PageHero
        eyebrow="Case studies"
        title={
          <>
            The reasoning,{" "}
            <span className="font-accent italic text-brand">not the highlight reel</span>
          </>
        }
        subtitle="Six builds, each written up as the decisions that shaped it — including what was deliberately left out, and what that cost. Every one of them is live, and you can go and use it."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Case studies", path: "/case-studies" },
        ]}
        actions={
          <Link
            href="/start-project"
            className="inline-flex items-center gap-2 rounded-pill bg-brand px-6 py-3.5 text-body-base font-semibold text-on-brand shadow-brand transition-colors hover:bg-brand-deep"
          >
            Talk about your project
            <Icon name="arrow" className="size-4" />
          </Link>
        }
        aside={
          <SpecLedger
            caption="What these are"
            rows={[
              { label: "Studies", value: `${caseStudies.length}` },
              { label: "Live to explore", value: "All six" },
              { label: "Client work", value: "None yet" },
              { label: "Invented results", value: "None" },
            ]}
          />
        }
      />

      {/* ── The disclosure, first rather than last ───────────── */}
      <Section className="border-b border-line bg-surface-sunken">
        <Reveal variant="fade">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            <div>
              <p className="text-micro font-mono uppercase text-ink-muted">Read this first</p>
              <h2 className="mt-3 text-display-3 text-ink">
                These are concept builds, not{" "}
                <span className="font-accent italic text-brand">client work</span>
              </h2>
            </div>
            <div className="space-y-4 text-body-lg text-ink-soft">
              <p>
                Skilloura is a young studio. There is no shelf of published client projects
                yet, and inventing one would be both dishonest and easy to check — so these
                six were built from scratch instead, specifically to be shown.
              </p>
              <p>
                That turns out to be more useful than a testimonial. Every build runs, in
                your browser, right now. You can open one, use it, and then read exactly why
                it is shaped the way it is — which is a harder thing to fake than a logo wall.
              </p>
              <p className="text-body-base">
                What you will not find here: client names, revenue figures, or a claim that
                something increased conversions by some percentage. When real client work is
                publishable, it joins this list in the same format.
              </p>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* ── The index ────────────────────────────────────────── */}
      <Section>
        <Reveal>
          <h2 className="text-micro font-mono uppercase text-ink-muted">The six</h2>
        </Reveal>
        <ol className="mt-6 border-t border-line-strong">
          {caseStudies.map((c, i) => (
            <li key={c.slug} className="border-b border-line">
              <Reveal delay={Math.min(i * 0.04, 0.16)}>
                <Link
                  href={`/case-studies/${c.slug}`}
                  className="group grid gap-x-8 gap-y-3 py-7 transition-colors hover:bg-surface sm:grid-cols-[auto_1fr_auto] sm:items-baseline"
                >
                  <span className="font-mono text-micro text-ink-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-title-1 font-semibold text-ink transition-colors group-hover:text-brand">
                      {c.title}
                    </h3>
                    <p className="mt-1.5 max-w-2xl text-body-base text-ink-soft">{c.subtitle}</p>
                    <p className="mt-2.5 font-mono text-micro uppercase text-ink-muted">
                      {c.industry} · {c.productName} · {c.readMinutes} min read
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-body-sm font-semibold text-brand">
                    Read
                    <Icon
                      name="arrow"
                      className="size-4 transition-transform group-hover:translate-x-0.5"
                    />
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>

      {/* ── What all six measure ─────────────────────────────── */}
      <Section className="border-t border-line">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <Reveal>
            <div>
              <p className="text-micro font-mono uppercase text-ink-muted">Measured, not claimed</p>
              <h2 className="mt-3 text-display-3 text-ink">
                The same numbers for{" "}
                <span className="font-accent italic text-brand">all six</span>
              </h2>
              <p className="mt-4 max-w-xl text-body-lg text-ink-soft">
                Every build ships on the same foundation, so they perform the same. These
                figures come from running the finished builds under throttled conditions —
                not from a score card, and not from a developer&rsquo;s laptop on office wi-fi.
              </p>
              <p className="mt-4 max-w-xl text-body-sm text-ink-soft">
                {DELIVERY_PROFILE.conditions} Measured {DELIVERY_PROFILE.measuredOn}.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08} variant="unfurl">
            {/* One <div> between <dl> and each dt/dd group — that is all the
                spec permits, and the note is a second <dd> rather than a <p>
                so the whole row stays a single term/definition pairing. */}
            <dl className="border-t border-line-strong">
              {DELIVERY_PROFILE.metrics.map((m) => (
                <div
                  key={m.label}
                  className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 border-b border-line py-4"
                >
                  <dt className="text-body-base font-medium text-ink">{m.label}</dt>
                  <dd className="text-right font-mono text-title-2 font-medium text-ink">
                    {m.value}
                  </dd>
                  <dd className="col-span-2 mt-1.5 max-w-md text-body-sm text-ink-soft">
                    {m.note}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </Section>
    </PageShell>
  );
}
