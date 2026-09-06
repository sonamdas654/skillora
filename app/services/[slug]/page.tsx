import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import PageShell, { PageHero } from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icons";
import FaqAccordion from "@/components/FaqAccordion";
import SpecLedger from "@/components/ui/SpecLedger";
import { Section } from "@/components/Section";
import { PackageCard } from "@/components/Cards";
import { serviceCategories, getService } from "@/lib/services";
import { whatsappLink } from "@/lib/site";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import JsonLd from "@/components/JsonLd";
import { serviceSchema, faqSchema } from "@/lib/schema";

export function generateStaticParams() {
  return serviceCategories.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: `${service.name} — Get a Custom Quote`,
    description: service.description,
    alternates: { canonical: `/services/${slug}` },
  };
}

/**
 * Service detail — nine pages, and the highest-value commercial template on
 * the site.
 *
 * It was already the strongest page here, but four of its six sections were
 * patterns the brief rules out: an eyebrow pill, three identical checklist
 * columns, a floating cloud of fifteen pills, and a grid of icon cards. It
 * also ended on a gradient CTA panel that now duplicates the footer's closing
 * band, which is the "same closing card on nine pages" problem.
 *
 * Every section now has a distinct composition, and no two consecutive
 * sections share one:
 *
 *   hero        editorial split, with a spec ledger as the evidence column
 *   the brief   a two-column exchange — what you get, what you provide
 *   scope       a numbered index of project types, not a pill cloud
 *   proof       one row per industry, each opening a real working build
 *   pricing     package comparison, the one place a card grid earns its place
 *   questions   a single narrow accordion; the footer owns the close
 *
 * Content is unchanged: same nine services, same copy, same packages, same
 * FAQs, same demo links.
 */
