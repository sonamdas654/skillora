"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import Icon from "@/components/Icons";
import { resolveMotionTier } from "@/lib/motion/useMotionTier";
import "./ImpactStage.css";

/**
 * "How this actually runs" — the delivery-system section.
 *
 * Entirely real components: every line of copy, the process list, the CTA and
 * the benefit strip are live DOM, so they stay selectable, translatable,
 * crawlable and keyboard reachable.
 *
 * The workspace plate that used to fill the right half is gone at the owner's
 * request, along with the three floating cards and the framed wall art that sat
 * on it. Rather than leave that half empty, the heading block and the four
 * steps now share the width as two columns — the steps are the substance of
 * this section, so they get the room the photograph was using.
 *
 * Motion contract (components/motion/CONTRACT.md):
 *   - reveal only; nothing here tracks the pointer, so the section re-renders
 *     zero times after mount
 *   - reduced-motion and low-tier devices skip the observer work
 *   - REVEAL IS FAILSAFE: the start-hidden state lives behind `.is-armed`, which
 *     only JS adds, and anything still waiting after 1.2s is shown regardless.
 *     No JS, failed hydration, print and reader mode all render fully visible.
 *     This is the bug that left whole sections permanently blank before.
 */

const STEPS = [
  {
    n: "01",
    icon: "file",
    title: "Requirements",
    body: "We understand your goals, gather references and clarify everything upfront.",
  },
  {
    n: "02",
    icon: "calendar",
    title: "Written scope",
    body: "You get a clear plan with deliverables, price and timelines.",
  },
  {
    n: "03",
    icon: "gear",
    title: "Build & review",
    body: "We design, develop or automate, keep you updated and incorporate your feedback.",
  },
  {
    n: "04",
    icon: "check",
    title: "Handover",
    body: "Final delivery with all files, access and documentation — ready to grow.",
  },
] as const;

/**
 * Faces shown beside the "500+ happy clients" line.
 *
 * These are ILLUSTRATIONS, not photographs, and that is the point. A drawn
 * figure reads as a friendly stand-in; a photograph of a stranger beside a
 * client count reads as a claim that this person is a client. The review
 * carousel makes the same call for the same reason — see the note at
 * components/ReviewCarousel.tsx:36.
 *
 * Real client photographs take priority: add one to CLIENT_AVATARS and that
 * slot renders the photo instead. See public/clients/README.md.
 *
 * Drawn deliberately flat and bold, because they are displayed at 34px, where
 * any finer detail collapses into noise. Colours are the site aura ramp.
 */
const AVATAR_ART = [
  { bg: "#e0913f", garment: "#b4701f", skin: "#f0c9a4", shade: "#dcae86", hair: "#2e2018" },
  { bg: "#dc6a52", garment: "#a8422f", skin: "#c98d62", shade: "#b0774f", hair: "#1f1410" },
  { bg: "#0e5257", garment: "#083a3e", skin: "#e8bb92", shade: "#cfa178", hair: "#241a13" },
] as const;

function AvatarArt({ i }: { i: number }) {
  const c = AVATAR_ART[i % AVATAR_ART.length];
  return (
    <svg viewBox="0 0 64 64" width="64" height="64" aria-hidden focusable="false">
      <circle cx="32" cy="32" r="32" fill={c.bg} />
      <path d="M5 64c0-13.8 12.1-21.5 27-21.5S59 50.2 59 64Z" fill={c.garment} />
      <path d="M27 37h10v10H27z" fill={c.shade} />
      <circle cx="32" cy="27" r="12.5" fill={c.skin} />
      {i === 0 && <path d="M19.5 27C19.5 16.5 25 12 32 12s12.5 4.5 12.5 15c0-6.5-4.5-9-12.5-9s-12.5 2.5-12.5 9Z" fill={c.hair} />}
      {i === 1 && (
        <>
          <circle cx="32" cy="10.5" r="4.5" fill={c.hair} />
          <path d="M19.5 28.5C19.5 17 25 12.5 32 12.5S44.5 17 44.5 28.5c0-7-4.5-9.5-12.5-9.5s-12.5 2.5-12.5 9.5Z" fill={c.hair} />
        </>
      )}
      {i === 2 && (
        <>
          <path d="M19.5 26.5C19.5 16.5 25 12.5 32 12.5s12.5 4 12.5 14c0-6-4.5-8.5-12.5-8.5s-12.5 2.5-12.5 8.5Z" fill={c.hair} />
          <path d="M21.5 29c0 8.5 4.8 12.5 10.5 12.5S42.5 37.5 42.5 29c0 5-4.8 7-10.5 7s-10.5-2-10.5-7Z" fill={c.hair} opacity=".92" />
        </>
      )}
    </svg>
  );
}

