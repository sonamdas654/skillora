import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

const createSchema = z.object({
  clientName: z.string().min(2).max(120),
  clientBusiness: z.string().max(200).optional().or(z.literal("")),
  rating: z.number().int().min(1).max(5),
  review: z.string().min(5).max(2000),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  const d = parsed.data;

  const testimonial = await prisma.testimonial.create({
    data: {
      clientName: d.clientName,
      clientBusiness: d.clientBusiness || null,
      rating: d.rating,
      review: d.review,
    },
  });
  return NextResponse.json({ ok: true, testimonial });
}
