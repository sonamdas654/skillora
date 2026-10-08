import type { Metadata } from "next";
import Image from "next/image";
import PageShell, { PageHero } from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import SpecLedger from "@/components/ui/SpecLedger";
import { Section } from "@/components/Section";
import { site, whatsappLink } from "@/lib/site";
import { founderProfileSchema } from "@/lib/schema";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "About — The Story Behind Skilloura",
  description:
    "Skilloura means Skill + Aura: a multidisciplinary digital services company with founder-led vision and a structured team delivery process.",
};

const values = [
  {
    title: "Honesty over hype",
    desc: "We let the work and the process speak. Concept builds are shown as live, working demos, and everything is put in writing before you pay.",
  },
  {
    title: "Clarity before commitment",
    desc: "Written scope, transparent pricing and a preview before final payment. You always know what you're paying for.",
  },
  {
    title: "Clear accountability",
    desc: "Direct, straightforward communication — no runaround between departments, no passing the blame.",
  },
  {
    title: "Long-term thinking",
    desc: "Maintenance plans, documentation and training videos — because a delivered project should keep working after handover.",
  },
];

/**
 * About — the trust page, and the only place a person appears on this site.
 *
 * The content was always the strongest part; the presentation worked against
 * it. Four values rendered as four identical cards each carrying the *same*
 * "spark" icon, which is repetition at its most literal. Four stat boxes sat
 * beside prose that did not need them. The founder's story — the actual
 * reason to trust this business — was squeezed into a card next to a photo
 * card, and the page closed on the same CTA panel as eight other pages.
 *
 * It also carried no page-level structured data whatsoever, despite stating
 * real, checkable credentials. That is now a ProfilePage.
 *
 * Every word of copy is unchanged.
 */
export default function AboutPage() {
  return (
    <PageShell>
      <JsonLd data={founderProfileSchema()} />

      <PageHero
        eyebrow="About"
        title={
          <>
            Skill + <span className="font-accent italic text-brand">Aura</span> = Skilloura
          </>
        }
        subtitle={site.positioning}
        crumbs={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]}
        aside={
          <SpecLedger
            caption="The business, in numbers"
            rows={[
              { label: "Service categories", value: "9" },
              { label: "Process", value: "8 steps" },
              { label: "Response time", value: "24h" },
              { label: "Written scope", value: "100%" },
            ]}
          />
        }
      />

      {/* ── The name ──────────────────────────────────────────── */}
      <Section className="border-b border-line">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <div>
              <p className="text-micro font-mono uppercase text-ink-muted">The name</p>
              <h2 className="mt-3 text-display-3 text-ink">
                Why <span className="font-accent italic text-brand">Skilloura?</span>
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="max-w-prose space-y-5 text-body-lg text-ink-soft">
              <p>
                <strong className="font-semibold text-ink">Skilloura = Skill + Aura.</strong> A
                company where your skills create a strong professional impact. &ldquo;Aura&rdquo;
                means positive impression and identity — exactly what good digital work should
                give your business.
              </p>
              <p>
                This is not a marketplace like Fiverr or Upwork. Skilloura is a multidisciplinary
                digital services company: each requirement moves through a structured team process
                from specialist review to delivery. That means clear communication, defined
                accountability and work that matches the approved scope.
              </p>
              <p>
                The tagline says it all:{" "}
                <em className="font-accent text-ink">{site.tagline}</em>
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ── Values. Four numbered commitments, not four identical
             cards wearing the same icon. ─────────────────────────── */}
      <Section className="border-b border-line bg-surface-sunken">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-micro font-mono uppercase text-ink-muted">Values</p>
            <h2 className="mt-3 text-display-3 text-ink">
              How we <span className="font-accent italic text-brand">work</span>
            </h2>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <ol className="mt-10 border-t border-line-strong">
            {values.map((v, i) => (
              <li
                key={v.title}
                className="grid gap-x-8 gap-y-2 border-b border-line py-6 md:grid-cols-[auto_minmax(0,16rem)_1fr]"
              >
                <span className="font-mono text-micro text-ink-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-title-2 text-ink">{v.title}</h3>
                <p className="max-w-2xl text-body-base text-ink-soft">{v.desc}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </Section>

      {/* ── The person ────────────────────────────────────────── */}
      <Section>
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-micro font-mono uppercase text-ink-muted">Founder &amp; leadership</p>
            <h2 className="mt-3 text-display-3 text-ink">
              A clear vision,{" "}
              <span className="font-accent italic text-brand">built by a capable team</span>
            </h2>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-14">
          <Reveal>
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Image
                src="/sonam-das-founder-skilloura.webp"
                alt="Sonam Das, founder of Skilloura"
                width={420}
                height={525}
                className="aspect-4/5 w-full rounded-card border border-line object-cover object-top shadow-e3"
              />
              <p className="mt-5 font-display text-title-1 text-ink">Sonam Das</p>
              <p className="text-body-base font-semibold text-brand">Founder, Skilloura</p>
              <SpecLedger
                className="mt-5"
                rows={[
                  { label: "Qualification", value: "M.Tech, BITS Pilani" },
                  { label: "Hands-on", value: "~10 years" },
                  { label: "Enterprise IT", value: "5+ years" },
                ]}
              />
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="max-w-prose space-y-5 text-body-lg leading-relaxed text-ink-soft">
              <p>Hi, I&apos;m Sonam, founder of Skilloura.</p>
              <p>
                I built Skilloura to deliver digital projects with enterprise-level clarity,
                strong accountability and professional execution. Every project is assigned to
                the right specialists and follows a defined process: requirements are reviewed,
                scope is written before payment, previews are shared and handover is documented.
              </p>
              <p>
                My role is to set the standard for how work gets delivered. Project managers,
                designers, developers, automation specialists and quality reviewers work together
                through the delivery lifecycle, with leadership oversight at key milestones.
              </p>
              <p>
                Skilloura is backed by nearly a decade of hands-on experience across websites,
                software systems, AI automation, dashboards, cloud-based solutions and digital
                operations, along with 5+ years of enterprise IT experience and an M.Tech from
                BITS Pilani. This mix of technical depth, enterprise discipline and practical
                execution shapes how every project is handled here.
              </p>
              <p>
                The reason Skilloura exists is simple:{" "}
                <strong className="font-semibold text-ink">
                  digital projects deserve better than vague promises, unclear scope and
                  uncertain delivery.
                </strong>{" "}
                Clients should know exactly what they are getting, how the work will move
                forward, what it will cost, and when they can review it.
              </p>
              <p>That is the standard Skilloura is built on.</p>

              <p className="border-t border-line pt-5">
                Questions before starting? Message directly on{" "}
                <a
                  href={whatsappLink("Hi! I read the About page and have a question.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-success underline underline-offset-2"
                >
                  WhatsApp
                </a>{" "}
                or email{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="font-semibold text-brand underline underline-offset-2"
                >
                  {site.email}
                </a>
                . You&apos;ll get a real, direct reply, not an autoresponder.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>
    </PageShell>
  );
}
