import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icons";
import FaqAccordion from "@/components/FaqAccordion";
import { Section, SectionHeading } from "@/components/Section";
import { PackageCard } from "@/components/Cards";
import { serviceCategories, getService } from "@/lib/services";
import { whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "@/components/Header";

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
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  return (
    <PageShell>
      {/* Service hero */}
      <div className="relative overflow-hidden bg-grid border-b border-line">
        <div className="absolute inset-0 bg-hero-glow" aria-hidden />
        <div className="relative mx-auto max-w-[1520px] px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-white px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-accent shadow-sm">
                {service.tab}
              </p>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.08] text-ink">
                {service.name}
              </h1>
              <p className="mt-4 max-w-2xl text-base sm:text-lg leading-7 text-ink-soft">
                {service.description}
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href={`/start-project?service=${service.slug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_-10px_rgba(40,87,255,0.7)] hover:bg-accent-deep transition-colors"
                >
                  Submit Requirement <Icon name="arrow" className="size-4" />
                </Link>
                <a
                  href={whatsappLink(`Hi! I'm interested in ${service.name}. Can we discuss?`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-6 py-3 text-sm font-semibold text-ink hover:border-mint hover:text-mint transition-colors"
                >
                  <WhatsAppIcon className="size-4 text-mint" /> Discuss on WhatsApp
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Pricing structure", value: "Real-time Estimator", icon: "spark" },
                { label: "Timeline", value: service.timeline, icon: "clock" },
                { label: "Best for", value: service.bestFor, icon: "check" },
                { label: "Options", value: `${service.services.length} project types`, icon: "file" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-line bg-white p-5">
                  <Icon name={stat.icon} className="size-5 text-accent" />
                  <p className="mt-3 text-xs text-ink-soft">{stat.label}</p>
                  <p className="mt-1 text-sm font-bold text-ink leading-snug">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* What's included */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-3">
          <Reveal>
            <div>
              <h2 className="text-xl font-bold text-ink">Who is this for?</h2>
              <ul className="mt-4 space-y-2.5">
                {service.whoFor.map((w) => (
                  <li key={w} className="flex items-start gap-2.5 text-sm text-ink-soft">
                    <Icon name="check" className="mt-0.5 size-4 shrink-0 text-mint" /> {w}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div>
              <h2 className="text-xl font-bold text-ink">What you will get</h2>
              <ul className="mt-4 space-y-2.5">
                {service.whatYouGet.map((w) => (
                  <li key={w} className="flex items-start gap-2.5 text-sm text-ink-soft">
                    <Icon name="check" className="mt-0.5 size-4 shrink-0 text-mint" /> {w}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.16}>
            <div>
              <h2 className="text-xl font-bold text-ink">What I need from you</h2>
              <ul className="mt-4 space-y-2.5">
                {service.needFromYou.map((w) => (
                  <li key={w} className="flex items-start gap-2.5 text-sm text-ink-soft">
                    <Icon name="file" className="mt-0.5 size-4 shrink-0 text-accent" /> {w}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Project types */}
      <Section className="bg-soft-panel border-y border-line">
        <Reveal>
          <SectionHeading
            eyebrow="Project types"
            title={
              <>
                Everything under{" "}
                <span className="font-accent font-normal text-accent">{service.name}</span>
              </>
            }
          />
        </Reveal>
        <div className="mt-10 flex flex-wrap justify-center gap-2.5">
          {service.services.map((s) => (
            <span
              key={s}
              className="rounded-full border border-line bg-background px-4 py-2 text-sm font-medium text-ink"
            >
              {s}
            </span>
          ))}
        </div>
      </Section>

      {/* Packages */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Pricing"
            title={
              <>
                Packages &{" "}
                <span className="font-accent font-normal text-accent">Pricing</span>
              </>
            }
            subtitle="Estimates calculated dynamically — final quotation depends on your exact scope and is always aligned in writing before work begins."
          />
        </Reveal>
        <div className={`mt-12 grid gap-5 sm:grid-cols-2 ${service.packages.length > 3 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          {service.packages.map((pkg, i) => (
            <Reveal key={pkg.name} delay={Math.min(i * 0.06, 0.3)}>
              <PackageCard pkg={pkg} serviceSlug={service.slug} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* FAQ + CTA */}
      <Section className="bg-soft-panel border-t border-line">
        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <div>
              <h2 className="text-2xl font-bold text-ink">Common questions</h2>
              <div className="mt-6">
                <FaqAccordion faqs={service.faqs} />
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-3xl bg-gradient-to-br from-accent to-accent-deep p-8 sm:p-10 text-white">
              <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
                Ready to start your{" "}
                <span className="font-accent font-normal">{service.shortName.toLowerCase()}</span>{" "}
                project?
              </h2>
              <p className="mt-3 text-white/85">
                Fill the smart requirement form — it asks exactly the right questions for this
                service, takes about 3 minutes, and I&apos;ll reply within 24 hours.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/start-project?service=${service.slug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-accent hover:scale-[1.03] transition-transform"
                >
                  Submit Project Requirement <Icon name="arrow" className="size-4" />
                </Link>
                <a
                  href={whatsappLink(`Hi! I want to discuss a ${service.name} project.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  <WhatsAppIcon className="size-4" /> WhatsApp
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </PageShell>
  );
}
