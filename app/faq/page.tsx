import type { Metadata } from "next";
import Link from "next/link";
import PageShell, { PageHero } from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icons";
import FaqAccordion from "@/components/FaqAccordion";
import { Section } from "@/components/Section";
import { allFaqs } from "@/lib/faqs";
import { whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ — Pricing, Process, Revisions & Delivery Questions",
  description:
    "Answers to common questions about submitting projects, advance payment, revisions, file uploads, delivery and maintenance at Skilloura.",
};

export default function FaqPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="FAQ"
        title={
          <>
            Frequently asked{" "}
            <span className="font-accent font-normal text-accent">questions</span>
          </>
        }
        subtitle="Everything clients usually ask before starting — pricing, process, revisions, ownership and delivery."
      />
      <Section>
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <FaqAccordion faqs={allFaqs} />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 rounded-2xl border border-line bg-white p-8 text-center">
              <h2 className="text-xl font-bold text-ink">Still have a question?</h2>
              <p className="mt-2 text-sm text-ink-soft">
                Ask directly — no bots, no scripted replies.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <a
                  href={whatsappLink("Hi! I have a question that's not in your FAQ.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-mint px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  Ask on WhatsApp
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink hover:border-accent hover:text-accent transition-colors"
                >
                  Use contact form <Icon name="arrow" className="size-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </PageShell>
  );
}
