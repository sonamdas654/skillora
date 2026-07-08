import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { createReviewToken } from "@/lib/reviewToken";
import { site } from "@/lib/site";

const schema = z.object({
  clientName: z.string().min(2).max(120),
  clientBusiness: z.string().max(200).optional().or(z.literal("")),
});

// Generate a personal review-invite link for a delivered client.
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });

  const token = await createReviewToken({
    clientName: parsed.data.clientName,
    clientBusiness: parsed.data.clientBusiness || undefined,
  });
  return NextResponse.json({ ok: true, url: `${site.url}/review/${token}` });
}
