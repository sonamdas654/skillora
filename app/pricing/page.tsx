import type { Metadata } from "next";
import Link from "next/link";
import PageShell, { PageHero } from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icons";
import JsonLd from "@/components/JsonLd";
import { Section } from "@/components/Section";
import { PackageCard } from "@/components/Cards";
import { serviceCategories } from "@/lib/services";
import { maintenancePlans } from "@/lib/maintenancePlans";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/pricing" },
  title: "Pricing — Transparent Packages for Every Digital Service",
  description:
    "Transparent guide pricing for websites, apps, AI automation, design, video, marketing, dashboards and more. Your final quote depends on scope, features, timeline and integrations — always in writing before any payment.",
};

const paymentRules = [
  "Project starts after 40–50% advance payment",
  "Final delivery after full payment",
  "Urgent work may have extra charge",
  "Extra revision is paid",
  "Major scope change is extra cost",
  "Source code included only if mentioned in package/agreement",
];

const paymentMethods = [
  "UPI",
  "Bank transfer",
  "Razorpay",
  "Payment link",
  "QR code",
  "Invoice-based payment",
];

/**
 * Pricing.
 *
 * The longest scroll on the site and, before this, the one with the least
 * shape variety: nine service sections each ending in a package grid, plus
 * maintenance — ten near-identical grids, forty-odd cards, alternated by
 * `idx % 2` background, with no comparison view and no way to jump to the
 * service you came for.
 *
 * Two things fix that without losing a single package:
 *
 * 1. A price index at the top — every service, its starting price and its
 *    timeline in one ledger. Someone comparing can now compare, in one place,
 *    before committing to the scroll.
 * 2. A sticky rail that jumps to any service. Ten sections is a document, and
 *    documents need contents.
 *
 * The alternating background is gone; sections are separated by hairlines, so
 * the page reads as one continuous price list rather than ten stacked slabs.
 *
 * Also adds the Offer schema the page never had, despite being the most
 * commercially explicit page on the site.
 */
