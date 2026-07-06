import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

const createSchema = z.object({
  projectTitle: z.string().min(2).max(200),
  industry: z.string().min(2).max(100),
  category: z.string().min(2).max(100),
  problem: z.string().min(5).max(2000),
  solution: z.string().min(5).max(2000),
  features: z.string().max(2000).optional().or(z.literal("")), // comma separated
  demoLink: z.string().max(500).optional().or(z.literal("")),
  technologyUsed: z.string().max(300).optional().or(z.literal("")),
  isDemo: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  const d = parsed.data;

  const item = await prisma.portfolio.create({
    data: {
      projectTitle: d.projectTitle,
      industry: d.industry,
      category: d.category,
      problem: d.problem,
      solution: d.solution,
      features: d.features ? JSON.stringify(d.features.split(",").map((f) => f.trim()).filter(Boolean)) : null,
      demoLink: d.demoLink || null,
      technologyUsed: d.technologyUsed || null,
      isDemo: d.isDemo,
    },
  });
  return NextResponse.json({ ok: true, item });
}
