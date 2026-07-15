import Link from "next/link";
import Icon from "./Icons";
import PortfolioMockup from "./PortfolioMockup";
import type { ServiceCategory, ServicePackage } from "@/lib/services";
import type { PortfolioItem } from "@/lib/portfolio";

// Per-service visual identity — gradient tile, glow blob, chip and CTA all
// follow the personality of the service (Tailwind needs literal class names).
const SERVICE_THEMES: Record<
  string,
  { tile: string; blob: string; chip: string; button: string; hoverBorder: string }
> = {
  "website-development": {
    tile: "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/30",
    blob: "bg-blue-400/20",
    chip: "bg-blue-50 text-blue-600",
    button: "bg-gradient-to-r from-blue-500 to-indigo-600",
    hoverBorder: "hover:border-blue-300/70",
  },
  "mobile-app-development": {
    tile: "bg-gradient-to-br from-rose-500 to-pink-600 shadow-rose-500/30",
    blob: "bg-rose-400/20",
    chip: "bg-rose-50 text-rose-600",
    button: "bg-gradient-to-r from-rose-500 to-pink-600",
    hoverBorder: "hover:border-rose-300/70",
  },
  "ai-automation": {
    tile: "bg-gradient-to-br from-violet-500 to-purple-600 shadow-violet-500/30",
    blob: "bg-violet-400/20",
    chip: "bg-violet-50 text-violet-600",
    button: "bg-gradient-to-r from-violet-500 to-purple-600",
    hoverBorder: "hover:border-violet-300/70",
  },
  "logo-branding": {
    tile: "bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-500/30",
    blob: "bg-amber-400/20",
    chip: "bg-amber-50 text-amber-600",
    button: "bg-gradient-to-r from-amber-400 to-orange-500",
    hoverBorder: "hover:border-amber-300/70",
  },
  "video-editing": {
    tile: "bg-gradient-to-br from-fuchsia-500 to-pink-500 shadow-fuchsia-500/30",
    blob: "bg-fuchsia-400/20",
    chip: "bg-fuchsia-50 text-fuchsia-600",
    button: "bg-gradient-to-r from-fuchsia-500 to-pink-500",
    hoverBorder: "hover:border-fuchsia-300/70",
  },
  "digital-marketing": {
    tile: "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/30",
    blob: "bg-emerald-400/20",
    chip: "bg-emerald-50 text-emerald-600",
    button: "bg-gradient-to-r from-emerald-500 to-teal-600",
    hoverBorder: "hover:border-emerald-300/70",
  },
  "data-dashboard": {
    tile: "bg-gradient-to-br from-sky-500 to-blue-600 shadow-sky-500/30",
    blob: "bg-sky-400/20",
    chip: "bg-sky-50 text-sky-600",
    button: "bg-gradient-to-r from-sky-500 to-blue-600",
    hoverBorder: "hover:border-sky-300/70",
  },
  "resume-career": {
    tile: "bg-gradient-to-br from-cyan-500 to-teal-500 shadow-cyan-500/30",
    blob: "bg-cyan-400/20",
    chip: "bg-cyan-50 text-cyan-600",
    button: "bg-gradient-to-r from-cyan-500 to-teal-500",
    hoverBorder: "hover:border-cyan-300/70",
  },
  "custom-software": {
    tile: "bg-gradient-to-br from-indigo-500 to-violet-600 shadow-indigo-500/30",
    blob: "bg-indigo-400/20",
    chip: "bg-indigo-50 text-indigo-600",
    button: "bg-gradient-to-r from-indigo-500 to-violet-600",
    hoverBorder: "hover:border-indigo-300/70",
  },
};

const DEFAULT_THEME = SERVICE_THEMES["website-development"];

