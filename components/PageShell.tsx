import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppSticky from "./WhatsAppSticky";
import MobileCtaBar from "./MobileCtaBar";
import Breadcrumbs, { type Crumb } from "./Breadcrumbs";

export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main id="main-content" className="pt-20 sm:pt-22">
        {children}
      </main>
      <Footer />
      <WhatsAppSticky />
      <MobileCtaBar />
    </>
  );
}

/**
 * Page header.
 *
 * Thirteen pages used the previous version and every one of them rendered the
 * same thing: a centred eyebrow pill, a centred h1, a centred subtitle. That
 * uniformity is most of why the interior of the site read as a template.
 *
 * The shape is now variable without any page having to hand-roll markup:
 *
 *   align="start"   the default. Left-aligned, which lets the eyebrow, the
 *                   heading and the actions share one optical edge.
 *   align="center"  kept for pages where a centred statement is genuinely
 *                   right (policies, FAQ).
 *   aside           an evidence column — a price band, a stat, a thumbnail.
 *                   Turns the header into an editorial split.
 *   actions         primary/secondary CTAs inside the header rather than
 *                   floating in the first section below it.
 *   crumbs          renders the visible trail and its BreadcrumbList schema.
 *
 * The eyebrow is a mono micro-label with a brand tick, not a bordered pill —
 * pills were on the banned list, and the tick ties back to the scope line.
 */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  align = "start",
  actions,
  aside,
  crumbs,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  align?: "start" | "center";
  actions?: ReactNode;
  aside?: ReactNode;
  crumbs?: Crumb[];
}) {
  const centered = align === "center" && !aside;

  return (
    <section className="page-hero relative overflow-clip border-b border-line bg-canvas">
      <div className="absolute inset-0 bg-hero-glow" aria-hidden />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="aura aura-1" />
        {/* Two long, very faint arcs. They give the band the curved warmth the
            art direction asks for without another box of decoration, and they
            sit behind the aside rather than competing with it. */}
        <span className="page-hero__arc page-hero__arc--one" />
        <span className="page-hero__arc page-hero__arc--two" />
      </div>

      {/* Tighter than it was: py-14/py-20 left the band taller than its content
          on every page that had no aside, which is most of them. */}
      <div className="relative mx-auto max-w-page px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        {crumbs && <Breadcrumbs items={crumbs} />}

        <div
          className={
            aside
              ? // items-center, not items-end. The aside is a card stack now,
                // not a ledger pinned to the baseline, and ending both columns
                // on the same line left a wedge of empty canvas above the text.
                "grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12"
              : centered
                ? "mx-auto max-w-3xl text-center"
                : "max-w-3xl"
          }
        >
          <div className={aside ? "lg:py-2" : undefined}>
            {eyebrow && (
              <p
                className={`flex items-center gap-2.5 text-micro font-mono uppercase text-ink-soft ${
                  centered ? "justify-center" : ""
                }`}
              >
                <span aria-hidden className="block h-px w-7 bg-brand" />
                {eyebrow}
              </p>
            )}
            <h1 className="mt-3.5 text-display-2 text-ink">{title}</h1>
            {subtitle && (
              <p
                className={`mt-3.5 text-body-lg text-ink-soft ${
                  centered ? "mx-auto max-w-2xl" : "max-w-xl"
                }`}
              >
                {subtitle}
              </p>
            )}
            {actions && (
              <div
                className={`mt-6 flex flex-wrap items-center gap-3 ${centered ? "justify-center" : ""}`}
              >
                {actions}
              </div>
            )}
          </div>

          {aside && <div className="min-w-0">{aside}</div>}
        </div>
      </div>
    </section>
  );
}
