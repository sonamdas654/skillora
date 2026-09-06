import Link from "next/link";
import PageShell from "@/components/PageShell";
import Icon from "@/components/Icons";
import { serviceCategories, SECONDARY_SERVICE_SLUGS } from "@/lib/services";

export const metadata = {
  title: "Page not found",
  robots: { index: false },
};

/**
 * 404.
 *
 * The previous version was a big grey "404", a line of apology and two
 * buttons — which tells a lost visitor nothing and gives them one guess. This
 * one actually routes them: the seven core services, the two highest-intent
 * destinations, and a direct line, all one click away. A 404 is a navigation
 * problem, so it should be answered with navigation.
 */
export default function NotFound() {
  const core = serviceCategories.filter((s) => !SECONDARY_SERVICE_SLUGS.includes(s.slug));

  return (
    <PageShell>
      <section className="relative overflow-hidden bg-canvas">
        <div className="absolute inset-0 bg-hero-glow" aria-hidden />
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="aura aura-1" />
        </div>

        <div className="relative mx-auto max-w-page px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2.5 text-micro font-mono uppercase text-ink-soft">
              <span aria-hidden className="block h-2.5 w-px bg-brand" />
              Error 404
            </p>
            <h1 className="mt-4 text-display-2 text-ink">
              That page isn&apos;t here — but the thing you were looking for probably is.
            </h1>
            <p className="mt-4 text-body-lg text-ink-soft">
              The address may have changed, or the link that brought you here may be out of
              date. Start from one of these.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-pill bg-brand px-6 py-3.5 text-body-base font-semibold text-on-brand shadow-brand transition-colors hover:bg-brand-deep"
              >
                Browse all services
                <Icon name="arrow" className="size-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-pill border border-line-strong bg-surface px-5 py-3.5 text-body-base font-semibold text-ink shadow-e1 transition-colors hover:border-brand hover:text-brand"
              >
                Ask us directly
              </Link>
            </div>
          </div>

          <div className="scope-line mt-12">
            <h2 className="text-micro font-mono uppercase text-ink-muted">Core services</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {core.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="card-lift flex items-center justify-between gap-3 rounded-card border border-line bg-surface px-4 py-3 shadow-e1"
                  >
                    <span className="text-body-sm font-semibold text-ink">{s.shortName}</span>
                    <Icon name="arrow" className="size-4 shrink-0 text-ink-muted" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-body-sm text-ink-soft">
            <Link href="/portfolio" className="font-semibold text-brand hover:underline">
              See the work
            </Link>
            <Link href="/pricing" className="font-semibold text-brand hover:underline">
              Transparent pricing
            </Link>
            <Link href="/how-it-works" className="font-semibold text-brand hover:underline">
              How a project runs
            </Link>
            <Link href="/blog" className="font-semibold text-brand hover:underline">
              Guides and articles
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