export function ServiceCard({ service }: { service: ServiceCategory }) {
  const t = SERVICE_THEMES[service.slug] ?? DEFAULT_THEME;

  return (
    <div
      className={`card-lift group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-white p-6 sm:p-7 transition-colors ${t.hoverBorder}`}
    >
      <div
        className={`pointer-events-none absolute -right-14 -top-14 size-44 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-125 ${t.blob}`}
        aria-hidden
      />
      <div className="relative flex items-start justify-between">
        <span
          className={`grid size-14 place-items-center rounded-2xl text-white shadow-lg transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105 ${t.tile}`}
        >
          <Icon name={service.icon} className="size-7" />
        </span>
        <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${t.chip}`}>
          From {service.startingPrice}
        </span>
      </div>
      <h3 className="relative mt-5 text-lg font-bold text-ink">{service.name}</h3>
      <p className="relative mt-2 text-sm leading-6 text-ink-soft line-clamp-3">{service.description}</p>
      <div className="relative mt-auto flex items-center gap-2 pt-6">
        <Link
          href={`/services/${service.slug}`}
          className="flex-1 rounded-full border border-line px-4 py-2.5 text-center text-sm font-semibold text-ink transition-colors hover:border-ink"
        >
          View Details
        </Link>
        <Link
          href={`/start-project?service=${service.slug}`}
          className={`flex-1 rounded-full px-4 py-2.5 text-center text-sm font-semibold text-white shadow-md transition-all hover:opacity-90 hover:shadow-lg ${t.button}`}
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
      className={`card-lift relative flex flex-col rounded-3xl border p-6 ${
        pkg.highlighted
          ? "border-accent/60 bg-gradient-to-b from-accent-soft via-white to-white shadow-[0_20px_50px_-22px_rgba(40,87,255,0.35)]"
          : "border-line bg-white hover:border-accent/40"
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
        href={
          serviceSlug
            ? `/start-project?service=${serviceSlug}&package=${encodeURIComponent(pkg.name)}`
            : `/start-project?package=${encodeURIComponent(pkg.name)}`
        }
        data-track="pricing_package_click"
        className={`mt-auto pt-5 block rounded-full px-4 py-2.5 text-center text-sm font-semibold transition-all ${
          pkg.highlighted
            ? "bg-gradient-to-r from-accent to-indigo-600 text-white shadow-md hover:opacity-90 hover:shadow-lg"
            : "border border-line text-ink hover:border-accent hover:text-accent"
        }`}
      >
        Get This Package
      </Link>
    </div>
  );
}

export function PortfolioCard({ item }: { item: PortfolioItem }) {
  const serviceSlug =
    item.serviceSlug ??
    (item.category === "AI & Automation"
      ? "ai-automation"
      : item.category === "Data & Dashboards"
        ? "data-dashboard"
        : "website-development");
  const hasDemo = Boolean(item.demoType);

  return (
    <div className="card-lift group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-white">
      <div className="relative">
        <PortfolioMockup slug={item.slug} accent={item.accent} />
        {item.isDemo && (
          <span className="absolute right-4 top-8 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-ink-soft backdrop-blur">
            Concept Project
          </span>
        )}
        <span className="absolute bottom-3 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink backdrop-blur">
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

        {/* Enriched project facts (concept builds) */}
        {(item.timeline || item.priceRange) && (
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-medium text-ink-soft">
            {item.timeline && (
              <span className="flex items-center gap-1.5">
                <Icon name="clock" className="size-3.5 text-accent" /> {item.timeline}
              </span>
            )}
            {item.priceRange && (
              <span className="flex items-center gap-1.5">
                <Icon name="spark" className="size-3.5 text-mint" /> {item.priceRange}
              </span>
            )}
          </div>
        )}

        <div className="mt-3 flex flex-wrap gap-1.5">
          {(item.tools ?? item.features).slice(0, 4).map((f) => (
            <span key={f} className="rounded-full bg-black/[0.04] px-2.5 py-1 text-[11px] font-medium text-ink-soft">
              {f}
            </span>
          ))}
        </div>

        {item.clientProvides && item.clientProvides.length > 0 && (
          <p className="mt-3 text-xs leading-5 text-ink-soft">
            <span className="font-semibold text-ink">You provide: </span>
            {item.clientProvides.join(", ")}
          </p>
        )}

        {/* CTAs */}
        <div className="mt-auto pt-5">
          {hasDemo ? (
            <>
              <Link
                href={`/portfolio/${item.slug}`}
                data-track="portfolio_cta_click"
                className="flex items-center justify-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-deep"
              >
                <Icon name="arrow" className="size-4" /> View Live Demo
              </Link>
              <Link
                href={`/start-project?service=${serviceSlug}`}
                data-track="portfolio_cta_click"
                className="mt-2 flex items-center justify-center gap-1 text-xs font-semibold text-ink-soft transition-colors hover:text-accent"
              >
                Build Similar Project
              </Link>
            </>
          ) : (
            <Link
              href={`/start-project?service=${serviceSlug}`}
              data-track="portfolio_cta_click"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-deep"
            >
              Build Similar Project
              <Icon name="arrow" className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
