import type { Metadata } from "next";
import Link from "next/link";
import PageShell, { PageHero } from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icons";
import { Section, SectionHeading } from "@/components/Section";

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
    title: "I review and contact you",
    desc: "Every request is personally reviewed — your answers, files and references. I reply within 24 hours on your preferred channel with questions or a proposal.",
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
      <PageHero
        eyebrow="Process"
        title={
          <>
            A process built for{" "}
            <span className="font-accent font-normal text-accent">clarity</span>
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
                <span className="relative z-10 grid size-11 shrink-0 place-items-center rounded-full bg-accent text-sm font-bold text-white shadow-[0_8px_20px_-8px_rgba(40,87,255,0.7)]">
                  {i + 1}
                </span>
                <div className="rounded-2xl border border-line bg-white p-6 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-lg font-bold text-ink">{step.title}</h2>
                    <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
                      {step.forYou}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-ink-soft">{step.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="bg-wash-mint border-y border-line">
        <Reveal>
          <SectionHeading
            eyebrow="Your protection"
            title={
              <>
                What protects{" "}
                <span className="font-accent font-normal text-accent">your money</span>
              </>
            }
          />
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {protections.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.05}>
              <div className="card-lift h-full rounded-2xl border border-line bg-background p-6">
                <Icon name="shield" className="size-6 text-mint" />
                <h3 className="mt-3 text-base font-bold text-ink">{p.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-soft">{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <Reveal>
          <div className="rounded-3xl bg-gradient-to-br from-accent to-accent-deep p-8 sm:p-14 text-center text-white">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Experience the process{" "}
              <span className="font-accent font-normal">yourself</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/85">
              Submitting a requirement is free and there&apos;s no obligation until you approve a
              written quotation.
            </p>
            <Link
              href="/start-project"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-bold text-accent hover:scale-[1.03] transition-transform"
            >
              Submit Project Requirement <Icon name="arrow" className="size-5" />
            </Link>
          </div>
        </Reveal>
      </Section>
    </PageShell>
  );
}
