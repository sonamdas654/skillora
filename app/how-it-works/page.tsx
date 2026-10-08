import type { Metadata } from "next";
import Link from "next/link";
import PageShell, { PageHero } from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icons";
import { Section, SectionHeading } from "@/components/Section";
import JsonLd from "@/components/JsonLd";
import { howToSchema } from "@/lib/schema";
import {
  SampleQuotation,
  SampleTimeline,
  SampleRevisionChecklist,
  SampleHandoverChecklist,
  SampleInvoice,
} from "@/components/SampleDocs";

export const metadata: Metadata = {
  alternates: { canonical: "/how-it-works" },
  title: "How It Works — Clear 8-Step Project Process",
  description:
   "From requirement submission to final delivery: how projects work at Skilloura. Smart forms, written quotations, preview before delivery and professional handover.",
};

const detailedSteps = [
  {
    title: "Select the service",
    desc: "Browse 9 service categories and pick what fits your need. Each service page shows exactly what's included, pricing and timeline — so you know before you start.",
    forYou: "5 minutes of browsing",
  },
  {
    title: "Fill the smart requirement form",
    desc: "The form changes based on your service. A restaurant website asks about menus and booking; an AI automation asks about your manual process. No irrelevant questions.",
    forYou: "About 3 minutes",
  },
  {
    title: "Upload your files",
    desc: "Logo, menu PDFs, product images, reference videos — attach everything in one place. Files are stored securely and linked only to your request.",
    forYou: "Optional but recommended",
  },
  {
    title: "Submit your request",
    desc: "You get instant confirmation on screen, a confirmation email, and the option to continue directly on WhatsApp with your request pre-filled.",
    forYou: "One click",
  },
  {
    title: "We review and contact you",
    desc: "Every request is properly reviewed — your answers, files and references. We reply within 24 hours on your preferred channel with questions or a proposal.",
    forYou: "Reply within 24 hours",
  },
  {
    title: "Scope, price and timeline finalized",
    desc: "You receive a written quotation: what's included, what's not, exact price, delivery date, revision count and payment terms. Nothing starts until you approve.",
    forYou: "Written quotation, no obligation",
  },
  {
    title: "Advance payment and work start",
    desc: "40–50% advance confirms the project. You get an invoice, a project start confirmation and regular progress updates.",
    forYou: "Invoice + updates",
  },
  {
    title: "Preview, revision and final delivery",
    desc: "You review a working preview first. Included revisions are completed. After your approval and final payment, you receive full delivery: files, access, credentials, documentation and training video.",
    forYou: "Approve before final payment",
  },
];

const protections = [
  { title: "Written scope", desc: "Everything agreed in writing before payment — no he-said-she-said." },
  { title: "Preview before delivery", desc: "You see working output before the final payment." },
  { title: "Clear revision policy", desc: "Included revisions defined upfront; extras always discussed first." },
  { title: "Proper handover", desc: "Credentials, source files (as per agreement), docs and training video." },
];

export default function HowItWorksPage() {
  return (
    <PageShell>
      <JsonLd data={howToSchema(detailedSteps)} />
      <PageHero
        eyebrow="Process"
        title={
          <>
            A process built for{" "}
            <span className="font-accent font-normal text-brand">clarity</span>
          </>
        }
        subtitle="Most freelance projects fail because of unclear requirements and verbal promises. This process fixes both — from the first click to final delivery."
      />

      <Section>
        <div className="mx-auto max-w-3xl">
          {detailedSteps.map((step, i) => (
            <Reveal key={step.title} delay={0.05}>
              <div className="relative flex gap-5 pb-10 last:pb-0">
                {i < detailedSteps.length - 1 && (
                  <span className="absolute left-[22px] top-12 bottom-0 w-px bg-line" aria-hidden />
                )}
                <span className="relative z-10 grid size-11 shrink-0 place-items-center rounded-full bg-brand text-body-sm font-bold text-white shadow-brand">
                  {i + 1}
                </span>
                <div className="rounded-card border border-line bg-surface p-6 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-title-2 font-bold text-ink">{step.title}</h2>
                    <span className="rounded-full bg-brand-soft px-3 py-1 text-body-sm font-semibold text-brand">
                      {step.forYou}
                    </span>
                  </div>
                  <p className="mt-2 text-body-sm leading-6 text-ink-soft">{step.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* What you receive before payment — the written quotation, made visible */}
      <Section className="bg-soft-panel border-y border-line">
        <Reveal>
          <SectionHeading
            eyebrow="Before you pay anything"
            title={
              <>
                What you receive{" "}
                <span className="font-accent font-normal text-brand">before payment</span>
              </>
            }
            subtitle="You approve a written quotation first. It spells out exactly what you get, what you pay and what's excluded — so there are no surprises. Here's a real sample."
          />
        </Reveal>
        <div className="mx-auto mt-10 max-w-3xl">
          <Reveal>
            <SampleQuotation />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
               "Requirement summary",
               "Scope (included)",
               "Timeline",
               "Final quote",
               "Revision count",
               "Payment terms",
               "Exclusions",
              ].map((t) => (
                <div key={t} className="flex items-center gap-2 rounded-field border border-line bg-surface px-3.5 py-2.5">
                  <Icon name="check" className="size-4 shrink-0 text-success" />
                  <span className="text-body-sm font-semibold text-ink">{t}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Sample documents — the paperwork clients actually get */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="See the paperwork"
            title={
              <>
                Sample documents you&apos;ll{" "}
                <span className="font-accent font-normal text-brand">actually get</span>
              </>
            }
            subtitle="Illustrative samples of the timeline, checklists and invoice format used on every project — so you know exactly how things run."
          />
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal><SampleTimeline /></Reveal>
          <Reveal delay={0.05}><SampleRevisionChecklist /></Reveal>
          <Reveal delay={0.1}><SampleHandoverChecklist /></Reveal>
          <Reveal delay={0.15}><SampleInvoice /></Reveal>
        </div>
      </Section>

      <Section className="bg-wash-mint border-y border-line">
        <Reveal>
          <SectionHeading
            eyebrow="Your protection"
            title={
              <>
                What protects{" "}
                <span className="font-accent font-normal text-brand">your money</span>
              </>
            }
          />
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {protections.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.05}>
              <div className="card-lift h-full rounded-card border border-line bg-canvas p-6">
                <Icon name="shield" className="size-6 text-success" />
                <h3 className="mt-3 text-body-base font-bold text-ink">{p.title}</h3>
                <p className="mt-2 text-body-sm leading-6 text-ink-soft">{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <Reveal>
          <div className="rounded-panel bg-gradient-to-br from-accent to-accent-deep p-8 sm:p-14 text-center text-white">
            <h2 className="text-display-3 sm:text-display-2 font-extrabold tracking-tight">
              Experience the process{" "}
              <span className="font-accent font-normal">yourself</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/85">
              Submitting a requirement is free and there&apos;s no obligation until you approve a
              written quotation.
            </p>
            <Link
              href="/start-project"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-surface px-7 py-3.5 text-body-base font-bold text-brand hover:scale-105 transition-transform"
            >
              Submit Project Requirement <Icon name="arrow" className="size-5" />
            </Link>
          </div>
        </Reveal>
      </Section>
    </PageShell>
  );
}
