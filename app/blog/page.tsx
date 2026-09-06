import type { Metadata } from "next";
import Link from "next/link";
import PageShell, { PageHero } from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icons";
import { Section } from "@/components/Section";
import { createPublicClient } from "@/lib/supabase/public";

// Public content only, so this is statically generated and refreshed on a
// timer instead of server-rendered per request. See lib/supabase/public.ts
// for why the cookie-bound client cannot be used here.
export const revalidate = 600;

export const metadata: Metadata = {
  alternates: { canonical: "/blog" },
  title: "Blog — Practical Guides for Business Websites, AI & Marketing",
  description:
    "Honest, practical articles on websites, AI automation, digital marketing and growing your business online — written for business owners, not developers.",
};

export default async function BlogPage() {
  const supabase = createPublicClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, title, meta_description, category, read_minutes")
    .eq("status", "published")
    .order("date", { ascending: false });

  const allPosts = posts ?? [];

  return (
    <PageShell>
      <PageHero
        eyebrow="Blog"
        title={
          <>
            Practical guides,{" "}
            <span className="font-accent font-normal text-accent">no jargon</span>
          </>
        }
        subtitle="Honest articles for business owners: what things cost, what actually works, and what to avoid."
      />
      <Section>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {allPosts.map((post, i) => (
            <Reveal key={post.slug} delay={Math.min(i * 0.05, 0.25)}>
              <Link
                href={`/blog/${post.slug}`}
                className="card-lift group flex h-full flex-col rounded-3xl border border-line bg-white p-6 hover:border-accent/40"
              >
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-accent-soft px-3 py-1 text-accent">
                    {post.category}
                  </span>
                  <span className="text-ink-soft">{post.read_minutes} min read</span>
                </div>
                <h2 className="mt-4 text-lg font-bold leading-snug text-ink group-hover:text-accent transition-colors">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-ink-soft line-clamp-3">
                  {post.meta_description}
                </p>
                <span className="mt-auto pt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                  Read article
                  <Icon name="arrow" className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
