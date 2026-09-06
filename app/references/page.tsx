import type { Metadata } from "next";
import Link from "next/link";
import PageShell, { PageHero } from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import SpecLedger from "@/components/ui/SpecLedger";
import Icon from "@/components/Icons";
import { Section } from "@/components/Section";
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
  const total = groups.reduce((n, g) => n + g.ids.length, 0);

  return (
    <PageShell>
      <PageHero
        eyebrow="References"
        title={
          <>
            Reference layouts &{" "}
            <span className="font-accent italic text-brand">project ideas</span>
          </>
        }
        subtitle="A starting library of layouts, automations, dashboards and systems across common business types. Pick the one closest to what you need — every build is customised to your actual content, brand and workflow."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "References", path: "/references" },
        ]}
        aside={
          <SpecLedger
            caption="This library"
            rows={[
              { label: "References shown", value: `${total}` },
              { label: "Categories", value: `${groups.length}` },
              { label: "All openable", value: "Live" },
            ]}
          />
        }
      />

      {/* One continuous index. This used to be the same three-column card grid
          rendered four times with an `idx % 2` alternating background — twenty
          near-identical cards and no sense of a library. */}
      <Section>
        {groups.map((group, gi) => (
          <div key={group.category} className={gi > 0 ? "mt-16" : ""}>
            <Reveal>
              <div className="border-b border-line-strong pb-4">
                <p className="text-micro font-mono uppercase text-ink-muted">
                  {String(gi + 1).padStart(2, "0")} — {group.ids.length} references
                </p>
                <h2 className="mt-2 font-display text-display-3 text-ink">{group.title}</h2>
                <p className="mt-2 max-w-2xl text-body-base text-ink-soft">{group.desc}</p>
              </div>
            </Reveal>

            <div>
              {group.ids.map((id, i) => {
                const concept = findConcept(group.category, id);
                if (!concept) return null;
                return (
                  <Reveal key={id} delay={Math.min(i * 0.05, 0.2)}>
                    <Link
                      href={`/demo/${id}`}
                      className="group grid gap-x-8 gap-y-2 border-b border-line py-5 md:grid-cols-[minmax(0,18rem)_1fr_auto] md:items-baseline"
                    >
                      <h3 className="font-display text-title-2 text-ink transition-colors group-hover:text-brand">
                        {concept.title}
                      </h3>
                      <p className="max-w-2xl text-body-sm text-ink-soft">
                        <span className="font-mono text-micro uppercase text-ink-muted">
                          {concept.tag}
                        </span>{" "}
                        — {concept.description}
                      </p>
                      <span className="inline-flex shrink-0 items-center gap-1.5 text-body-sm font-semibold text-brand">
                        Open
                        <Icon
                          name="arrow"
                          className="size-4 transition-transform group-hover:translate-x-0.5"
                        />
                      </span>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        ))}

        <Reveal>
          <p className="mt-12 max-w-2xl text-body-base text-ink-soft">
            This is a starting selection, not the full list. Share your industry and
            requirement and we&apos;ll show you the closest-fit reference, plus a clear plan
            and price before you commit to anything.
          </p>
        </Reveal>
      </Section>
    </PageShell>
  );
}
