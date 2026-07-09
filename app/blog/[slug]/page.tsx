import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import Icon from "@/components/Icons";
import { Section } from "@/components/Section";
import Image from "next/image";
import { blogPosts, getBlogPost, type BlogPost } from "@/lib/blog";
import { prisma } from "@/lib/db";
import { site } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import ShareButtons from "@/components/ShareButtons";
import { blogPostingSchema, breadcrumbSchema } from "@/lib/schema";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

async function resolvePost(slug: string): Promise<BlogPost | undefined> {
  const staticPost = getBlogPost(slug);
  if (staticPost) return staticPost;
  const dbPost = await prisma.blogPost.findUnique({ where: { slug } });
  if (!dbPost || dbPost.status !== "published") return undefined;
  return {
    slug: dbPost.slug,
    title: dbPost.title,
    metaDescription: dbPost.metaDescription ?? dbPost.content.slice(0, 150),
    date: dbPost.createdAt.toISOString(),
    readMinutes: Math.max(2, Math.round(dbPost.content.split(/\s+/).length / 200)),
    category: "Blog",
    content: dbPost.content,
  };
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
          {renderContent(post.content)}
          <div className="mt-10 border-t border-line pt-6">
            <ShareButtons url={postUrl} title={post.title} />
          </div>
          <div className="mt-14 rounded-3xl bg-gradient-to-br from-accent to-accent-deep p-8 text-white text-center">
            <h2 className="text-2xl font-bold">
              Need help with this for{" "}
              <span className="font-accent font-normal">your business?</span>
            </h2>
            <p className="mt-2 text-white/85 text-sm">
              Submit your requirement and get a clear plan, honest pricing and a written scope.
            </p>
            <Link
              href="/start-project"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-accent hover:scale-[1.03] transition-transform"
            >
              Submit Project Requirement <Icon name="arrow" className="size-4" />
            </Link>
          </div>
        </article>
      </Section>
    </PageShell>
  );
}
