import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { verifyReviewToken } from "@/lib/reviewToken";
import { notifyNewReview } from "@/lib/notify";

const schema = z.object({
  token: z.string().min(10),
  rating: z.number().int().min(1).max(5),
  review: z.string().min(5).max(2000),
  clientBusiness: z.string().max(200).optional().or(z.literal("")),
});

// Public endpoint: a client submits their review via a signed invite link.
// One review per link — enforced by the unique invite_token column.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  const d = parsed.data;

  const invite = await verifyReviewToken(d.token);
  if (!invite) {
    return NextResponse.json({ error: "This review link is invalid or has expired." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: already } = await supabase
    .from("testimonials")
    .select("id")
    .eq("invite_token", invite.jti)
    .maybeSingle();
  if (already) {
    return NextResponse.json({ error: "A review was already submitted with this link. Thank you!" }, { status: 409 });
  }

  const clientBusiness = d.clientBusiness || invite.clientBusiness || null;
  const { error } = await supabase.from("testimonials").insert({
    client_name: invite.clientName,
    client_business: clientBusiness,
    rating: d.rating,
    review: d.review,
    status: "pending",
    invite_token: invite.jti,
  });
  if (error) {
    return NextResponse.json({ error: "Could not save your review. Please try again." }, { status: 500 });
  }

  // Serverless rule: must await, or the email silently drops on Vercel.
  await notifyNewReview({
    clientName: invite.clientName,
    clientBusiness,
    rating: d.rating,
    review: d.review,
  });

  return NextResponse.json({ ok: true });
}
