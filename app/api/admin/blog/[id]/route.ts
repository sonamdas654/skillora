import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

const patchSchema = z.object({
  title: z.string().min(3).max(250).optional(),
  content: z.string().min(20).max(60000).optional(),
  metaTitle: z.string().max(200).optional().or(z.literal("")),
  metaDescription: z.string().max(300).optional().or(z.literal("")),
  status: z.enum(["draft", "published"]).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });

  const d = parsed.data;
  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      ...(d.title && { title: d.title }),
      ...(d.content && { content: d.content }),
      ...(d.metaTitle !== undefined && { metaTitle: d.metaTitle || null }),
      ...(d.metaDescription !== undefined && { metaDescription: d.metaDescription || null }),
      ...(d.status && { status: d.status }),
    },
  });
  return NextResponse.json({ ok: true, post });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