export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const startHref = `/start-project?service=${service.slug}`;

  return (
    <PageShell>
      {/* Breadcrumb schema is emitted by the visible trail in PageHero, so it
          is not repeated here. */}
      <JsonLd data={[serviceSchema(service), faqSchema(service.faqs)]} />

      <PageHero
        eyebrow={service.tab}
        title={service.name}
        subtitle={service.description}
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.name, path: `/services/${service.slug}` },
        ]}
        actions={
          <>
            <Link
              href={startHref}
              className="inline-flex items-center gap-2 rounded-pill bg-brand px-6 py-3.5 text-body-base font-semibold text-on-brand shadow-brand transition-colors hover:bg-brand-deep"
            >
              Get a written scope
              <Icon name="arrow" className="size-4" />
            </Link>
            <a
              href={whatsappLink(`Hi! I'm interested in ${service.name}. Can we discuss?`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-pill border border-line-strong bg-surface px-5 py-3.5 text-body-base font-semibold text-ink shadow-e1 transition-colors hover:border-success hover:text-success"
            >
              <WhatsAppIcon className="size-4 text-success" />
              Discuss on WhatsApp
            </a>
          </>
        }
        aside={
          <SpecLedger
            caption="At a glance"
            rows={[
              { label: "Starting price", value: service.startingPrice },
              { label: "Typical timeline", value: service.timeline },
              { label: "Project types", value: `${service.services.length}` },
              { label: "Packages", value: `${service.packages.length}` },
            ]}
          />
        }
      />

      {/* ── The exchange: what you get, what you provide ─────── */}
      <Section className="border-b border-line">
        <Reveal>
          <p className="max-w-3xl text-body-lg text-ink-soft">
            <span className="font-semibold text-ink">Who it&apos;s for — </span>
            {service.bestFor}. {service.outcome}
          </p>
        </Reveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
          <Reveal>
            <div>
              <h2 className="text-title-1 text-ink">What you get</h2>
              <ol className="mt-5 border-t border-line-strong">
                {service.whatYouGet.map((item, i) => (
                  <li
                    key={item}
                    className="flex items-baseline gap-4 border-b border-line py-3.5"
                  >
                    <span className="w-6 shrink-0 font-mono text-micro text-ink-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-body-base text-ink">{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-card border border-line bg-surface p-6 shadow-e1">
              <h2 className="text-title-2 text-ink">What we need from you</h2>
              <p className="mt-2 text-body-sm text-ink-soft">
                Have these ready and the scope comes back faster. Nothing here is a
                blocker — we work with what you have.
              </p>
              <ul className="mt-5 space-y-3">
                {service.needFromYou.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-body-sm text-ink">
                    <span
                      aria-hidden
                      className="mt-1.5 block size-1.5 shrink-0 rounded-pill bg-brand"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ── Scope: a numbered index, not a pill cloud ─────────── */}
      <Section className="border-b border-line bg-surface-sunken">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-micro font-mono uppercase text-ink-muted">Scope</p>
            <h2 className="mt-3 text-display-3 text-ink">
              Everything that falls under{" "}
              <span className="font-accent italic text-brand">{service.shortName}</span>
            </h2>
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <ul className="mt-8 grid border-t border-line-strong sm:grid-cols-2 lg:grid-cols-3">
            {service.services.map((s, i) => (
              <li
                key={s}
                className="flex items-baseline gap-4 border-b border-line py-3 sm:odd:border-r sm:odd:pr-6 sm:even:pl-6 lg:[&:nth-child(3n+1)]:pl-0 lg:[&:nth-child(3n+1)]:pr-6 lg:[&:nth-child(3n+2)]:border-r lg:[&:nth-child(3n+2)]:px-6 lg:[&:nth-child(3n)]:pl-6"
              >
                <span className="w-6 shrink-0 font-mono text-micro text-ink-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-body-base text-ink">{s}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      {/* ── Proof: each industry opens a real working build ───── */}
      {service.industries && service.industries.length > 0 && (
        <Section className="border-b border-line">
          <Reveal>
            <div className="max-w-2xl">
              <p className="text-micro font-mono uppercase text-ink-muted">Proof</p>
              <h2 className="mt-3 text-display-3 text-ink">
                Open a build for your{" "}
                <span className="font-accent italic text-brand">line of business</span>
              </h2>
              <p className="mt-3 text-body-lg text-ink-soft">
                Not screenshots. Each of these is a working page you can click through
                right now.
              </p>
            </div>
          </Reveal>

          <div className="mt-10 border-t border-line-strong">
            {service.industries.map((ind, i) => (
              <Reveal key={ind.name} delay={Math.min(i * 0.05, 0.2)}>
                <Link
                  href={ind.demoHref}
                  className="group grid items-center gap-x-6 gap-y-3 border-b border-line py-6 transition-colors hover:bg-surface md:grid-cols-[auto_minmax(0,14rem)_1fr_auto]"
                >
                  <span className="font-mono text-micro text-ink-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-title-2 text-ink">{ind.name}</h3>
                  <ul className="flex flex-wrap gap-x-4 gap-y-1">
                    {ind.features.map((f) => (
                      <li key={f} className="text-body-sm text-ink-soft">
                        {f}
                      </li>
                    ))}
                  </ul>
                  <span className="inline-flex items-center gap-2 text-body-sm font-semibold text-brand">
                    Open the build
                    <Icon
                      name="arrow"
                      className="size-4 transition-transform group-hover:translate-x-0.5"
                    />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {/* ── Pricing: the one place a card grid earns its place ── */}
      <Section className="border-b border-line bg-surface-sunken">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-micro font-mono uppercase text-ink-muted">Pricing</p>
            <h2 className="mt-3 text-display-3 text-ink">Packages and guide prices</h2>
            <p className="mt-3 text-body-lg text-ink-soft">
              Guide prices for typical scopes. Your exact quotation depends on the
              features you actually need, and it is always confirmed in writing before
              anything starts.
            </p>
          </div>
        </Reveal>
        <div
          className={`mt-10 grid gap-5 sm:grid-cols-2 ${
            service.packages.length > 3 ? "lg:grid-cols-4" : "lg:grid-cols-3"
          }`}
        >
          {service.packages.map((pkg, i) => (
            <Reveal key={pkg.name} delay={Math.min(i * 0.06, 0.3)}>
              <PackageCard pkg={pkg} serviceSlug={service.slug} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Questions. The footer owns the close. ─────────────── */}
      <Section>
        <div className="mx-auto max-w-prose">
          <Reveal>
            <p className="text-micro font-mono uppercase text-ink-muted">Questions</p>
            <h2 className="mt-3 text-display-3 text-ink">
              Before you send the{" "}
              <span className="font-accent italic text-brand">requirement</span>
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="mt-8">
              <FaqAccordion faqs={service.faqs} />
            </div>
          </Reveal>
        </div>
      </Section>
    </PageShell>
  );
}
