import type { Metadata } from "next";
import Link from "next/link";
import PageShell, { PageHero } from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icons";
import { Section } from "@/components/Section";
import { blogPosts } from "@/lib/blog";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog — Practical Guides for Business Websites, AI & Marketing",
  description:
    "Honest, practical articles on websites, AI automation, digital marketing and growing your business online — written for business owners, not developers.",
};

export default async function BlogPage() {
  const dbPosts = await prisma.blogPost.findMany({
    where: { status: "published" },
    orderBy: { createdAt: "desc" },
  });
  const allPosts = [
    ...dbPosts.map((p) => ({
      slug: p.slug,
      title: p.title,
      metaDescription: p.metaDescription ?? p.content.slice(0, 150),
      date: p.createdAt.toISOString(),
      readMinutes: Math.max(2, Math.round(p.content.split(/\s+/).length / 200)),
      category: "Blog",
    })),
    ...blogPosts,
  ];

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
                className="card-lift group flex h-full flex-col rounded-2xl border border-line bg-white p-6"
              >
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-accent-soft px-3 py-1 text-accent">
                    {post.category}
                  </span>
                  <span className="text-ink-soft">{post.readMinutes} min read</span>
                </div>
                <h2 className="mt-4 text-lg font-bold leading-snug text-ink group-hover:text-accent transition-colors">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-ink-soft line-clamp-3">
                  {post.metaDescription}
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
