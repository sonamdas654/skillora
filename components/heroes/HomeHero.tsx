import Link from "next/link";
import Image from "next/image";
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

/**
 * The four stages, named, directly under the hero.
 *
 * They already appear further down the page with a sentence each. This is the
 * summary, not a second copy: names only, above the fold, because it is the
 * promise the whole business runs on and a visitor should not have to scroll
 * to learn that a written scope comes before any payment.
 */
const STAGES = [
  { n: "01", label: "Requirements", note: "One smart form for your project type." },
  { n: "02", label: "Written scope", note: "Itemised, with a fixed quote and dates." },
  { n: "03", label: "Build", note: "Preview and approve before final payment." },
  { n: "04", label: "Handover", note: "Code, hosting and accounts, all yours." },
];

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

          {/* ── Evidence, composed in depth ──────────────────
              The stage used to sit flat on the page. It now has two more
              builds standing behind it, angled away under a shared
              perspective, so the hero reads as a stack of real work rather
              than one screenshot in a frame.

              Depth here is four CSS transforms and nothing else — no WebGL, no
              animation loop, no JavaScript at all. The panels are the posters
              VideoStage has already rendered, so they cost no extra request;
              they are lazy and aria-hidden because they are scenery, and the
              stage beside them is the real thing.

              Hidden below lg: at that width they would either overlap the
              stage or push the page sideways, and a horizontal scrollbar on a
              phone is a worse outcome than a flat hero. */}
          <div
            className="rise relative"
            style={{ ["--rise-delay" as string]: "200ms", perspective: "1600px" }}
          >
            <div
              className="pointer-events-none absolute inset-0 hidden lg:block"
              style={{ transformStyle: "preserve-3d" }}
              aria-hidden
            >
              {heroScenes.slice(1, 3).map((s, i) => (
                <div
                  key={s.id}
                  className="absolute overflow-hidden rounded-panel shadow-e3 ring-1 ring-ink/10"
                  style={{
                    // Offset up-and-right, then down-and-right, so each panel
                    // shows a clean corner past the stage instead of hiding
                    // behind it. Kept inside the column: a first attempt hung
                    // them off the right edge and they simply vanished under
                    // the stage, which is worse than no depth at all.
                    // Both stay INSIDE the stage's vertical bounds. The
                    // second one previously ran to -6% and sat behind the
                    // caption line beneath the stage, greying out the one
                    // sentence that tells a visitor what they are looking at.
                    // Decoration must never sit on top of the explanation.
                    inset: i === 0 ? "-7% 3% 16% 12%" : "10% 6% 5% 20%",
                    transform: `translateZ(${-120 - i * 80}px) rotateY(-${7 + i * 3}deg) rotateX(${1.5 + i}deg)`,
                    opacity: i === 0 ? 0.55 : 0.34,
                  }}
                >
                  <Image
                    src={s.poster.webp.src}
                    alt=""
                    fill
                    sizes="22vw"
                    loading="lazy"
                    className="object-cover object-left-top"
                  />
                </div>
              ))}
            </div>

            <div className="relative" style={{ transform: "rotateY(-2.5deg)" }}>
              <VideoStage scenes={heroScenes} />
            </div>
          </div>
        </div>

        {/* ── The four stages ──────────────────────────────────
            A connected rail, not four more cards. The line runs through every
            tick so the eye reads it as one sequence with an order, which is
            what a process is — and it is the same scope-line motif the rest of
            the site uses for dividers and list markers. */}
        <ol className="rise mt-14 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4"
            style={{ ["--rise-delay" as string]: "380ms" }}>
          {STAGES.map((s, i) => (
            <li key={s.n} className="relative">
              <div className="relative border-t border-line-strong pt-4">
                {/* The tick, and the run of line that connects it forward. */}
                <span aria-hidden className="absolute -top-1 left-0 block size-2 rounded-pill bg-brand" />
                {i < STAGES.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute -top-px left-2 hidden h-px w-[calc(100%+2rem)] bg-brand/25 lg:block"
                  />
                )}
                <p className="font-mono text-micro text-ink-muted">{s.n}</p>
                <h2 className="mt-1.5 text-body-base font-semibold uppercase tracking-wide text-ink">
                  {s.label}
                </h2>
                <p className="mt-1.5 text-body-sm leading-relaxed text-ink-soft">{s.note}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
