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
    <section className="relative overflow-hidden border-b border-line bg-canvas">
      <div className="absolute inset-0 bg-hero-glow" aria-hidden />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="aura aura-1" />
      </div>

      <div className="relative mx-auto max-w-page px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        {crumbs && <Breadcrumbs items={crumbs} />}

        <div
          className={
            aside
              ? "grid items-end gap-10 lg:grid-cols-[1.15fr_0.85fr]"
              : centered
                ? "mx-auto max-w-3xl text-center"
                : "max-w-3xl"
          }
        >
          <div>
            {eyebrow && (
              <p
                className={`flex items-center gap-2.5 text-micro font-mono uppercase text-ink-soft ${
                  centered ? "justify-center" : ""
                }`}
              >
                <span aria-hidden className="block h-2.5 w-px bg-brand" />
                {eyebrow}
              </p>
            )}
            <h1 className="mt-4 text-display-2 text-ink">{title}</h1>
            {subtitle && (
              <p
                className={`mt-4 max-w-2xl text-body-lg text-ink-soft ${centered ? "mx-auto" : ""}`}
              >
                {subtitle}
              </p>
            )}
            {actions && (
              <div
                className={`mt-7 flex flex-wrap items-center gap-3 ${centered ? "justify-center" : ""}`}
              >
                {actions}
              </div>
            )}
          </div>

          {aside && <div>{aside}</div>}
        </div>
      </div>
    </section>
  );
}
