import { ReactNode } from "react";

export function Section({
  children,
  className = "",
  id,
  padding = "py-20 sm:py-28",
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
      {eyebrow && (
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-soft px-3.5 py-1 text-body-sm font-semibold uppercase tracking-wider text-brand">
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
