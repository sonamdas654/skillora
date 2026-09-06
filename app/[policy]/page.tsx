import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import PageShell, { PageHero } from "@/components/PageShell";
import { Section } from "@/components/Section";
import { policies, getPolicy } from "@/lib/policies";
import { site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return policies.map((p) => ({ policy: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ policy: string }>;
}): Promise<Metadata> {
  const { policy } = await params;
  const doc = getPolicy(policy);
  if (!doc) return {};
  return {
    title: doc.title,
    description: doc.description,
    // This was the only public page in the repo with no canonical.
    alternates: { canonical: `/${policy}` },
  };
}

function anchorId(heading: string) {
  return heading
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/**
 * Policy pages — six of them, 444 lines of genuinely specific legal copy.
 *
 * The content was always strong; the presentation buried it. Every section
 * was an identical bordered card with a checkmark list, which is wrong twice
 * over: it makes a long legal document read as a feature list, and with no
 * contents, no anchors and no sibling links there was no way to navigate
 * within or between the six documents.
 *
 * Now it reads as a document — a sticky contents rail on the left, numbered
 * anchored sections in a prose column, and the other five policies linked at
 * the end, because someone reading the refund policy usually wants the
 * payment policy next.
 *
 * Checkmark icons are gone from legal text on purpose: a tick implies a
 * benefit, and these are terms, not features.
 */
export default async function PolicyPage({
  params,
}: {
  params: Promise<{ policy: string }>;
}) {
  const { policy } = await params;
  const doc = getPolicy(policy);
  if (!doc) notFound();

  const others = policies.filter((p) => p.slug !== doc.slug);

  return (
    <PageShell>
      <PageHero
        eyebrow="Policy"
        title={doc.title}
        subtitle={doc.intro}
        crumbs={[
          { name: "Home", path: "/" },
          { name: doc.title, path: `/${doc.slug}` },
        ]}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-4 lg:gap-16">
          {/* Contents. Sticky on desktop, plain at the top on mobile. */}
          <nav
            aria-label="On this page"
            className="lg:sticky lg:top-28 lg:col-span-1 lg:self-start"
          >
            <p className="text-micro font-mono uppercase text-ink-muted">On this page</p>
            <ol className="mt-3 border-t border-line">
              {doc.sections.map((section, i) => (
                <li key={section.heading} className="border-b border-line">
                  <a
                    href={`#${anchorId(section.heading)}`}
                    className="flex gap-3 py-2.5 text-body-sm text-ink-soft transition-colors hover:text-brand"
                  >
                    <span className="shrink-0 font-mono text-micro text-ink-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {section.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="max-w-prose lg:col-span-3">
            {doc.sections.map((section, i) => (
              <section
                key={section.heading}
                id={anchorId(section.heading)}
                className="scroll-mt-28 border-b border-line pb-8 pt-8 first:pt-0"
              >
                <h2 className="flex gap-4 font-display text-title-1 text-ink">
                  <span className="shrink-0 pt-1.5 font-mono text-micro text-ink-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {section.heading}
                </h2>
                <ul className="mt-4 space-y-3 pl-10">
                  {section.points.map((point) => (
                    <li
                      key={point}
                      className="relative text-body-base leading-relaxed text-ink-soft before:absolute before:-left-5 before:top-2.5 before:block before:size-1.5 before:rounded-pill before:bg-line-strong"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            <p className="mt-8 text-body-base text-ink-soft">
              Questions about this policy? Email{" "}
              <a
                href={`mailto:${site.email}`}
                className="font-semibold text-brand underline underline-offset-2"
              >
                {site.email}
              </a>
              .
            </p>

            <div className="mt-12">
              <p className="text-micro font-mono uppercase text-ink-muted">Other policies</p>
              <div className="mt-3 border-t border-line">
                {others.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/${p.slug}`}
                    className="block border-b border-line py-3 text-body-base text-ink transition-colors hover:text-brand"
                  >
                    {p.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
