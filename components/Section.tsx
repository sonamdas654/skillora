import { ReactNode } from "react";

export function Section({
  children,
  className = "",
  id,
  // 96/128px, up from 80/112. The reference the owner approved is airier
  // than the site was, and section padding is the one lever that changes
  // that everywhere at once rather than page by page.
  padding = "py-24 sm:py-32",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  padding?: string;
}) {
  return (
    <section id={id} className={`${padding} ${className}`}>
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
