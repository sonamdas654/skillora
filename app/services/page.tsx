import type { Metadata } from "next";
import Link from "next/link";
import PageShell, { PageHero } from "@/components/PageShell";
import ServicesTabs from "@/components/ServicesTabs";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icons";
import SpecLedger from "@/components/ui/SpecLedger";
import { Section } from "@/components/Section";
import { serviceCategories, SECONDARY_SERVICE_SLUGS } from "@/lib/services";
import { focusServices } from "@/lib/focusServices";
import JsonLd from "@/components/JsonLd";
import { serviceListSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/services" },
  title: "Services — Websites, Apps, AI Automation, Design & More",
  description:
    "Choose from 9 digital service categories: website development, mobile apps, AI automation, branding, video editing, marketing, dashboards, career services and custom software.",
};

/**
 * Service index.
 *
 * The page file itself used to be a hero, a delegated component and a generic
 * centred CTA card — the CTA being one of nine near-identical closing cards
 * across the site, a job the footer now does. The index below is an editorial
 * list rather than a grid of icon cards; see components/ServicesTabs.tsx.
 */
export default function ServicesPage() {
  const core = serviceCategories.filter((s) => !SECONDARY_SERVICE_SLUGS.includes(s.slug));

  return (
    <PageShell>
      <JsonLd
        data={serviceListSchema(
          [...serviceCategories, ...focusServices],
          `${site.url}/services`
        )}
      />
      <PageHero
        eyebrow="Services"
        title={
          <>
            Nine ways we{" "}
            <span className="font-accent italic text-brand">build</span>
          </>
        }
        subtitle="Pick the one that matches your problem. Each has its own requirement form, so the questions are the right ones for that kind of project."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ]}
        actions={
          <Link
            href="/start-project"
            className="inline-flex items-center gap-2 rounded-pill bg-brand px-6 py-3.5 text-body-base font-semibold text-on-brand shadow-brand transition-colors hover:bg-brand-deep"
          >
            Not sure which? Describe it instead
            <Icon name="arrow" className="size-4" />
          </Link>
        }
        aside={
          <SpecLedger
            caption="How it works everywhere"
            rows={[
              { label: "Core categories", value: `${core.length}` },
              { label: "Also available", value: `${SECONDARY_SERVICE_SLUGS.length}` },
              { label: "Written scope", value: "Before payment" },
              { label: "Reply window", value: "24h" },
            ]}
          />
        }
      />

      <Section>
        <Reveal>
          <ServicesTabs />
        </Reveal>
      </Section>
    </PageShell>
  );
}
