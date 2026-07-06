import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

const createSchema = z.object({
  title: z.string().min(3).max(250),
  content: z.string().min(20).max(60000),
  metaTitle: z.string().max(200).optional().or(z.literal("")),
  metaDescription: z.string().max(300).optional().or(z.literal("")),
  status: z.enum(["draft", "published"]).default("draft"),
});

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 90);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  const d = parsed.data;

  let slug = slugify(d.title);
  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  const post = await prisma.blogPost.create({
    data: {
      title: d.title,
      slug,
      content: d.content,
      metaTitle: d.metaTitle || null,
      metaDescription: d.metaDescription || null,
      status: d.status,
    },
  });
  return NextResponse.json({ ok: true, post });
}
