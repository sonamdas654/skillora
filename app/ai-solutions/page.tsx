import type { Metadata } from "next";
import Link from "next/link";
import PageShell, { PageHero } from "@/components/PageShell";
import { Section, SectionHeading } from "@/components/Section";
import Icon from "@/components/Icons";
import Reveal from "@/components/Reveal";
import RoiCalculator from "@/components/RoiCalculator";
import { aiProducts } from "@/lib/aiProducts";

export const metadata: Metadata = {
  alternates: { canonical: "/ai-solutions" },
  title: "AI Systems for Business — WhatsApp Bots, Automation & Reporting",
  description:
    "Specific, productized AI systems for small businesses: WhatsApp lead qualification, support bots, invoice processing, report and reminder automation. Honest guide prices, human-accountable delivery.",
};

export default function AiSolutionsPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="AI systems"
        title={
          <>
            AI that does real work —{" "}
            <span className="font-accent font-normal text-brand">with a human accountable</span>
          </>
        }
        subtitle="Not a vague 'AI automation' pitch. These are specific systems with a clear job, honest guide prices, and a person who reviews, tests and hands them over properly."
      />

      {/* Productized offers */}
      <Section>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {aiProducts.map((p, i) => (
            <Reveal key={p.slug} delay={Math.min(i * 0.05, 0.25)}>
              <div className="card-lift flex h-full flex-col rounded-panel border border-line bg-surface p-6">
                <span className="grid size-11 place-items-center rounded-field bg-brand-soft text-brand">
                  <Icon name={p.icon} className="size-6" />
                </span>
                <h2 className="mt-4 text-title-2 font-bold text-ink">{p.name}</h2>
                <p className="mt-1.5 text-body-sm leading-6 text-ink-soft">{p.tagline}</p>

                <div className="mt-4 space-y-1.5">
                  {p.workflow.slice(0, 3).map((w) => (
                    <p key={w} className="flex items-start gap-2 text-body-sm leading-5 text-ink">
                      <Icon name="check" className="mt-0.5 size-3.5 shrink-0 text-success" />
                      {w}
                    </p>
                  ))}
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-2 text-body-sm">
                  <div className="rounded-lg bg-canvas px-2.5 py-2">
                    <dt className="font-semibold text-ink-soft">From</dt>
                    <dd className="font-bold text-ink">{p.priceFrom}</dd>
                  </div>
                  <div className="rounded-lg bg-canvas px-2.5 py-2">
                    <dt className="font-semibold text-ink-soft">Setup</dt>
                    <dd className="font-bold text-ink">{p.setup}</dd>
                  </div>
                </dl>

                <p className="mt-3 text-[11px] leading-4 text-ink-soft">
                  <span className="font-semibold text-ink">Human fallback:</span> {p.humanFallback}
                </p>
                <p className="mt-1.5 text-[11px] leading-4 text-ink-soft">
                  <span className="font-semibold text-ink">Running cost:</span> {p.monthlyNote}
                </p>

                <Link
                  href="/start-project?service=ai-automation"
                  className="mt-auto pt-5 inline-flex items-center gap-1.5 text-body-sm font-semibold text-brand hover:text-brand-deep"
                >
                  Discuss this system <Icon name="arrow" className="size-4" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-center text-body-sm text-ink-soft">
          Prices are guide starting points. WhatsApp API and AI usage have their own running costs,
          always shown to you up front. Your data is never sold or used to train AI models —{" "}
          <Link href="/data-security" className="font-semibold text-brand hover:underline">
            see how we handle it
          </Link>
          .
        </p>
      </Section>

      {/* ROI calculator */}
      <Section className="bg-soft-panel border-y border-line">
        <Reveal>
          <SectionHeading
            eyebrow="Is it worth it?"
            title={
              <>
                Estimate your{" "}
                <span className="font-accent font-normal text-brand">time & money saved</span>
              </>
            }
            subtitle="A rough, honest estimate — not a guarantee. Put in your real numbers and see the payback."
          />
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mx-auto mt-10 max-w-4xl">
            <RoiCalculator />
          </div>
        </Reveal>
      </Section>

      {/* Discovery Sprint */}
      <Section>
        <Reveal>
          <div className="mx-auto max-w-4xl rounded-panel border border-brand/20 bg-gradient-to-br from-accent-soft via-white to-white p-8 sm:p-10">
            <p className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-surface px-3.5 py-1 text-body-sm font-semibold uppercase tracking-wider text-brand">
              Paid discovery sprint
            </p>
            <h2 className="mt-4 text-title-1 sm:text-display-3 font-bold tracking-tight text-ink">
              Not sure what to build yet? Start with a{" "}
              <span className="font-accent font-normal text-brand">2–3 day sprint</span>
            </h2>
            <p className="mt-3 max-w-2xl text-body-sm leading-7 text-ink-soft">
              For bigger or unclear ideas, we start with a short paid sprint instead of a vague quote.
              You get a proper requirement workshop, a clickable prototype and a clear technical plan —
              so you know exactly what you&apos;re building, what it costs, and whether it&apos;s worth
              it, before committing to a full build.
            </p>
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-3">
              {[
                "Requirement workshop (call + written)",
                "Clickable prototype of the core flow",
                "Technical plan, scope & fixed quote",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 rounded-field bg-surface/70 px-3 py-2.5 text-body-sm font-medium leading-5 text-ink ring-1 ring-line/60">
                  <Icon name="check" className="mt-0.5 size-3.5 shrink-0 text-success" />
                  {f}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-body-sm text-ink-soft">
              The sprint fee is fully adjusted into your project cost if you go ahead with the build.
            </p>
            <Link
              href="/start-project?service=ai-automation&package=Discovery%20Sprint"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-body-sm font-bold text-white hover:bg-brand-deep transition-colors"
            >
              Ask about a discovery sprint <Icon name="arrow" className="size-4" />
            </Link>
          </div>
        </Reveal>
      </Section>
    </PageShell>
  );
}
