import type { Metadata } from "next";
import Link from "next/link";
import PageShell, { PageHero } from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icons";
import { Section, SectionHeading } from "@/components/Section";
import { DEMO_CONCEPTS, type DemoConcept } from "@/lib/demoConcepts";

export const metadata: Metadata = {
  alternates: { canonical: "/references" },
  title: "Reference Layouts & Project Ideas",
  description:
    "Browse real reference layouts, AI automation ideas, dashboards and business systems Skilloura can build from — pick one as a starting point for your own project.",
};

type RefGroup = {
  title: string;
  desc: string;
  category: keyof typeof DEMO_CONCEPTS;
  ids: string[];
};

const groups: RefGroup[] = [
  {
    title: "Website Layout References",
    desc: "Starting layouts for common business types — used as a base, then customized to your brand and content.",
    category: "website-development",
    ids: ["web-local", "web-education", "web-clinic", "web-realestate", "web-portfolio"],
  },
  {
    title: "AI / Automation Ideas",
    desc: "Automation workflows that save manual hours — WhatsApp replies, invoice handling, bookings and reports.",
    category: "ai-automation",
    ids: ["ai-support", "ai-leads", "ai-invoice", "ai-bookingbot", "ai-reports"],
  },
  {
    title: "Dashboard Ideas",
    desc: "Live dashboards that turn scattered Excel sheets and raw numbers into a single clear view.",
    category: "data-dashboard",
    ids: ["dash-sales", "dash-finance", "dash-inventory", "dash-marketing", "dash-exec"],
  },
  {
    title: "Business System Ideas",
    desc: "Custom internal systems — portals, CRMs and booking engines — built around how your business actually runs.",
    category: "custom-software",
    ids: ["soft-crm", "soft-billing", "soft-portal", "soft-booking", "soft-erp"],
  },
];

function findConcept(category: keyof typeof DEMO_CONCEPTS, id: string): DemoConcept | undefined {
  return DEMO_CONCEPTS[category]?.find((c) => c.id === id);
}

export default function ReferencesPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="References"
        title={
          <>
            Reference layouts &{" "}
            <span className="font-accent font-normal text-accent">project ideas</span>
          </>
        }
        subtitle="A starting library of layouts, automations, dashboards and systems across common business types. Pick one closest to what you need, or use it as a jumping-off point — every build is customized to your actual content, brand and workflow."
      />

      {groups.map((group, gi) => (
        <Section key={group.category} className={gi % 2 === 1 ? "bg-soft-panel border-b border-line" : "border-b border-line"}>
          <Reveal>
            <SectionHeading eyebrow={`0${gi + 1}`} title={group.title} subtitle={group.desc} center={false} />
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {group.ids.map((id, i) => {
              const concept = findConcept(group.category, id);
              if (!concept) return null;
              return (
                <Reveal key={id} delay={Math.min(i * 0.05, 0.2)}>
                  <Link
                    href={`/demo/${id}`}
                    className="card-lift group flex h-full flex-col rounded-2xl border border-line bg-white p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className="grid size-10 shrink-0 place-items-center rounded-xl text-white"
                        style={{ background: concept.accent }}
                      >
                        <Icon name={concept.icon} className="size-5" />
                      </span>
                      <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-accent">
                        Reference
                      </span>
                    </div>
                    <h3 className="mt-4 text-sm font-bold text-ink">{concept.title}</h3>
                    <p className="mt-1 text-xs font-semibold text-ink-soft">{concept.tag}</p>
                    <p className="mt-2 text-xs leading-5 text-ink-soft line-clamp-3">{concept.description}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-accent">
                      View reference{" "}
                      <Icon name="arrow" className="size-3 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </Section>
      ))}

      <Section>
        <Reveal>
          <div className="mx-auto max-w-2xl rounded-3xl border border-line bg-white p-8 text-center sm:p-10">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
              More references are available during requirement discussion
            </h2>
            <p className="mt-3 text-sm leading-7 text-ink-soft">
              This is a starting selection, not the full list. Share your industry and requirement
              and we&apos;ll show you the closest-fit reference, plus a clear plan and price before
              you commit to anything.
            </p>
            <Link
              href="/start-project"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-deep transition-colors"
            >
              Submit Project Requirement <Icon name="arrow" className="size-4" />
            </Link>
          </div>
        </Reveal>
      </Section>
    </PageShell>
  );
}
