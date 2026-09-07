import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell, { PageHero } from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icons";
import JsonLd from "@/components/JsonLd";
import SpecLedger from "@/components/ui/SpecLedger";
import { Section } from "@/components/Section";
import { caseStudies, getCaseStudy, DELIVERY_PROFILE } from "@/lib/caseStudies";
import { getConceptBySlug } from "@/lib/portfolio";
import { getService } from "@/lib/services";
import { getFocusService } from "@/lib/focusServices";
import { createPublicClient } from "@/lib/supabase/public";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}
export const dynamicParams = false;

// The related-article titles come from Supabase, the same source /blog reads,
// so a retitled post cannot leave a stale title stranded here.
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getCaseStudy(slug);
  if (!c) return {};
  return {
    title: c.title,
    description: c.summary,
    alternates: { canonical: `/case-studies/${slug}` },
    openGraph: {
      type: "article",
      title: c.title,
      description: c.summary,
      url: `${site.url}/case-studies/${slug}`,
    },
  };
}

/**
 * Case study detail.
 *
 * The section order is the argument: the situation, then the decisions, then
 * what was built, then what it costs, then what was measured, and only then
 * the sales CTA. A reader who wants the price can reach it from the header
 * ledger without scrolling; a reader who wants the reasoning gets it without
 * being sold to first.
 *
 * `honestly` is rendered on the ink surface — the strongest visual treatment
 * on the page — rather than as small print. It is the most credible thing
 * here, and burying it would waste it.
 */
