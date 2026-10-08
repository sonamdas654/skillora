import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PageShell from "@/components/PageShell";
import Icon from "@/components/Icons";
import { Section } from "@/components/Section";
import Breadcrumbs from "@/components/Breadcrumbs";
import ArticleBody from "@/components/ArticleBody";
import FaqAccordion from "@/components/FaqAccordion";
import ShareButtons from "@/components/ShareButtons";
import JsonLd from "@/components/JsonLd";
import type { BlogPost } from "@/lib/blog";
import { createPublicClient } from "@/lib/supabase/public";
import { site } from "@/lib/site";
import { blogPostingSchema, faqSchema } from "@/lib/schema";

// Public content only, so this is statically generated and refreshed on a
// timer instead of server-rendered per request. See lib/supabase/public.ts
// for why the cookie-bound client cannot be used here.
export const revalidate = 600;

/**
 * Prerender every published post at build time. Without this the route had no
 * generateStaticParams at all, so each post was rendered on demand — and with
 * the cookie-bound client that meant a Supabase round-trip on every visit.
 *
 * dynamicParams stays at its default (true) on purpose: a post published after
 * the build still renders on first request and is then cached, so publishing
 * does not require a redeploy.
 */
export async function generateStaticParams() {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("status", "published");
  return (data ?? []).map((row: { slug: string }) => ({ slug: row.slug }));
}

async function resolvePost(slug: string): Promise<BlogPost | undefined> {
  const supabase = createPublicClient();
  const { data: p } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (!p) return undefined;
  return {
    slug: p.slug,
    title: p.title,
    metaDescription: p.meta_description,
    date: p.date,
    readMinutes: p.read_minutes,
    category: p.category,
    content: p.content,
    keyTakeaways: p.key_takeaways ?? [],
    costTable: p.cost_table ?? [],
    faqs: p.faqs ?? [],
    serviceCtaSlug: p.service_cta_slug ?? undefined,
    serviceCtaLabel: p.service_cta_label ?? undefined,
    demoSlug: p.demo_slug ?? undefined,
    demoLabel: p.demo_label ?? undefined,
    relatedSlugs: p.related_slugs ?? [],
    sources: p.sources ?? [],
  };
}

async function resolveRelated(slugs: string[]): Promise<{ slug: string; title: string }[]> {
  if (slugs.length === 0) return [];
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("slug, title")
    .in("slug", slugs)
    .eq("status", "published");
  return data ?? [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await resolvePost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.metaDescription,
    alternates: { canonical: `/blog/${slug}` },
  };
}

