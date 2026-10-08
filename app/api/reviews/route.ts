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

  // The "already submitted?" check must go through review_token_used(), not a
  // select on testimonials.
  //
  // A submitted review is `pending` until an admin approves it, and
  // testimonials_select only exposes `active` rows to the public. So this
  // check, written as a select, could never see the very rows it exists to
  // find: `already` was always null, the friendly 409 below was unreachable,
  // and a client who submitted twice (a refresh, a double tap, a resent link)
  // fell through to the insert, hit the unique invite_token constraint and got
  // "Could not save your review. Please try again." — which invites them to do
  // the exact thing that cannot work.
  //
  // review_token_used() is SECURITY DEFINER precisely so this question can be
  // answered without widening the select policy and leaking every pending
  // reviewer's text to anon. app/review/[token]/page.tsx already uses it; this
  // route did not.
  const { data: alreadyUsed } = await supabase.rpc("review_token_used", {
    p_invite_token: invite.jti,
  });
  if (alreadyUsed) {
    return NextResponse.json({ error: "A review was already submitted with this link. Thank you!" }, { status: 409 });
  }

  const clientBusiness = d.clientBusiness || invite.clientBusiness || null;
  // NB: no .select() on this insert, deliberately. supabase-js turns .select()
  // into `Prefer: return=representation`, which makes PostgREST read the row
  // back in the same statement — and reading a `pending` row is exactly what
  // testimonials_select forbids, so the whole insert fails with a 42501 RLS
  // error even though the write itself is allowed. Verified 2026-09-07:
  // identical insert returns 201 with return=minimal and 401/42501 with
  // return=representation.
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