export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const concept = getConceptBySlug(study.conceptSlug);
  const service = getService(study.serviceSlug) ?? getFocusService(study.serviceSlug);

  const supabase = createPublicClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug,title,read_minutes")
    .in("slug", study.relatedPosts)
    .eq("status", "published");

  const related = caseStudies.filter((c) => study.relatedStudies.includes(c.slug));

  return (
    <PageShell>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          "@id": `${site.url}/case-studies/${study.slug}#casestudy`,
          name: study.title,
          headline: study.title,
          description: study.summary,
          url: `${site.url}/case-studies/${study.slug}`,
          about: study.industry,
          creator: { "@id": `${site.url}/#organization` },
          // Say plainly, in the structured data too, that this is a concept
          // build. The page is explicit about it; the machine-readable version
          // should not be vaguer than the page.
          genre: "Concept build case study",
          isBasedOn: `${site.url}/portfolio/${study.conceptSlug}`,
          keywords: study.stack.join(", "),
        }}
      />

      <PageHero
        eyebrow={`Case study · ${study.industry}`}
        title={study.title}
        subtitle={study.subtitle}
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Case studies", path: "/case-studies" },
          { name: study.productName, path: `/case-studies/${study.slug}` },
        ]}
        actions={
          <div className="flex flex-wrap gap-3">
            {concept && (
              <Link
                href={`/portfolio/${study.conceptSlug}`}
                className="inline-flex items-center gap-2 rounded-pill bg-brand px-6 py-3.5 text-body-base font-semibold text-on-brand shadow-brand transition-colors hover:bg-brand-deep"
              >
                Open the live build
                <Icon name="arrow" className="size-4" />
              </Link>
            )}
            {service && (
              <Link
                href={`/services/${study.serviceSlug}`}
                className="inline-flex items-center gap-2 rounded-pill border border-line-strong px-6 py-3.5 text-body-base font-semibold text-ink transition-colors hover:bg-surface"
              >
                {service.name}
              </Link>
            )}
          </div>
        }
        aside={
          <SpecLedger
            caption="At a glance"
            rows={[
              { label: "Build", value: study.productName },
              { label: "Timeline", value: study.timeline },
              { label: "Typical range", value: study.priceRange },
              { label: "Decisions covered", value: `${study.decisions.length}` },
            ]}
          />
        }
      />

      {/* ── The situation ────────────────────────────────────── */}
      <Section className="border-b border-line">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <Reveal>
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-micro font-mono uppercase text-ink-muted">The situation</p>
              <h2 className="mt-3 text-display-3 text-ink">
                What goes{" "}
                <span className="font-accent italic text-brand">wrong</span> here
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="space-y-5 text-body-lg leading-relaxed text-ink-soft">
              {study.situation.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ── The decisions. The reason this page exists. ──────── */}
      <Section className="border-b border-line">
        <Reveal>
          <p className="text-micro font-mono uppercase text-ink-muted">The decisions</p>
          <h2 className="mt-3 max-w-2xl text-display-3 text-ink">
            Every one of these had a{" "}
            <span className="font-accent italic text-brand">cost</span>
          </h2>
          <p className="mt-4 max-w-2xl text-body-lg text-ink-soft">
            A decision with no trade-off is a feature list. Each of these names what was
            given up, because that is the part a client needs to agree with before the
            project starts — not after.
          </p>
        </Reveal>

        <ol className="mt-10 border-t border-line-strong">
          {study.decisions.map((d, i) => (
            <li key={d.title} className="border-b border-line py-8">
              <Reveal delay={Math.min(i * 0.05, 0.2)}>
                <div className="grid gap-x-10 gap-y-4 lg:grid-cols-[auto_1fr_0.8fr]">
                  <span className="font-mono text-micro text-ink-muted lg:pt-1.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-title-1 font-semibold text-ink">{d.title}</h3>
                    <p className="mt-3 text-body-base leading-relaxed text-ink-soft">{d.body}</p>
                  </div>
                  <div className="border-l-0 border-t border-line pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                    <p className="text-micro font-mono uppercase text-ink-muted">
                      What it cost
                    </p>
                    <p className="mt-2 text-body-sm leading-relaxed text-ink-soft">
                      {d.tradeoff}
                    </p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>

      {/* ── Scope, stack, and what the client brings ─────────── */}
      <Section className="border-b border-line bg-surface-sunken">
        <div className="grid gap-10 md:grid-cols-3 md:gap-12">
          <Reveal>
            <div>
              <p className="text-micro font-mono uppercase text-ink-muted">In the build</p>
              <ul className="mt-4 border-t border-line-strong">
                {study.scope.map((s) => (
                  <li key={s} className="border-b border-line py-3 text-body-base text-ink">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <div>
              <p className="text-micro font-mono uppercase text-ink-muted">Built with</p>
              <ul className="mt-4 border-t border-line-strong">
                {study.stack.map((s) => (
                  <li
                    key={s}
                    className="border-b border-line py-3 font-mono text-body-sm text-ink"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div>
              <p className="text-micro font-mono uppercase text-ink-muted">You provide</p>
              <ul className="mt-4 border-t border-line-strong">
                {study.clientProvides.map((s) => (
                  <li key={s} className="border-b border-line py-3 text-body-base text-ink">
                    {s}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-body-sm text-ink-soft">
                Nothing starts until the scope, timeline and price are agreed in writing.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ── Measured ─────────────────────────────────────────── */}
      <Section className="border-b border-line">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <Reveal>
            <div>
              <p className="text-micro font-mono uppercase text-ink-muted">Measured</p>
              <h2 className="mt-3 text-display-3 text-ink">
                How this build actually{" "}
                <span className="font-accent italic text-brand">performs</span>
              </h2>
              <p className="mt-4 max-w-xl text-body-lg text-ink-soft">
                Taken from the finished build under throttled conditions, not from a score
                card. All six concept builds share a foundation, so they share these numbers.
              </p>
              <p className="mt-4 max-w-xl text-body-sm text-ink-soft">
                {DELIVERY_PROFILE.conditions} Measured {DELIVERY_PROFILE.measuredOn}.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
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

      {/* ── The disclosure, on the strongest surface on the page ─ */}
      <Section className="bg-surface-ink">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
            <div>
              <p className="text-micro font-mono uppercase text-on-ink-muted">Honestly</p>
              <h2 className="mt-3 text-display-3 text-on-ink">
                What this{" "}
                <span className="font-accent italic">is and isn&rsquo;t</span>
              </h2>
            </div>
            <p className="text-body-lg leading-relaxed text-on-ink-soft">{study.honestly}</p>
          </div>
        </Reveal>
      </Section>

      {/* ── Keep reading ─────────────────────────────────────── */}
      {(posts?.length || related.length > 0) && (
        <Section className="border-t border-line">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            {posts && posts.length > 0 && (
              <Reveal>
                <div>
                  <p className="text-micro font-mono uppercase text-ink-muted">
                    Related reading
                  </p>
                  <ul className="mt-4 border-t border-line-strong">
                    {posts.map((p) => (
                      <li key={p.slug} className="border-b border-line">
                        <Link
                          href={`/blog/${p.slug}`}
                          className="group flex items-baseline justify-between gap-6 py-3.5"
                        >
                          <span className="text-body-base text-ink transition-colors group-hover:text-brand">
                            {p.title}
                          </span>
                          <span className="shrink-0 font-mono text-micro text-ink-muted">
                            {p.read_minutes} min
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}

            {related.length > 0 && (
              <Reveal delay={0.06}>
                <div>
                  <p className="text-micro font-mono uppercase text-ink-muted">
                    Other case studies
                  </p>
                  <ul className="mt-4 border-t border-line-strong">
                    {related.map((c) => (
                      <li key={c.slug} className="border-b border-line">
                        <Link
                          href={`/case-studies/${c.slug}`}
                          className="group block py-3.5"
                        >
                          <span className="text-body-base text-ink transition-colors group-hover:text-brand">
                            {c.title}
                          </span>
                          <span className="mt-1 block font-mono text-micro uppercase text-ink-muted">
                            {c.industry}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}
          </div>
        </Section>
      )}
    </PageShell>
  );
}
