import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { verifyReviewToken } from "@/lib/reviewToken";
import { notifyNewReview } from "@/lib/notify";

const schema = z.object({
  token: z.string().min(10),
  rating: z.number().int().min(1).max(5),
  review: z.string().min(5).max(2000),
  clientBusiness: z.string().max(200).optional().or(z.literal("")),
});

// Public endpoint: a client submits their review via a signed invite link.
// One review per link — enforced by the unique inviteToken column.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  const d = parsed.data;

  const invite = await verifyReviewToken(d.token);
  if (!invite) {
    return NextResponse.json({ error: "This review link is invalid or has expired." }, { status: 400 });
  }

  const already = await prisma.testimonial.findUnique({ where: { inviteToken: invite.jti } });
  if (already) {
    return NextResponse.json({ error: "A review was already submitted with this link. Thank you!" }, { status: 409 });
  }

  const testimonial = await prisma.testimonial.create({
    data: {
      clientName: invite.clientName,
      clientBusiness: d.clientBusiness || invite.clientBusiness || null,
      rating: d.rating,
      review: d.review,
      status: "pending",
      inviteToken: invite.jti,
    },
  });

  // Serverless rule: must await, or the email silently drops on Vercel.
  await notifyNewReview(testimonial);

  return NextResponse.json({ ok: true });
}
