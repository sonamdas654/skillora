import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import PageShell, { PageHero } from "@/components/PageShell";
import { Section } from "@/components/Section";
import Icon from "@/components/Icons";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import FaqAccordion from "@/components/FaqAccordion";
import SpecLedger from "@/components/ui/SpecLedger";
import { solutions, getSolution } from "@/lib/solutions";
import { getService } from "@/lib/services";
import { faqSchema, solutionServiceSchema } from "@/lib/schema";

export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sol = getSolution(slug);
  if (!sol) return {};
  return {
    title: sol.metaTitle,
    description: sol.metaDescription,
    alternates: { canonical: `/solutions/${slug}` },
  };
}

/**
 * Industry solution — four pages, each targeting a real local search intent.
 *
 * The previous version stacked everything into one narrow column: three
 * centred stat cards, a bulleted problem list, two checklist columns, two
 * cross-link cards, four static FAQ boxes and a gradient CTA. No composition
 * changed down the page, the FAQs did not use the accordion the rest of the
 * site uses, and the CTA now duplicates the footer's closing band.
 *
 * It also carried its own `const BASE = "https://www.skilloura.com"` for an
 * inline Service schema — a second copy of the canonical origin, which is how
 * the hostname mismatch in this repo started. That schema moved to
 * lib/schema.ts.
 *
 * Content is unchanged: same problem list, same inclusions, same client
 * responsibilities, same FAQs, same demo and cost-guide links.
 */
export default async function SolutionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sol = getSolution(slug);
  if (!sol) notFound();

  const service = getService(sol.serviceSlug);

  return (
    <PageShell>
      <JsonLd
        data={[
          solutionServiceSchema(sol, service?.name ?? "Digital services"),
          faqSchema(sol.faqs),
        ]}
      />

      <PageHero
        eyebrow={`For ${sol.audience}`}
        title={sol.h1}
        subtitle={sol.intro}
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Solutions", path: "/solutions" },
          { name: sol.audience, path: `/solutions/${sol.slug}` },
        ]}
        actions={
          <>
            <Link
              href={`/start-project?service=${sol.serviceSlug}`}
              className="inline-flex items-center gap-2 rounded-pill bg-brand px-6 py-3.5 text-body-base font-semibold text-on-brand shadow-brand transition-colors hover:bg-brand-deep"
            >
              Get my project plan
              <Icon name="arrow" className="size-4" />
            </Link>
            {sol.demoPath && (
              <Link
                href={sol.demoPath}
                className="inline-flex items-center gap-2 rounded-pill border border-line-strong bg-surface px-5 py-3.5 text-body-base font-semibold text-ink shadow-e1 transition-colors hover:border-brand hover:text-brand"
              >
                {sol.demoLabel ?? "See a live build"}
              </Link>
            )}
          </>
        }
        aside={
          <SpecLedger
            caption="At a glance"
            rows={[
              { label: "Guide price from", value: sol.priceFrom },
              { label: "Typical timeline", value: sol.timeline },
              { label: "Written scope", value: "Before payment" },
            ]}
          />
        }
      />

      {/* ── The problem, stated plainly ───────────────────────── */}
      <Section className="border-b border-line bg-surface-sunken">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <div>
              <p className="text-micro font-mono uppercase text-ink-muted">The problem</p>
              <h2 className="mt-3 text-display-3 text-ink">
                What this actually{" "}
                <span className="font-accent italic text-brand">fixes</span>
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <ul className="border-t border-line-strong">
              {sol.problem.map((p) => (
                <li key={p} className="border-b border-line py-4 text-body-lg text-ink-soft">
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* ── The exchange ──────────────────────────────────────── */}
      <Section className="border-b border-line">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
          <Reveal>
            <div>
              <h2 className="text-title-1 text-ink">What&apos;s included</h2>
              <ol className="mt-5 border-t border-line-strong">
                {sol.included.map((f, i) => (
                  <li key={f} className="flex items-baseline gap-4 border-b border-line py-3.5">
                    <span className="w-6 shrink-0 font-mono text-micro text-ink-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-body-base text-ink">{f}</span>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-card border border-line bg-surface p-6 shadow-e1">
              <h2 className="text-title-2 text-ink">What you provide</h2>
              <ul className="mt-5 space-y-3">
                {sol.clientProvides.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-body-sm text-ink">
                    <span
                      aria-hidden
                      className="mt-1.5 block size-1.5 shrink-0 rounded-pill bg-brand"
                    />
                    {f}
                  </li>
                ))}
              </ul>

              {sol.blogSlug && (
                <Link
                  href={`/blog/${sol.blogSlug}`}
                  className="mt-6 flex items-center justify-between gap-3 border-t border-line pt-5 text-body-sm font-semibold text-brand"
                >
                  Read the honest cost guide
                  <Icon name="arrow" className="size-4 shrink-0" />
                </Link>
              )}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ── Questions. The footer owns the close. ─────────────── */}
      <Section>
        <div className="mx-auto max-w-prose">
          <Reveal>
            <p className="text-micro font-mono uppercase text-ink-muted">Questions</p>
            <h2 className="mt-3 text-display-3 text-ink">
              What{" "}
              <span className="font-accent italic text-brand">
                {sol.audience.toLowerCase()}
              </span>{" "}
              usually ask
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="mt-8">
              <FaqAccordion faqs={sol.faqs} />
            </div>
          </Reveal>

          {service && (
            <Reveal delay={0.12}>
              <Link
                href={`/services/${sol.serviceSlug}`}
                className="mt-8 flex items-center justify-between gap-4 rounded-card border border-line bg-surface p-5 shadow-e1 transition-colors hover:border-brand"
              >
                <span>
                  <span className="block text-micro font-mono uppercase text-ink-muted">
                    Full service
                  </span>
                  <span className="mt-1 block text-body-base font-semibold text-ink">
                    {service.name} — packages and pricing
                  </span>
                </span>
                <Icon name="arrow" className="size-5 shrink-0 text-brand" />
              </Link>
            </Reveal>
          )}
        </div>
      </Section>
    </PageShell>
  );
}