export default function PricingPage() {
  const anchorFor = (slug: string) => `price-${slug}`;

  return (
    <PageShell>
      <JsonLd
        data={serviceCategories.map((service) => ({
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.name,
          url: `${site.url}/services/${service.slug}`,
          description: service.description,
          provider: { "@id": "https://www.skilloura.com/#organization" },
          offers: service.packages.map((pkg) => ({
            "@type": "Offer",
            name: pkg.name,
            description: pkg.features.join(". "),
            priceCurrency: "INR",
            priceSpecification: {
              "@type": "PriceSpecification",
              priceCurrency: "INR",
              // Guide prices are "from" figures, which is what minPrice means.
              minPrice: pkg.price.replace(/[^\d]/g, "") || undefined,
              valueAddedTaxIncluded: false,
            },
            url: `${site.url}/start-project?service=${service.slug}`,
          })),
        }))}
      />

      <PageHero
        eyebrow="Pricing"
        title={
          <>
            Transparent pricing,{" "}
            <span className="font-accent italic text-brand">zero surprises</span>
          </>
        }
        subtitle="Guide prices for typical scopes. Your final quote depends on features, timeline, integrations and any third-party costs (domain, hosting, paid APIs) — and is confirmed in writing before any payment."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Pricing", path: "/pricing" },
        ]}
      />

      {/* ── Price index. Compare first, scroll second. ────────── */}
      <Section className="border-b border-line">
        <Reveal>
          <h2 className="text-micro font-mono uppercase text-ink-muted">
            Everything, at a glance
          </h2>
          <dl className="mt-4 border-t border-line-strong">
            {serviceCategories.map((service) => (
              <a
                key={service.slug}
                href={`#${anchorFor(service.slug)}`}
                className="grid grid-cols-[1fr_auto_auto] items-baseline gap-x-6 border-b border-line py-3 transition-colors hover:bg-surface"
              >
                <dt className="text-body-base font-medium text-ink">{service.name}</dt>
                <dd className="hidden font-mono text-body-sm text-ink-soft sm:block">
                  {service.timeline}
                </dd>
                <dd className="w-24 text-right font-mono text-body-base font-medium text-ink">
                  {service.startingPrice}
                </dd>
              </a>
            ))}
          </dl>
        </Reveal>
      </Section>

      {/* ── Packages, service by service ──────────────────────── */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-4 lg:gap-14">
          {/* Contents rail. Ten sections is a document. */}
          <nav
            aria-label="Jump to a service"
            className="lg:sticky lg:top-28 lg:col-span-1 lg:self-start"
          >
            <p className="text-micro font-mono uppercase text-ink-muted">Jump to</p>
            <ol className="mt-3 border-t border-line">
              {serviceCategories.map((service, i) => (
                <li key={service.slug} className="border-b border-line">
                  <a
                    href={`#${anchorFor(service.slug)}`}
                    className="flex gap-3 py-2.5 text-body-sm text-ink-soft transition-colors hover:text-brand"
                  >
                    <span className="shrink-0 font-mono text-micro text-ink-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {service.shortName}
                  </a>
                </li>
              ))}
              <li className="border-b border-line">
                <a
                  href="#price-maintenance"
                  className="flex gap-3 py-2.5 text-body-sm text-ink-soft transition-colors hover:text-brand"
                >
                  <span className="shrink-0 font-mono text-micro text-ink-muted">10</span>
                  Maintenance
                </a>
              </li>
            </ol>
          </nav>

          <div className="lg:col-span-3">
            {serviceCategories.map((service, idx) => (
              <section
                key={service.slug}
                id={anchorFor(service.slug)}
                className={`scroll-mt-28 border-b border-line pb-12 ${idx > 0 ? "pt-12" : ""}`}
              >
                <Reveal>
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <p className="text-micro font-mono uppercase text-ink-muted">
                        {String(idx + 1).padStart(2, "0")} — {service.tab}
                      </p>
                      <h2 className="mt-2 font-display text-display-3 text-ink">
                        {service.name}
                      </h2>
                      <p className="mt-1 font-mono text-body-sm text-ink-soft">
                        Timeline {service.timeline}
                      </p>
                    </div>
                    <Link
                      href={`/services/${service.slug}`}
                      className="group inline-flex items-center gap-1.5 text-body-sm font-semibold text-brand"
                    >
                      Service details
                      <Icon
                        name="arrow"
                        className="size-4 transition-transform group-hover:translate-x-0.5"
                      />
                    </Link>
                  </div>
                </Reveal>
                <div
                  className={`mt-7 grid gap-5 sm:grid-cols-2 ${
                    service.packages.length > 3 ? "xl:grid-cols-4" : "xl:grid-cols-3"
                  }`}
                >
                  {service.packages.map((pkg, i) => (
                    <Reveal key={pkg.name} delay={Math.min(i * 0.05, 0.2)}>
                      <PackageCard pkg={pkg} serviceSlug={service.slug} />
                    </Reveal>
                  ))}
                </div>
              </section>
            ))}

            <section id="price-maintenance" className="scroll-mt-28 pt-12">
              <Reveal>
                <p className="text-micro font-mono uppercase text-ink-muted">
                  10 — After delivery
                </p>
                <h2 className="mt-2 font-display text-display-3 text-ink">Maintenance plans</h2>
                <p className="mt-3 max-w-2xl text-body-lg text-ink-soft">
                  Keep the site safe, fast and growing after launch, from ₹1,999/month. Quoted
                  separately from hosting, domain, paid APIs and ad spend — the project form adds
                  it only if you select it.
                </p>
              </Reveal>
              <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {maintenancePlans.map((pkg, i) => (
                  <Reveal key={pkg.name} delay={i * 0.06}>
                    <PackageCard pkg={pkg} />
                  </Reveal>
                ))}
              </div>
            </section>
          </div>
        </div>
      </Section>

      {/* ── How payment works ─────────────────────────────────── */}
      <Section className="border-t border-line bg-surface-sunken">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <div>
              <p className="text-micro font-mono uppercase text-ink-muted">Payment rules</p>
              <h2 className="mt-3 text-display-3 text-ink">
                How payment{" "}
                <span className="font-accent italic text-brand">works</span>
              </h2>
              <p className="mt-3 max-w-xl text-body-lg text-ink-soft">
                Simple, professional and fair to both sides. The full terms are in the payment
                policy.
              </p>
              <ol className="mt-6 border-t border-line-strong">
                {paymentRules.map((rule, i) => (
                  <li
                    key={rule}
                    className="flex items-baseline gap-4 border-b border-line py-3"
                  >
                    <span className="w-6 shrink-0 font-mono text-micro text-ink-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-body-base text-ink">{rule}</span>
                  </li>
                ))}
              </ol>
              <Link
                href="/payment-policy"
                className="mt-6 inline-flex items-center gap-2 text-body-sm font-semibold text-brand"
              >
                Read the full payment policy
                <Icon name="arrow" className="size-4" />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-card border border-line bg-surface p-6 shadow-e1">
              <h3 className="text-title-2 text-ink">Accepted payment methods</h3>
              <ul className="mt-4 border-t border-line">
                {paymentMethods.map((m) => (
                  <li
                    key={m}
                    className="border-b border-line py-2.5 text-body-base text-ink"
                  >
                    {m}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-body-sm text-ink-soft">
                Every payment gets a proper invoice. Milestone-based payment is available for
                larger custom projects.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>
    </PageShell>
  );
}
