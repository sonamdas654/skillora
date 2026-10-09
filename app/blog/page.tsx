import type { Metadata } from "next";
import Link from "next/link";
import PageShell, { PageHero } from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icons";
import HeroStack from "@/components/ui/HeroStack";
import JsonLd from "@/components/JsonLd";
import { Section } from "@/components/Section";
import { createPublicClient } from "@/lib/supabase/public";
import { site } from "@/lib/site";

// Public content only, so this is statically generated and refreshed on a
// timer instead of server-rendered per request. See lib/supabase/public.ts
// for why the cookie-bound client cannot be used here.
export const revalidate = 600;

export const metadata: Metadata = {
  alternates: { canonical: "/blog" },
  title: "Blog — Practical Guides for Websites, AI & Marketing",
  description:
    "Honest, practical articles on websites, AI automation, digital marketing and growing your business online — written for business owners, not developers.",
};

interface PostRow {
  slug: string;
  title: string;
  meta_description: string;
  category: string;
  read_minutes: number;
  date: string;
}

/**
 * Blog index.
 *
 * Was a hero and one three-column card grid. Category and read time were
 * being fetched and printed as chips, but there was no filter, no featured
 * article, no grouping and no Blog/ItemList schema — so eighteen articles
 * arrived as one undifferentiated wall and Google was told nothing about the
 * collection.
 *
 * Now: the newest article gets an editorial lead, and the rest are grouped by
 * category as hairline rows. Grouping is what makes a content cluster legible
 * to a reader and to a crawler, and it is free — the data was already here.
 */
export default async function BlogPage() {
  const supabase = createPublicClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, title, meta_description, category, read_minutes, date")
    .eq("status", "published")
    .order("date", { ascending: false });

  const allPosts: PostRow[] = posts ?? [];

  // A build against placeholder Supabase credentials returns nothing, and the
  // page would then be statically generated with zero articles and no error
  // anywhere — the blog would simply be empty in production. Fail the build
  // instead, loudly, while still allowing a genuinely empty blog locally.
  //
  // The guard only fires when credentials ARE configured and still returned
  // nothing — that is the dangerous case, because it means the wiring looks
  // right and the blog would ship empty.
  //
  // It must NOT fire when there are no credentials at all. That is a preview
  // or CI build, where every environment variable in this Vercel project is
  // scoped to Production and so none are present. The earlier condition
  // treated a missing variable as a misconfiguration and would have failed
  // every preview deployment — the same class of mistake as lib/db.ts
  // constructing Prisma at import.
  const hasSupabaseCredentials = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
  );
  if (allPosts.length === 0 && hasSupabaseCredentials) {
    throw new Error(
      "Blog index built with zero published posts. Check NEXT_PUBLIC_SUPABASE_URL/ANON_KEY " +
        "are the real project credentials before building."
    );
  }
  const [lead, ...rest] = allPosts;

  // Preserve recency order within each category, and order the categories by
  // how much is written in each — the deepest cluster reads first.
  const byCategory = rest.reduce<Record<string, PostRow[]>>((acc, post) => {
    (acc[post.category] ??= []).push(post);
    return acc;
  }, {});
  const categories = Object.keys(byCategory).sort(
    (a, b) => byCategory[b].length - byCategory[a].length
  );

  return (
    <PageShell>
      {allPosts.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Blog",
            name: `${site.name} — Guides`,
            url: `${site.url}/blog`,
            description: metadata.description,
            blogPost: allPosts.slice(0, 20).map((p) => ({
              "@type": "BlogPosting",
              headline: p.title,
              description: p.meta_description,
              datePublished: p.date,
              url: `${site.url}/blog/${p.slug}`,
            })),
          }}
        />
      )}

      <PageHero
        eyebrow="Guides"
        title={
          <>
            Practical guides,{" "}
            <span className="font-accent italic text-brand">no jargon</span>
          </>
        }
        subtitle="Honest articles for business owners: what things cost, what actually works, and what to avoid."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ]}
        aside={
          allPosts.length > 0 ? (
            <HeroStack
              cards={allPosts.slice(0, 3).map((p) => ({
                icon: "file",
                title: p.title,
                body: p.category ?? `${p.read_minutes ?? 5} min read`,
                href: `/blog/${p.slug}`,
                cta: "Read this guide",
              }))}
            />
          ) : undefined
        }
        actions={
          <Link href="/start-project" className="inline-flex items-center gap-2 rounded-pill bg-brand px-6 py-3.5 text-body-base font-semibold text-on-brand shadow-brand transition-colors hover:bg-brand-deep">
            Get a written scope
            <Icon name="arrow" className="size-4" />
          </Link>
        }
      />

      {lead && (
        <Section className="border-b border-line">
          <Reveal>
            <Link href={`/blog/${lead.slug}`} className="group block">
              <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-micro font-mono uppercase text-ink-muted">
                <span className="flex items-center gap-2.5">
                  <span aria-hidden className="block h-2.5 w-px bg-brand" />
                  Latest
                </span>
                <span>{lead.category}</span>
                <span>{lead.read_minutes} min read</span>
              </p>
              <h2 className="mt-4 max-w-3xl font-display text-display-2 text-ink transition-colors group-hover:text-brand">
                {lead.title}
              </h2>
              <p className="mt-4 max-w-2xl text-body-lg text-ink-soft">
                {lead.meta_description}
              </p>
              <span className="mt-6 tap-safe inline-flex items-center gap-2 text-body-base font-semibold text-brand">
                Read the guide
                <Icon
                  name="arrow"
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                />
              </span>
            </Link>
          </Reveal>
        </Section>
      )}

      {allPosts.length === 0 && (
        <Section>
          <div className="max-w-prose">
            <p className="text-body-lg text-ink-soft">
              The guides are being reloaded. In the meantime, the service pages carry the
              same detail on scope, timelines and pricing.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-pill bg-brand px-6 py-3.5 text-body-base font-semibold text-on-brand shadow-brand transition-colors hover:bg-brand-deep"
              >
                Browse services
                <Icon name="arrow" className="size-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-pill border border-line-strong bg-surface px-5 py-3.5 text-body-base font-semibold text-ink shadow-e1 transition-colors hover:border-brand hover:text-brand"
              >
                Ask directly
              </Link>
            </div>
          </div>
        </Section>
      )}

      <Section>
        {categories.map((category, ci) => (
          <div key={category} className={ci > 0 ? "mt-14" : ""}>
            <Reveal>
              <h2 className="flex items-baseline justify-between gap-4 border-b border-line-strong pb-3">
                <span className="font-display text-title-1 text-ink">{category}</span>
                <span className="font-mono text-micro text-ink-muted">
                  {byCategory[category].length}{" "}
                  {byCategory[category].length === 1 ? "article" : "articles"}
                </span>
              </h2>
            </Reveal>
            <div>
              {byCategory[category].map((post, i) => (
                <Reveal key={post.slug} delay={Math.min(i * 0.04, 0.2)}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group grid gap-x-8 gap-y-2 border-b border-line py-5 md:grid-cols-[1fr_auto]"
                  >
                    <div className="min-w-0">
                      <h3 className="font-display text-title-2 text-ink transition-colors group-hover:text-brand">
                        {post.title}
                      </h3>
                      <p className="mt-1.5 max-w-2xl text-body-sm text-ink-soft">
                        {post.meta_description}
                      </p>
                    </div>
                    <span className="shrink-0 self-start font-mono text-micro text-ink-muted md:pt-1.5">
                      {post.read_minutes} min
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        ))}
      </Section>
    </PageShell>
  );
}
