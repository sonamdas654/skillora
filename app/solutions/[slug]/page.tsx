import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import PageShell, { PageHero } from "@/components/PageShell";
import { Section } from "@/components/Section";
import Icon from "@/components/Icons";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import { solutions, getSolution } from "@/lib/solutions";
import { getService } from "@/lib/services";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";

const BASE = "https://www.skilloura.com";

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
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Solutions", path: "/solutions" },
            { name: sol.audience, path: `/solutions/${sol.slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: sol.metaTitle,
            url: `${BASE}/solutions/${sol.slug}`,
            description: sol.metaDescription,
            serviceType: service?.name ?? "Digital services",
            areaServed: { "@type": "Country", name: "India" },
            audience: { "@type": "Audience", audienceType: sol.audience },
            provider: { "@id": `${BASE}/#organization` },
          },
          faqSchema(sol.faqs),
        ]}
      />
      <PageHero
        eyebrow={`For ${sol.audience}`}
        title={sol.h1}
        subtitle={sol.intro}
      />
      <Section>
        <div className="mx-auto max-w-4xl">
          {/* Quick facts */}
          <Reveal>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-line bg-white p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-ink-soft">Guide price from</p>
                <p className="mt-1 text-2xl font-extrabold text-ink">{sol.priceFrom}<span className="text-base text-accent">+</span></p>
              </div>
              <div className="rounded-2xl border border-line bg-white p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-ink-soft">Typical timeline</p>
                <p className="mt-1 text-2xl font-extrabold text-ink">{sol.timeline}</p>
              </div>
              <div className="rounded-2xl border border-line bg-white p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-ink-soft">Written scope</p>
                <p className="mt-1 text-2xl font-extrabold text-ink">Before payment</p>
              </div>
            </div>
          </Reveal>

          {/* Problem */}
          <Reveal>
            <div className="mt-10">
              <h2 className="text-2xl font-bold text-ink">The problem we solve</h2>
              <ul className="mt-4 space-y-2.5">
                {sol.problem.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-base leading-7 text-ink-soft">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* What's included */}
          <Reveal>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <div>
                <h2 className="text-2xl font-bold text-ink">What&apos;s included</h2>
                <ul className="mt-4 space-y-2.5">
                  {sol.included.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm leading-6 text-ink">
                      <Icon name="check" className="mt-0.5 size-4 shrink-0 text-mint" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-ink">What you provide</h2>
                <ul className="mt-4 space-y-2.5">
                  {sol.clientProvides.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm leading-6 text-ink-soft">
                      <Icon name="arrow" className="mt-0.5 size-4 shrink-0 text-accent" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          {/* Live demo + cost guide cross-links */}
          <Reveal>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              {sol.demoPath && (
                <Link
                  href={sol.demoPath}
                  className="flex-1 rounded-2xl border border-line bg-white p-5 hover:border-accent/40 card-lift"
                >
                  <p className="text-sm font-bold text-ink">{sol.demoLabel ?? "See a live demo"}</p>
                  <p className="mt-1 text-xs text-ink-soft">A real, working concept you can click through — no sign-up.</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-accent">Open demo <Icon name="arrow" className="size-3.5" /></span>
                </Link>
              )}
              {sol.blogSlug && (
                <Link
                  href={`/blog/${sol.blogSlug}`}
                  className="flex-1 rounded-2xl border border-line bg-white p-5 hover:border-accent/40 card-lift"
                >
                  <p className="text-sm font-bold text-ink">Read the honest cost guide</p>
                  <p className="mt-1 text-xs text-ink-soft">What it really costs and what changes the price — no vague ranges.</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-accent">Read guide <Icon name="arrow" className="size-3.5" /></span>
                </Link>
              )}
            </div>
          </Reveal>

          {/* FAQ */}
          <Reveal>
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-ink">Frequently asked questions</h2>
              <div className="mt-5 space-y-4">
                {sol.faqs.map((f) => (
                  <div key={f.q} className="rounded-2xl border border-line bg-white p-5">
                    <p className="font-bold text-ink">{f.q}</p>
                    <p className="mt-2 text-sm leading-7 text-ink-soft">{f.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* CTA */}
          <Reveal>
            <div className="mt-12 rounded-3xl bg-gradient-to-br from-accent to-accent-deep p-8 text-center text-white">
              <h2 className="text-2xl font-bold">Ready for a {sol.audience.toLowerCase().replace(/ &.*/, "")} project?</h2>
              <p className="mt-2 text-sm text-white/85">
                Share your requirement once and get a written scope, timeline and transparent quote before any payment.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Link
                  href={`/start-project?service=${sol.serviceSlug}`}
                  className="rounded-full bg-white px-6 py-3 text-sm font-bold text-accent hover:scale-[1.03] transition-transform"
                >
                  Get my project plan
                </Link>
                {service && (
                  <Link
                    href={`/services/${sol.serviceSlug}`}
                    className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                  >
                    See {service.name} &amp; pricing
                  </Link>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </PageShell>
  );
}
