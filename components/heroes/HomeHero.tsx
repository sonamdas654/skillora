import Link from "next/link";
import Icon from "@/components/Icons";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import VideoStage from "./VideoStage";
import { heroScenes } from "@/lib/heroScenes";
import { whatsappLink } from "@/lib/site";

/**
 * The homepage hero.
 *
 * Composition is deliberately not "headline + paragraph + two buttons on a
 * dark gradient". The right column is real footage of work a visitor can open
 * for themselves, and the left column ends on the scope line — the motif that
 * carries this business's actual promise, which is that you get the scope in
 * writing before you pay anything.
 *
 * Everything above the fold is server-rendered and uses the CSS `.rise`
 * entrance rather than a scroll reveal, so the first viewport paints
 * immediately and is never blank while JavaScript loads.
 */

const PROOF = [
  { value: "₹7,000", label: "Transparent starting price", note: "Guide pricing, confirmed in writing." },
  { value: "24h", label: "Founder review window", note: "Replies come from Sonam, not a queue." },
  { value: "100%", label: "Code & asset handover", note: "Repository, hosting and accounts are yours." },
];

export default function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-canvas">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="aura aura-1" />
        <div className="aura aura-2" />
      </div>

      <div className="relative mx-auto max-w-page px-4 pb-14 pt-24 sm:px-6 sm:pb-16 sm:pt-28 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14">
          {/* ── Proposition ─────────────────────────────────── */}
          <div>
            <p className="rise inline-flex items-center gap-2.5 text-micro font-mono uppercase text-ink-soft">
              <span className="animate-signal-pulse block size-2 rounded-pill bg-signal" />
              Accepting projects · founder-led
            </p>

            <h1
              className="rise mt-5 text-display-1 text-ink"
              style={{ ["--rise-delay" as string]: "80ms" }}
            >
              Websites, apps and AI systems, built to a{" "}
              <em className="font-accent aura-text not-italic">
                <span className="italic">written scope</span>
              </em>
            </h1>

            <p
              className="rise mt-5 max-w-lg text-body-lg text-ink-soft"
              style={{ ["--rise-delay" as string]: "160ms" }}
            >
              Share the requirement once. Get an itemised scope, a fixed quote and exact
              dates — before you pay anything.
            </p>

            <div
              className="rise mt-7 flex flex-wrap items-center gap-3"
              style={{ ["--rise-delay" as string]: "240ms" }}
            >
              <Link
                href="/start-project"
                className="inline-flex items-center gap-2 rounded-pill bg-brand px-6 py-3.5 text-body-base font-semibold text-on-brand shadow-brand transition-colors hover:bg-brand-deep"
              >
                Get my written scope
                <Icon name="arrow" className="size-4" />
              </Link>
              <a
                href={whatsappLink("Hi! I'd like to discuss a project with Skilloura.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-pill border border-line-strong bg-surface px-5 py-3.5 text-body-base font-semibold text-ink shadow-e1 transition-colors hover:border-brand hover:text-brand"
              >
                <WhatsAppIcon className="size-4 text-success" />
                Ask on WhatsApp
              </a>
            </div>

            {/* The scope line: one measured rule, one signal tick. */}
            <dl
              className="rise scope-line mt-9 grid grid-cols-3 gap-5"
              style={{ ["--rise-delay" as string]: "320ms" }}
            >
              {PROOF.map((item) => (
                <div key={item.label}>
                  <dt className="font-mono text-title-2 tabular-nums text-ink">{item.value}</dt>
                  <dd className="mt-1 text-micro font-semibold uppercase tracking-normal text-ink">
                    {item.label}
                  </dd>
                  <dd className="mt-0.5 hidden text-body-sm text-ink-soft sm:block">{item.note}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* ── Evidence ────────────────────────────────────── */}
          <div className="rise" style={{ ["--rise-delay" as string]: "200ms" }}>
            <VideoStage scenes={heroScenes} />
          </div>
        </div>
      </div>
    </section>
  );
}
