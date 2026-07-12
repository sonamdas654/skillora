import type { Metadata } from "next";
import Link from "next/link";
import PageShell, { PageHero } from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icons";
import { Section, SectionHeading } from "@/components/Section";
import { PackageCard } from "@/components/Cards";
import { serviceCategories } from "@/lib/services";

export const metadata: Metadata = {
  alternates: { canonical: "/pricing" },
  title: "Pricing — Transparent Packages for Every Digital Service",
  description:
    "Transparent guide pricing for websites, apps, AI automation, design, video, marketing, dashboards and more. Your final quote depends on scope, features, timeline and integrations — always in writing before any payment.",
};

import { maintenancePlans } from "@/lib/maintenancePlans";

const paymentRules = [
  "Project starts after 40–50% advance payment",
  "Final delivery after full payment",
  "Urgent work may have extra charge",
  "Extra revision is paid",
  "Major scope change is extra cost",
  "Source code included only if mentioned in package/agreement",
];

export default function PricingPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Pricing"
        title={
          <>
            Transparent pricing,{" "}
            <span className="font-accent font-normal text-accent">zero surprises</span>
          </>
        }
        subtitle="Transparent guide pricing. Your final quote depends on scope, features, timeline, integrations and any third-party costs (domain, hosting, paid APIs) — confirmed in writing before any payment."
      />

      {serviceCategories.map((service, idx) => (
        <Section
          key={service.slug}
          className={idx % 2 === 1 ? "bg-soft-panel border-y border-line" : ""}
        >
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                  {service.tab}
                </p>
                <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-ink">{service.name}</h2>
                <p className="mt-1 text-sm text-ink-soft">Timeline: {service.timeline}</p>
              </div>
              <Link
                href={`/services/${service.slug}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-deep"
              >
                Service details <Icon name="arrow" className="size-4" />
              </Link>
            </div>
          </Reveal>
          <div
            className={`mt-8 grid gap-5 sm:grid-cols-2 ${
              service.packages.length > 3 ? "lg:grid-cols-4" : "lg:grid-cols-3"
            }`}
          >
            {service.packages.map((pkg, i) => (
              <Reveal key={pkg.name} delay={Math.min(i * 0.05, 0.2)}>
                <PackageCard pkg={pkg} serviceSlug={service.slug} />
              </Reveal>
            ))}
          </div>
        </Section>
      ))}

      {/* Maintenance */}
      <Section className="bg-wash-blue border-y border-line">
        <Reveal>
          <SectionHeading
            eyebrow="After delivery"
            title={
              <>
                Maintenance{" "}
                <span className="font-accent font-normal text-accent">Packages</span>
              </>
            }
            subtitle="Keep your site safe, fast and growing after launch — starting at just ₹1,999/month. Maintenance is quoted separately from third-party hosting, domain, paid APIs and ad spend, and the project form adds it only when you select it."
          />
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {maintenancePlans.map((pkg, i) => (
            <Reveal key={pkg.name} delay={i * 0.06}>
              <PackageCard pkg={pkg} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Payment rules */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <div>
              <SectionHeading
                center={false}
                eyebrow="Payment rules"
                title={
                  <>
                    How payment{" "}
                    <span className="font-accent font-normal text-accent">works</span>
                  </>
                }
                subtitle="Simple, professional and fair to both sides. Full details in the payment policy."
              />
              <ul className="mt-6 space-y-3">
                {paymentRules.map((rule) => (
                  <li key={rule} className="flex items-start gap-2.5 text-sm text-ink-soft">
                    <Icon name="check" className="mt-0.5 size-4 shrink-0 text-mint" />
                    {rule}
                  </li>
                ))}
              </ul>
              <Link
                href="/payment-policy"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-deep"
              >
                Read full payment policy <Icon name="arrow" className="size-4" />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-line bg-white p-8">
              <h3 className="text-lg font-bold text-ink">Accepted payment methods</h3>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {["UPI", "Bank transfer", "Razorpay", "Payment link", "QR code", "Invoice-based payment"].map((m) => (
                  <div key={m} className="flex items-center gap-2.5 rounded-xl bg-background px-4 py-3 text-sm font-medium text-ink">
                    <Icon name="check" className="size-4 text-accent" /> {m}
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs leading-5 text-ink-soft">
                Every payment gets a proper invoice. Milestone-based payment available for larger
                custom projects.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>
    </PageShell>
  );
}