/**
 * Photographs shown in the avatar row, which take priority over the drawings.
 *
 * These three are STOCK PHOTOGRAPHS, supplied by the owner and used at their
 * direction — they are not photographs of Skilloura clients. Recorded here so
 * nobody later mistakes them for client proof, and so whoever renews the stock
 * licence knows where they are used. Replace them with real client photographs
 * as those become available.
 *
 * Sources are pre-cropped square around the face at 192px and served through
 * next/image, because the circle is only 2.1rem.
 */
const CLIENT_AVATARS: { src: string; alt: string }[] = [
  { src: "/clients/client-1.webp", alt: "" },
  { src: "/clients/client-2.webp", alt: "" },
  { src: "/clients/client-3.webp", alt: "" },
];

const AVATAR_SLOTS = 3;

const BENEFITS = [
  { icon: "bolt", title: "No more back and forth", body: "Everything in one place." },
  { icon: "users", title: "Direct founder communication", body: "Get clarity, not confusion." },
  { icon: "shield", title: "Transparent process", body: "Know what you pay for." },
  { icon: "clock", title: "Faster project start", body: "Because requirements are clear." },
] as const;

export default function ImpactStage() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Arming is what switches the reveal on. It runs for every visitor,
    // including reduced-motion ones, because the reveal is a fade the
    // reduced-motion stylesheet collapses to an instant show. What must never
    // happen is content stuck at opacity 0 because this effect did not run.
    root.classList.add("is-armed");

    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          reveal.unobserve(entry.target);
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );
    root.querySelectorAll("[data-rise]").forEach((el) => reveal.observe(el));

    // Safety net for the case the observer never fires at all — a zero-height
    // ancestor, a browser that throttles it away, a headless capture that never
    // scrolls. After 1.2s anything still waiting is simply shown.
    const failsafe = window.setTimeout(() => {
      root.querySelectorAll("[data-rise]:not(.is-in)").forEach((el) => el.classList.add("is-in"));
    }, 1200);

    if (resolveMotionTier() !== "full") {
      root.classList.add("is-plain");
    }

    return () => {
      reveal.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  return (
    <section id="how-it-runs" ref={rootRef} className="runs" aria-labelledby="runs-title">
      <div className="runs__inner">
        <div className="runs__head">
          <p className="runs__eyebrow" data-rise>
            A clear delivery system
          </p>

          <h2 id="runs-title" className="runs__title" data-rise style={{ "--rise-i": 1 } as React.CSSProperties}>
            How this actually <span className="runs__script">runs</span>
          </h2>

          <p className="runs__intro" data-rise style={{ "--rise-i": 2 } as React.CSSProperties}>
            Every project starts with a written requirement and ends with a clean, documented handover.
          </p>
        </div>

        <ol className="runs__steps" aria-label="How a project runs, step by step">
          {STEPS.map((step, i) => (
            <li key={step.n} className="runs__step" data-rise style={{ "--rise-i": 2 + i } as React.CSSProperties}>
              <span className="runs__stepNum" aria-hidden>
                {step.n}
              </span>
              <span className="runs__stepTile" aria-hidden>
                <Icon name={step.icon} className="size-5" />
              </span>
              <span className="runs__stepText">
                <strong>{step.title}</strong>
                <small>{step.body}</small>
              </span>
            </li>
          ))}
        </ol>

        <div className="runs__action" data-rise style={{ "--rise-i": 6 } as React.CSSProperties}>
          <Link href="/how-it-works" className="runs__cta">
            See the full process
            <Icon name="arrow" className="runs__ctaArrow size-4" />
          </Link>

          <div className="runs__proof">
            <span className="runs__avatars" aria-hidden>
              {Array.from({ length: AVATAR_SLOTS }, (_, i) => {
                const client = CLIENT_AVATARS[i];
                return client ? (
                  <span key={i} className="runs__avatar runs__avatar--photo">
                    <Image src={client.src} alt={client.alt} width={68} height={68} sizes="34px" />
                  </span>
                ) : (
                  <span key={i} className="runs__avatar runs__avatar--art">
                    <AvatarArt i={i} />
                  </span>
                );
              })}
            </span>
            <span className="runs__proofText">
              <strong>500+ happy clients</strong>
              <small>Clear process. Real results.</small>
            </span>
          </div>

          <p className="runs__sign">
            Your ideas deserve clarity.
            <i aria-hidden />
          </p>
        </div>
      </div>

      <ul className="runs__benefits" aria-label="What this delivery system gives you">
        {BENEFITS.map((benefit, i) => (
          <li key={benefit.title} data-rise style={{ "--rise-i": i } as React.CSSProperties}>
            <span className="runs__benefitIcon" aria-hidden>
              <Icon name={benefit.icon} className="size-5" />
            </span>
            <span className="runs__benefitText">
              <strong>{benefit.title}</strong>
              <small>{benefit.body}</small>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
