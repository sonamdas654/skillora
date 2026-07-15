import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createReviewToken } from "@/lib/reviewToken";
import { site } from "@/lib/site";

const schema = z.object({
  clientName: z.string().min(2).max(120),
  clientBusiness: z.string().max(200).optional().or(z.literal("")),
});

// Generate a personal review-invite link for a delivered client.
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: profile } = await supabase.from("user_profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });

  const token = await createReviewToken({
    clientName: parsed.data.clientName,
    clientBusiness: parsed.data.clientBusiness || undefined,
  });
  return NextResponse.json({ ok: true, url: `${site.url}/review/${token}` });
}
