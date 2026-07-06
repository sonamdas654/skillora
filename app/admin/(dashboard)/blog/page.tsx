import { prisma } from "@/lib/db";
import BlogManager from "@/components/admin/BlogManager";

export const metadata = { title: "Blog CMS", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function BlogAdminPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <BlogManager
      posts={posts.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        content: p.content,
        metaTitle: p.metaTitle,
        metaDescription: p.metaDescription,
        status: p.status,
        createdAt: p.createdAt.toISOString(),
      }))}
    />
  );
}
