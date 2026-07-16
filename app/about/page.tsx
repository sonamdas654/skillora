import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageShell, { PageHero } from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icons";
import { Section, SectionHeading } from "@/components/Section";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "About — The Story Behind Skilloura",
  description:
    "Skilloura means Skill + Aura: digital services delivered with professional impact. A personal digital agency with a clear requirement-based process.",
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
    title: "One accountable person",
    desc: "You talk directly to the person doing the work. No account managers, no telephone game, no blame-shifting.",
  },
  {
    title: "Long-term thinking",
    desc: "Maintenance plans, documentation and training videos — because a delivered project should keep working after handover.",
  },
];

export default function AboutPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="About"
        title={
          <>
            Skill +{" "}
            <span className="font-accent font-normal text-accent">Aura</span> = Skilloura
          </>
        }
        subtitle={site.positioning}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-2 items-center">
          <Reveal>
            <div>
              <SectionHeading
                center={false}
                eyebrow="The name"
                title={
                  <>
                    Why{" "}
                    <span className="font-accent font-normal text-accent">Skilloura?</span>
                  </>
                }
              />
              <div className="mt-6 space-y-4 text-sm sm:text-base leading-7 text-ink-soft">
                <p>
                  <strong className="text-ink">Skilloura = Skill + Aura.</strong> A company where
                  your skills create a strong professional impact. “Aura” means positive
                  impression and identity — exactly what good digital work should give your
                  business.
                </p>
                <p>
                  This is not a marketplace like Fiverr or Upwork. Skilloura is a personal digital
                  agency: you submit your requirement directly, and the same person who reviews
                  it builds it. That means faster communication, full accountability and work
                  that actually matches what you asked for.
                </p>
                <p>
                  The tagline says it all:{" "}
                  <em className="font-accent text-ink">{site.tagline}</em>
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="grid grid-cols-2 gap-4">
              {[
                { k: "9", v: "Service categories" },
                { k: "8-step", v: "Clear process" },
                { k: "24h", v: "Response time" },
                { k: "100%", v: "Written scope" },
              ].map((stat) => (
                <div key={stat.v} className="rounded-2xl border border-line bg-white p-6 text-center">
                  <p className="text-3xl font-extrabold text-accent">{stat.k}</p>
                  <p className="mt-1 text-sm font-medium text-ink-soft">{stat.v}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      <Section className="bg-wash-blue border-y border-line">
        <Reveal>
          <SectionHeading
            eyebrow="Values"
            title={
              <>
                How I{" "}
                <span className="font-accent font-normal text-accent">work</span>
              </>
            }
          />
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.05}>
              <div className="card-lift h-full rounded-2xl border border-line bg-background p-7">
                <Icon name="spark" className="size-6 text-accent" />
                <h3 className="mt-3 text-lg font-bold text-ink">{v.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-soft">{v.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Founder / person behind the work — real accountability, no stock faces */}
      <Section className="bg-soft-panel border-b border-line">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <SectionHeading
              eyebrow="The person behind it"
              title={
                <>
                  One builder,{" "}
                  <span className="font-accent font-normal text-accent">full accountability</span>
                </>
              }
            />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 rounded-3xl border border-line bg-white p-7 sm:p-9 shadow-[0_24px_60px_-30px_rgba(11,19,48,0.2)]">
              <div className="mb-6 flex items-center gap-5 border-b border-line pb-6">
                <Image
                  src="/founder.png"
                  alt="Sonam Das, founder of Skilloura"
                  width={280}
                  height={350}
                  className="h-40 w-32 sm:h-48 sm:w-40 shrink-0 rounded-2xl object-cover object-top ring-1 ring-line shadow-md"
                />
                <div>
                  <p className="text-xl font-bold text-ink">Sonam Das</p>
                  <p className="text-sm font-semibold text-accent">Founder, Skilloura</p>
                  <p className="mt-1 text-xs text-ink-soft">
                    M.Tech, BITS Pilani · ~5 years in enterprise IT
                  </p>
                </div>
              </div>
              <div className="space-y-4 text-sm sm:text-base leading-7 text-ink-soft">
                <p>
                  Hi, I&apos;m Sonam — I run Skilloura myself. I&apos;m the person who reads your
                  requirement, asks the follow-up questions, writes your quotation and actually builds
                  the project. There&apos;s no sales team promising something a delivery team then has
                  to walk back, because it&apos;s the same person end to end.
                </p>
                <p>
                  Before this, I spent close to five years in enterprise IT — websites, internal
                  software, AI automation, dashboards, cloud deployments — after finishing my M.Tech at
                  BITS Pilani. What pushed me to start Skilloura was seeing the same pattern over and
                  over with small businesses: they&apos;d hire a freelancer or an agency, get a vague
                  verbal promise, and then get burned — scope quietly growing, a developer going quiet
                  mid-project, a bill that didn&apos;t match what was discussed.
                </p>
                <p>
                  Every process on this site — the requirement form, the written scope before payment,
                  the preview before delivery — exists because of one belief:{" "}
                  <strong className="text-ink">
                    clients don&apos;t get burned by bad developers as often as they get burned by
                    unclear agreements.
                  </strong>{" "}
                  Fix the clarity, and the work mostly takes care of itself.
                </p>
                <p>
                  Questions before starting? Message directly on{" "}
                  <a
                    href={whatsappLink("Hi! I read the About page and have a question.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-mint hover:underline"
                  >
                    WhatsApp
                  </a>{" "}
                  or email{" "}
                  <a href={`mailto:${site.email}`} className="font-semibold text-accent hover:underline">
                    {site.email}
                  </a>
                  . You&apos;ll get a reply from the person who&apos;ll actually do the work.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section>
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-ink">
              Let&apos;s build something{" "}
              <span className="font-accent font-normal text-accent">worth showing off</span>
            </h2>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/start-project"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-deep transition-colors"
              >
                Submit Project Requirement <Icon name="arrow" className="size-4" />
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-6 py-3 text-sm font-semibold text-ink hover:border-accent hover:text-accent transition-colors"
              >
                See the portfolio
              </Link>
            </div>
          </div>
        </Reveal>
      </Section>
    </PageShell>
  );
}
