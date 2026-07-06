import Link from "next/link";
import Icon from "./Icons";
import type { ServiceCategory, ServicePackage } from "@/lib/services";
import type { PortfolioItem } from "@/lib/portfolio";

export function ServiceCard({ service }: { service: ServiceCategory }) {
  // Category-wise premium icon styling
  let iconBgColor = "bg-accent-soft text-accent";
  if (service.slug === "website-development") {
    iconBgColor = "bg-blue-50 text-blue-600 border border-blue-100/60";
  } else if (service.slug.includes("ai") || service.slug.includes("automation")) {
    iconBgColor = "bg-purple-50 text-purple-600 border border-purple-100/60";
  } else if (service.slug.includes("seo") || service.slug.includes("marketing") || service.slug.includes("ads")) {
    iconBgColor = "bg-emerald-50 text-emerald-600 border border-emerald-100/60";
  } else if (service.slug.includes("design") || service.slug.includes("branding") || service.slug.includes("video")) {
    iconBgColor = "bg-amber-50 text-amber-600 border border-amber-100/60";
  } else if (service.slug.includes("dashboard") || service.slug.includes("data") || service.slug.includes("analytics")) {
    iconBgColor = "bg-indigo-50 text-indigo-600 border border-indigo-100/60";
  } else {
    iconBgColor = "bg-rose-50 text-rose-600 border border-rose-100/60";
  }

  return (
    <div className="card-lift group relative flex flex-col rounded-2xl border border-line bg-white p-6">
      <div className="flex items-start justify-between">
        <span className={`grid size-12 place-items-center rounded-xl ${iconBgColor}`}>
          <Icon name={service.icon} className="size-6" />
        </span>
        <span className="rounded-full bg-accent/[0.07] px-2.5 py-1 text-[11px] font-semibold text-accent">
          From {service.startingPrice}
        </span>
      </div>
      <h3 className="mt-4 text-lg font-bold text-ink">{service.name}</h3>
      <p className="mt-2 text-sm leading-6 text-ink-soft line-clamp-3">{service.description}</p>
      <div className="mt-auto pt-5 flex items-center gap-2">
        <Link
          href={`/services/${service.slug}`}
          className="flex-1 rounded-full border border-line px-4 py-2 text-center text-sm font-semibold text-ink hover:border-accent hover:text-accent transition-colors"
        >
          View Details
        </Link>
        <Link
          href={`/start-project?service=${service.slug}`}
          className="flex-1 rounded-full bg-ink px-4 py-2 text-center text-sm font-semibold text-white hover:bg-accent transition-colors"
        >
          Submit Requirement
        </Link>
      </div>
    </div>
  );
}

export function PackageCard({
  pkg,
  serviceSlug,
}: {
  pkg: ServicePackage;
  serviceSlug?: string;
}) {
  return (
    <div
      className={`card-lift relative flex flex-col rounded-2xl border p-6 ${
        pkg.highlighted
          ? "border-accent bg-gradient-to-b from-accent-soft to-white shadow-[0_16px_40px_-20px_rgba(40,87,255,0.22)]"
          : "border-line bg-white"
      }`}
    >
      {pkg.highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">
          Most Popular
        </span>
      )}
      <h3 className="text-base font-bold text-ink">{pkg.name}</h3>
      <div className="mt-3">
        <p className="flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
          <span className="text-2xl font-black tracking-tight text-ink">
            {pkg.price === "Custom" ? "Custom quote" : pkg.price}
          </span>
          {pkg.period && <span className="text-xs font-semibold text-ink-soft">{pkg.period}</span>}
        </p>
        <p className="mt-1 text-[11px] leading-4 text-ink-soft">
          Guide price. Final quote updates after the requirement form and review.
        </p>
      </div>
      <ul className="mt-4 space-y-2.5">
        {pkg.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-ink-soft">
            <Icon name="check" className="mt-0.5 size-4 shrink-0 text-mint" />
            {f}
          </li>
        ))}
      </ul>
      <div className="mt-4 space-y-1.5 text-xs text-ink-soft">
        {pkg.delivery && (
          <p className="flex items-center gap-1.5">
            <Icon name="clock" className="size-3.5" /> {pkg.delivery}
          </p>
        )}
        {pkg.revisions && (
          <p className="flex items-center gap-1.5">
            <Icon name="check" className="size-3.5" /> {pkg.revisions}
          </p>
        )}
      </div>
      <Link
        href={serviceSlug ? `/start-project?service=${serviceSlug}` : "/start-project"}
        className={`mt-auto pt-5 block rounded-full px-4 py-2.5 text-center text-sm font-semibold transition-colors ${
          pkg.highlighted
            ? "bg-accent text-white hover:bg-accent-deep"
            : "border border-line text-ink hover:border-accent hover:text-accent"
        }`}
      >
        Get This Package
      </Link>
    </div>
  );
}

export function PortfolioCard({ item }: { item: PortfolioItem }) {
  return (
    <div className="card-lift group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white">
      <div
        className="relative h-44 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${item.accent}18, ${item.accent}30)`,
        }}
      >
        <div className="absolute inset-0 bg-grid opacity-60" />
        <span
          className="absolute left-5 top-5 grid size-12 place-items-center rounded-xl text-white shadow-lg"
          style={{ background: item.accent }}
        >
          <Icon name={item.icon} className="size-6" />
        </span>
        {item.isDemo && (
          <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-ink-soft backdrop-blur">
            Demo Concept
          </span>
        )}
        <span className="absolute bottom-4 left-5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink backdrop-blur">
          {item.industry}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-bold text-ink">{item.title}</h3>
        <p className="mt-2 text-sm leading-6 text-ink-soft">
          <span className="font-semibold text-ink">Problem: </span>
          {item.problem}
        </p>
        <p className="mt-2 text-sm leading-6 text-ink-soft">
          <span className="font-semibold text-ink">Solution: </span>
          {item.solution}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {item.features.slice(0, 4).map((f) => (
            <span key={f} className="rounded-full bg-black/[0.04] px-2.5 py-1 text-[11px] font-medium text-ink-soft">
              {f}
            </span>
          ))}
        </div>
        <Link
          href={`/start-project?service=${item.category === "AI & Automation" ? "ai-automation" : item.category === "Data & Dashboards" ? "data-dashboard" : "website-development"}`}
          className="mt-auto pt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-deep"
        >
          Want a similar project?
          <Icon name="arrow" className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
