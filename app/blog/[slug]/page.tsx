import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import Icon from "@/components/Icons";
import { Section } from "@/components/Section";
import Image from "next/image";
import type { BlogPost } from "@/lib/blog";
import { createClient } from "@/lib/supabase/server";
import { site } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import ShareButtons from "@/components/ShareButtons";
import { blogPostingSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";

async function resolvePost(slug: string): Promise<BlogPost | undefined> {
  const supabase = await createClient();
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
  const supabase = await createClient();
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

function renderContent(content: string) {
  const blocks = content.split("\n\n");
  return blocks.map((block, i) => {
    if (block.startsWith("## ")) {
      return (
        <h2 key={i} className="mt-10 text-2xl font-bold text-ink">
          {block.slice(3)}
        </h2>
      );
    }
    if (block.split("\n").every((l) => l.startsWith("- "))) {
      return (
        <ul key={i} className="mt-4 space-y-2.5">
          {block.split("\n").map((line, j) => (
            <li key={j} className="flex items-start gap-2.5 text-base leading-7 text-ink-soft">
              <Icon name="check" className="mt-1.5 size-4 shrink-0 text-mint" />
              <span>{line.slice(2)}</span>
            </li>
          ))}
        </ul>
      );
    }
    return (
      <p key={i} className="mt-4 text-base leading-7 text-ink-soft">
        {block}
      </p>
    );
  });
}

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
      <JsonLd
        data={[
          blogPostingSchema(post),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
          ...(post.faqs && post.faqs.length > 0 ? [faqSchema(post.faqs)] : []),
        ]}
      />
      <div className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 bg-hero-glow" aria-hidden />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-20">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="rounded-full bg-accent-soft px-3 py-1 text-accent">{post.category}</span>
            <span className="text-ink-soft">
              Published{" "}
              {new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </span>
            <span className="text-ink-soft">· {post.readMinutes} min read</span>
          </div>
          <h1 className="mt-5 text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight leading-[1.12] text-ink">
            {post.title}
          </h1>
          {/* Author strip */}
          <div className="mt-6 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full border border-line bg-white p-1.5">
              <Image src="/logo-mark.png" alt="" width={40} height={40} className="size-full object-contain" />
            </span>
            <div>
              <p className="text-sm font-bold text-ink">Skilloura Team</p>
              <p className="text-xs text-ink-soft">Websites, apps, AI automation &amp; digital growth</p>
            </div>
          </div>
        </div>
      </div>
      <Section>
        <article className="mx-auto max-w-3xl">
          {/* Quick answer / TL;DR — great for readers and AI answer engines */}
          {post.keyTakeaways && post.keyTakeaways.length > 0 && (
            <div className="rounded-2xl border border-accent/20 bg-accent-soft p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-accent">Quick answer</p>
              <ul className="mt-3 space-y-2">
                {post.keyTakeaways.map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-sm leading-6 text-ink">
                    <Icon name="check" className="mt-1 size-4 shrink-0 text-mint" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {renderContent(post.content)}

          {/* Cost breakdown table */}
          {post.costTable && post.costTable.length > 0 && (
            <div className="mt-10">
              <h2 className="text-2xl font-bold text-ink">Cost breakdown</h2>
              <div className="mt-4 overflow-x-auto rounded-2xl border border-line">
                <table className="w-full text-left text-sm">
                  <thead className="bg-soft-panel text-xs uppercase tracking-wide text-ink-soft">
                    <tr>
                      <th className="px-4 py-3">What you get</th>
                      <th className="px-4 py-3 text-right">Guide price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {post.costTable.map((row) => (
                      <tr key={row.item} className="border-t border-line">
                        <td className="px-4 py-3 text-ink">{row.item}</td>
                        <td className="px-4 py-3 text-right font-semibold text-ink">{row.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-ink-soft">
                Guide prices. Your final quote depends on scope, features and integrations — always in
                writing before any payment. Domain, hosting and paid APIs are separate third-party costs.
              </p>
            </div>
          )}

          {/* See it live — link to the matching demo */}
          {post.demoSlug && (
            <div className="mt-10 flex flex-col items-start gap-3 rounded-2xl border border-line bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-bold text-ink">See a live example</p>
                <p className="text-sm text-ink-soft">Explore a real, working concept demo — no sign-up.</p>
              </div>
              <Link
                href={post.demoSlug}
                target="_blank"
                className="shrink-0 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent"
              >
                {post.demoLabel ?? "View live demo"} →
              </Link>
            </div>
          )}

          {/* FAQ — rendered + emitted as FAQPage schema above */}
          {post.faqs && post.faqs.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-ink">Frequently asked questions</h2>
              <div className="mt-5 space-y-4">
                {post.faqs.map((f) => (
                  <div key={f.q} className="rounded-2xl border border-line bg-white p-5">
                    <p className="font-bold text-ink">{f.q}</p>
                    <p className="mt-2 text-sm leading-7 text-ink-soft">{f.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sources / citations */}
          {post.sources && post.sources.length > 0 && (
            <div className="mt-10 rounded-2xl bg-soft-panel p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-soft">Sources</p>
              <ul className="mt-2 space-y-1 text-sm">
                {post.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="text-accent hover:underline">
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

          {/* Internal links — related reading */}
          {relatedPosts.length > 0 && (
            <div className="mt-10">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-soft">Related reading</p>
              <ul className="mt-3 space-y-2">
                {relatedPosts.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/blog/${r.slug}`} className="text-sm font-semibold text-accent hover:underline">
                      {r.title} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Targeted CTA — to the relevant service, else generic */}
          <div className="mt-14 rounded-3xl bg-gradient-to-br from-accent to-accent-deep p-8 text-white text-center">
            <h2 className="text-2xl font-bold">
              Need help with this for{" "}
              <span className="font-accent font-normal">your business?</span>
            </h2>
            <p className="mt-2 text-white/85 text-sm">
              Submit your requirement and get a clear plan, honest pricing and a written scope.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link
                href={post.serviceCtaSlug ? `/start-project?service=${post.serviceCtaSlug}` : "/start-project"}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-accent hover:scale-[1.03] transition-transform"
              >
                {post.serviceCtaLabel ?? "Submit Project Requirement"} <Icon name="arrow" className="size-4" />
              </Link>
              {post.serviceCtaSlug && (
                <Link
                  href={`/services/${post.serviceCtaSlug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  See service &amp; pricing
                </Link>
              )}
            </div>
          </div>
        </article>
      </Section>
    </PageShell>
  );
}
