import Link from "next/link";
import Icon from "./Icons";
import PortfolioMockup from "./PortfolioMockup";
import type { ServiceCategory, ServicePackage } from "@/lib/services";
import type { PortfolioItem } from "@/lib/portfolio";

/**
 * The three shared cards.
 *
 * What was here before: a SERVICE_THEMES map giving each of the nine services
 * its own gradient tile, glow blob, chip colour, gradient button and hover
 * border — nine separate colour stories, seventy-odd literal palette classes,
 * rendered side by side on the homepage and /services. That is the single
 * biggest reason the old site read as a template: variety was being expressed
 * as colour rather than as content.
 *
 * Services are now told apart by their name, their outcome and their price,
 * which is what someone choosing between them actually reads. One brand
 * family, one elevation system.
 *
 * ServiceCard used to live here too. The homepage was its only caller, and
 * that grid is now components/BuildShowcase.tsx — real screenshots of real
 * pages instead of an icon standing in for the work. Removed rather than
 * left orphaned, so nothing reaches for it by accident.
 *
 * The three data-track attributes are load-bearing — site-wide analytics
 * reads them, and there is no error if they go missing. They are kept exactly
 * as they were, on real links.
 */

export function PackageCard({
  pkg,
  serviceSlug,
}: {
  pkg: ServicePackage;
  serviceSlug?: string;
}) {
  return (
    <div
      className={`card-lift relative flex h-full flex-col rounded-card border p-6 ${
        pkg.highlighted
          ? "border-brand bg-surface shadow-e3"
          : "border-line bg-surface shadow-e1"
      }`}
    >
      {pkg.highlighted && (
        <span className="absolute -top-2.5 left-6 rounded-pill bg-signal px-3 py-0.5 text-micro font-mono font-semibold uppercase text-surface-ink">
          Most chosen
        </span>
      )}

      <h3 className="text-title-3 text-ink">{pkg.name}</h3>

      <p className="mt-3 flex flex-wrap items-baseline gap-x-1.5">
        <span className="font-mono text-title-1 font-medium tracking-tight text-ink">
          {pkg.price === "Custom" ? "Custom quote" : pkg.price}
        </span>
        {pkg.period && (
          <span className="font-mono text-body-sm text-ink-soft">{pkg.period}</span>
        )}
      </p>
      <p className="mt-1 text-body-sm text-ink-muted">
        Guide price. Final quote updates after the requirement form and review.
      </p>

      <ul className="mt-5 border-t border-line">
        {pkg.features.map((f) => (
          <li
            key={f}
            className="flex items-start gap-3 border-b border-line py-2.5 text-body-sm text-ink-soft"
          >
            <span aria-hidden className="mt-2 block size-1.5 shrink-0 rounded-pill bg-brand" />
            {f}
          </li>
        ))}
      </ul>

      {(pkg.delivery || pkg.revisions) && (
        <dl className="mt-4 space-y-1.5">
          {pkg.delivery && (
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-body-sm text-ink-soft">Delivery</dt>
              <dd className="font-mono text-body-sm text-ink">{pkg.delivery}</dd>
            </div>
          )}
          {pkg.revisions && (
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-body-sm text-ink-soft">Revisions</dt>
              <dd className="font-mono text-body-sm text-ink">{pkg.revisions}</dd>
            </div>
          )}
        </dl>
      )}

      <Link
        href={
          serviceSlug
            ? `/start-project?service=${serviceSlug}&package=${encodeURIComponent(pkg.name)}`
            : `/start-project?package=${encodeURIComponent(pkg.name)}`
        }
        data-track="pricing_package_click"
        className={`mt-auto block rounded-pill px-4 py-2.5 text-center text-body-sm font-semibold transition-colors ${
          pkg.highlighted
            ? "bg-brand text-on-brand hover:bg-brand-deep"
            : "border border-line-strong text-ink hover:border-brand hover:text-brand"
        } mt-5`}
      >
        Get this package
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
    <div className="card-lift group flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface shadow-e1">
      <div className="relative">
        <PortfolioMockup slug={item.slug} accent={item.accent} />
        {item.isDemo && (
          <span className="absolute right-3 top-7 rounded-pill bg-surface/90 px-2.5 py-1 text-micro font-mono uppercase text-ink-soft backdrop-blur">
            Concept
          </span>
        )}
        <span className="absolute bottom-3 left-3 rounded-pill bg-surface/90 px-2.5 py-1 text-body-sm font-medium text-ink backdrop-blur">
          {item.industry}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-title-2 text-ink">{item.title}</h3>

        <dl className="mt-3 space-y-2">
          <div>
            <dt className="text-micro font-mono uppercase text-ink-muted">Problem</dt>
            <dd className="mt-0.5 text-body-sm text-ink-soft">{item.problem}</dd>
          </div>
          <div>
            <dt className="text-micro font-mono uppercase text-ink-muted">Solution</dt>
            <dd className="mt-0.5 text-body-sm text-ink-soft">{item.solution}</dd>
          </div>
        </dl>

        {(item.timeline || item.priceRange) && (
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 border-t border-line pt-3 font-mono text-body-sm text-ink">
            {item.timeline && <span>{item.timeline}</span>}
            {item.priceRange && <span>{item.priceRange}</span>}
          </div>
        )}

        <p className="mt-3 text-body-sm text-ink-muted">
          {(item.tools ?? item.features).slice(0, 4).join(" · ")}
        </p>

        {item.clientProvides && item.clientProvides.length > 0 && (
          <p className="mt-3 text-body-sm text-ink-soft">
            <span className="font-semibold text-ink">You provide: </span>
            {item.clientProvides.join(", ")}
          </p>
        )}

        <div className="mt-auto pt-5">
          {hasDemo ? (
            <>
              <Link
                href={`/portfolio/${item.slug}`}
                data-track="portfolio_cta_click"
                className="flex items-center justify-center gap-2 rounded-pill bg-brand px-4 py-2.5 text-body-sm font-semibold text-on-brand transition-colors hover:bg-brand-deep"
              >
                Open the live build
                <Icon name="arrow" className="size-4" />
              </Link>
              <Link
                href={`/start-project?service=${serviceSlug}`}
                data-track="portfolio_cta_click"
                className="mt-2 flex items-center justify-center text-body-sm font-semibold text-ink-soft transition-colors hover:text-brand"
              >
                Build something like this
              </Link>
            </>
          ) : (
            <Link
              href={`/start-project?service=${serviceSlug}`}
              data-track="portfolio_cta_click"
              className="inline-flex items-center gap-1.5 text-body-sm font-semibold text-brand"
            >
              Build something like this
              <Icon
                name="arrow"
                className="size-4 transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