/**
 * Article page — the template behind every post, and the one with the best
 * SEO structure on the site.
 *
 * What changed:
 *
 * The body renderer used to live inline here and handled exactly three
 * things: "## " headings, blocks where every line began with "- ", and
 * paragraphs. Critically, **it could not render a link**, so every article was
 * a dead end that could only point outward through the CTA at the bottom —
 * fatal for the internal link graph a content cluster depends on. It now uses
 * components/ArticleBody.tsx, which adds links, bold, inline code, ordered
 * lists, sub-headings and blockquotes, and gives headings stable ids.
 *
 * The FAQs were four static boxes rather than the accordion the rest of the
 * site uses, the cost table was a bordered HTML table instead of the ledger
 * this design system uses everywhere else, and the page closed on a
 * full-width gradient CTA that now duplicates the footer's closing band.
 *
 * Every piece of content is preserved: takeaways, body, cost table,
 * demo link, FAQs, sources, share row, related reading and the
 * service-targeted next step.
 */
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await resolvePost(slug);
  if (!post) notFound();

  const postUrl = `${site.url}/blog/${post.slug}`;
  const relatedPosts = await resolveRelated(post.relatedSlugs ?? []);

  return (
    <PageShell>
      {/* Breadcrumb schema comes from the visible trail below, so it is not
          repeated here. */}
      <JsonLd
        data={[
          blogPostingSchema(post),
          ...(post.faqs && post.faqs.length > 0 ? [faqSchema(post.faqs)] : []),
        ]}
      />

      {/* ── Article header ─────────────────────────────────────── */}
      <header className="relative overflow-hidden border-b border-line bg-canvas">
        <div className="absolute inset-0 bg-hero-glow" aria-hidden />
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="aura aura-1" />
        </div>
        <div className="relative mx-auto max-w-content px-4 py-14 sm:px-6 sm:py-20">
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Blog", path: "/blog" },
              { name: post.title, path: `/blog/${post.slug}` },
            ]}
          />
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-micro font-mono uppercase text-ink-soft">
            <span className="flex items-center gap-2.5">
              <span aria-hidden className="block h-2.5 w-px bg-brand" />
              {post.category}
            </span>
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
            <span>{post.readMinutes} min read</span>
          </p>

          <h1 className="mt-5 max-w-3xl text-display-2 text-ink">{post.title}</h1>

          <div className="mt-7 flex items-center gap-3 border-t border-line pt-5">
            <span className="grid size-9 place-items-center rounded-pill border border-line bg-surface p-1.5">
              <Image
                src="/logo-mark.png"
                alt=""
                width={36}
                height={36}
                className="size-full object-contain"
              />
            </span>
            <div>
              <p className="text-body-sm font-semibold text-ink">Skilloura Team</p>
              <p className="text-body-sm text-ink-soft">
                Websites, apps, AI automation &amp; digital growth
              </p>
            </div>
          </div>
        </div>
      </header>

      <Section>
        <article className="mx-auto max-w-prose">
          {/* Quick answer — for readers in a hurry, and for answer engines. */}
          {post.keyTakeaways && post.keyTakeaways.length > 0 && (
            <div className="rounded-card border border-line-strong bg-surface p-6 shadow-e1">
              <p className="text-micro font-mono uppercase text-ink-muted">Quick answer</p>
              <ul className="mt-3 space-y-2.5">
                {post.keyTakeaways.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-body-base text-ink">
                    <span
                      aria-hidden
                      className="mt-2 block size-1.5 shrink-0 rounded-pill bg-signal"
                    />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <ArticleBody content={post.content} />

          {/* Cost breakdown — a ledger, matching the rest of the system. */}
          {post.costTable && post.costTable.length > 0 && (
            <div className="mt-12">
              <h2 className="text-title-1 text-ink">Cost breakdown</h2>
              <dl className="mt-5 border-t border-line-strong">
                {post.costTable.map((row) => (
                  <div
                    key={row.item}
                    className="flex items-baseline justify-between gap-6 border-b border-line py-3"
                  >
                    <dt className="text-body-base text-ink-soft">{row.item}</dt>
                    <dd className="shrink-0 text-right font-mono text-body-base font-medium text-ink">
                      {row.price}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-body-sm text-ink-soft">
                Guide prices. Your final quote depends on scope, features and integrations —
                always in writing before any payment. Domain, hosting and paid APIs are
                separate third-party costs.
              </p>
            </div>
          )}

          {post.demoSlug && (
            <Link
              href={post.demoSlug}
              className="mt-10 flex items-center justify-between gap-4 rounded-card border border-line bg-surface p-5 shadow-e1 transition-colors hover:border-brand"
            >
              <span>
                <span className="block text-micro font-mono uppercase text-ink-muted">
                  See it live
                </span>
                <span className="mt-1 block text-body-base font-semibold text-ink">
                  {post.demoLabel ?? "Open a working concept build"}
                </span>
              </span>
              <Icon name="arrow" className="size-5 shrink-0 text-brand" />
            </Link>
          )}

          {/* FAQ — the same accordion the rest of the site uses. */}
          {post.faqs && post.faqs.length > 0 && (
            <div className="mt-12">
              <h2 className="text-title-1 text-ink">Frequently asked questions</h2>
              <div className="mt-5">
                <FaqAccordion faqs={post.faqs} />
              </div>
            </div>
          )}

          {post.sources && post.sources.length > 0 && (
            <div className="mt-10">
              <p className="text-micro font-mono uppercase text-ink-muted">Sources</p>
              <ul className="mt-3 border-t border-line">
                {post.sources.map((s) => (
                  <li key={s.url} className="border-b border-line py-2.5">
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="text-body-sm text-brand hover:underline"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-10 border-t border-line pt-6">
            <ShareButtons url={postUrl} title={post.title} />
          </div>

          {/* Related reading — the internal link graph, not an afterthought. */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <p className="text-micro font-mono uppercase text-ink-muted">Keep reading</p>
              <div className="mt-4 border-t border-line-strong">
                {relatedPosts.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/blog/${r.slug}`}
                    className="group flex items-center justify-between gap-4 border-b border-line py-4"
                  >
                    <span className="text-body-base font-medium text-ink">{r.title}</span>
                    <Icon
                      name="arrow"
                      className="size-4 shrink-0 text-brand transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Targeted next step. The footer carries the closing offer, so this
              is a route into the relevant service rather than a second
              full-width gradient CTA. */}
          {post.serviceCtaSlug && (
            <Link
              href={`/services/${post.serviceCtaSlug}`}
              className="mt-10 flex items-center justify-between gap-4 rounded-card border border-line bg-surface-sunken p-5 transition-colors hover:border-brand"
            >
              <span>
                <span className="block text-micro font-mono uppercase text-ink-muted">
                  Need this done
                </span>
                <span className="mt-1 block text-body-base font-semibold text-ink">
                  {post.serviceCtaLabel ?? "See the service, packages and pricing"}
                </span>
              </span>
              <Icon name="arrow" className="size-5 shrink-0 text-brand" />
            </Link>
          )}
        </article>
      </Section>
    </PageShell>
  );
}
