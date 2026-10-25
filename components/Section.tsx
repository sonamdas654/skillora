import { ReactNode } from "react";

export function Section({
  children,
  className = "",
  id,
  // 64/96px, down from 96/128.
  //
  // It went up to 96/128 because the approved reference was airier than the
  // site was. Measured across eighteen routes afterwards, that was costing
  // 12,070px of vertical padding site-wide, and on the shortest bands it was
  // most of the band: 70% of the "Honestly" note on a case study, 58% of
  // "The problem" on a solution page, 49% of "The name" on /about.
  //
  // 96px a side is still generous. The complaint was never that sections
  // touched each other — it was that every page ran longer than its content
  // needed. Exactly one section overrides this (app/page.tsx), and it came
  // down by the same proportion.
  padding = "py-16 sm:py-24",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  padding?: string;
}) {
  return (
    <section id={id} className={`defer-paint ${padding} ${className}`}>
      <div className="mx-auto max-w-page px-5 sm:px-8 lg:px-12">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = true,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={`max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
      {/* A mono micro-label with a brand tick, matching PageHero.
          It used to be a bordered pill, which meant the site had two
          different eyebrow treatments — pills on the sections that use this
          component, tick labels on every page header — and pills were on the
          brief's banned list to begin with. One system, one eyebrow. */}
      {eyebrow && (
        <p
          className={`mb-3 flex items-center gap-2.5 text-micro font-mono uppercase text-ink-soft ${
            center ? "justify-center" : ""
          }`}
        >
          <span aria-hidden className="block h-2.5 w-px bg-brand" />
          {eyebrow}
        </p>
      )}
      <h2 className="text-display-3 sm:text-display-2  font-bold tracking-tight leading-tight text-ink">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-body-base sm:text-title-2 leading-7 text-ink-soft">{subtitle}</p>
      )}
    </div>
  );
}
