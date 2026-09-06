import Link from "next/link";
import Icon from "../Icons";

// Wraps every live concept demo with an honest "Concept Project" banner and a
// persistent "Build Similar Project" call-to-action. The demo content itself
// renders with its own look (as a client site would) inside `children`.
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
    <div className="min-h-screen bg-white">
      {/* Honest concept banner */}
      <div className="sticky top-0 z-50 border-b border-white/15 bg-slate-900 text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2.5">
          <p className="flex items-center gap-2 text-xs font-medium sm:text-sm">
            <span className="grid size-5 place-items-center rounded-full bg-amber-400 text-slate-900">
              <Icon name="spark" className="size-3" />
            </span>
            <span>
              <span className="font-bold">Concept Project</span> — a sample built by Skilloura. A
              demonstration of quality, not a live business.
            </span>
          </p>
          <div className="flex items-center gap-2">
            <Link
              href="/portfolio"
              className="rounded-full border border-white/25 px-3 py-1.5 text-xs font-semibold text-white/90 transition-colors hover:bg-white/10"
            >
              ← All work
            </Link>
            <Link
              href={`/start-project?service=${serviceSlug}`}
              className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-900 transition-transform hover:scale-105"
            >
              Build Similar Project
            </Link>
          </div>
        </div>
      </div>

      {/* Demo content */}
      <div>{children}</div>

      {/* Closing CTA — back to the real Skilloura flow */}
      <div className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Concept by Skilloura
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            Want a site like this — {title.split("—")[0].trim()} style — for your business?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600">
            This is a concept build. We&apos;ll design yours around your real content, brand and
            budget — with a written scope and quote before any payment.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href={`/start-project?service=${serviceSlug}`}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
            >
              Build Similar Project <Icon name="arrow" className="size-4" />
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-900"
            >
              See other concepts
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Small shared device-frame helper used at the top of some demos to make the
// "desktop + mobile responsive" story visible.
