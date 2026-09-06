import Link from "next/link";
import Icon from "../Icons";

/**
 * Wraps every live concept demo.
 *
 * Only the chrome belongs to Skilloura — the banner at the top and the closing
 * strip at the bottom. Everything in `children` deliberately keeps its own
 * look, because each demo is meant to read as a different client's site; that
 * is the whole point of showing them. components/demos/** is exempt from the
 * design-token lint rule for exactly this reason.
 *
 * The chrome itself used to be slate-900 and slate-50 with its own type sizes,
 * so it read as a third design sitting between the site and the demo. It now
 * uses the deep ink surface and the type scale, which makes the boundary
 * between "our frame" and "their site" legible rather than accidental.
 *
 * The honesty banner is unchanged in substance: every visitor is told, before
 * anything else, that this is a concept build and not a live business.
 */
export default function DemoChrome({
  title,
  serviceSlug,
  children,
}: {
  title: string;
  serviceSlug: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface">
      {/* Honest concept banner. */}
      <div
        data-demo-chrome="banner"
        className="sticky top-0 z-50 border-b border-line-on-ink bg-surface-ink text-on-ink"
      >
        <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
          <p className="flex items-center gap-2.5 text-body-sm">
            <span aria-hidden className="block size-1.5 shrink-0 rounded-pill bg-signal" />
            <span>
              <span className="font-semibold">Concept build</span> — made by Skilloura to show
              quality. Not a live business.
            </span>
          </p>
          <div className="flex items-center gap-2">
            <Link
              href="/portfolio"
              className="rounded-pill border border-line-on-ink px-3.5 py-1.5 text-body-sm font-medium text-on-ink-soft transition-colors hover:text-on-ink"
            >
              All work
            </Link>
            <Link
              href={`/start-project?service=${serviceSlug}`}
              className="rounded-pill bg-signal px-3.5 py-1.5 text-body-sm font-semibold text-surface-ink"
            >
              Build something like this
            </Link>
          </div>
        </div>
      </div>

      {/* The demo itself, in its own visual world. */}
      <div>{children}</div>

      {/* Back into the real flow. */}
      <div data-demo-chrome="footer" className="border-t border-line bg-canvas">
        <div className="mx-auto max-w-content px-4 py-14 sm:px-6">
          <p className="text-micro font-mono uppercase text-ink-muted">Concept by Skilloura</p>
          <h2 className="mt-3 max-w-2xl text-display-3 text-ink">
            Want one built around{" "}
            <span className="font-accent italic text-brand">your</span> business?
          </h2>
          <p className="mt-3 max-w-xl text-body-lg text-ink-soft">
            This is a concept build. Yours would be designed around your real content, brand
            and budget — with a written scope and a fixed quote before any payment.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={`/start-project?service=${serviceSlug}`}
              className="inline-flex items-center gap-2 rounded-pill bg-brand px-6 py-3.5 text-body-base font-semibold text-on-brand shadow-brand transition-colors hover:bg-brand-deep"
            >
              Get a written scope
              <Icon name="arrow" className="size-4" />
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 rounded-pill border border-line-strong bg-surface px-5 py-3.5 text-body-base font-semibold text-ink shadow-e1 transition-colors hover:border-brand hover:text-brand"
            >
              See other builds
            </Link>
          </div>
          <p className="mt-6 text-body-sm text-ink-soft">
            Viewing the {title.split("—")[0].trim()} concept.
          </p>
        </div>
      </div>
    </div>
  );
}
