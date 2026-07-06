import type { Metadata } from "next";
import PageShell, { PageHero } from "@/components/PageShell";
import ServicesTabs from "@/components/ServicesTabs";
import Reveal from "@/components/Reveal";
import { Section } from "@/components/Section";
import Link from "next/link";
import Icon from "@/components/Icons";

export const metadata: Metadata = {
  title: "Services — Websites, Apps, AI Automation, Design & More",
  description:
    "Choose from 9 digital service categories: website development, mobile apps, AI automation, branding, video editing, marketing, dashboards, career services and custom software.",
};

export default function ServicesPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Services"
        title={
          <>
            Choose the Service{" "}
            <span className="font-accent font-normal text-accent">You Need</span>
          </>
        }
        subtitle="Select a service below and fill a smart requirement form designed for that project type."
      />
      <Section>
        <ServicesTabs />
      </Section>
      <Section className="pt-0">
        <Reveal>
          <div className="rounded-3xl border border-line bg-white p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-ink">
              Not sure which service fits your problem?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-ink-soft">
              Describe your requirement in plain words and I&apos;ll suggest the right solution —
              honestly, including cheaper options if they fit better.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-deep transition-colors"
            >
              Ask for free guidance <Icon name="arrow" className="size-4" />
            </Link>
          </div>
        </Reveal>
      </Section>
    </PageShell>
  );
}
