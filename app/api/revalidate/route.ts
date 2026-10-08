import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { pingIndexNow } from "@/lib/indexnow";

/**
 * On-demand revalidation for admin publishes.
 *
 * The public pages moved from `force-dynamic` to ISR, which removed a ~7
 * second time-to-first-byte on the homepage, /blog and /portfolio. The
 * trade-off is that a publish is no longer visible instantly — it appears at
 * the next revalidation window, up to ten minutes later.
 *
 * That gap is exactly how ISR gets reverted: an editor publishes, refreshes,
 * sees the old page, decides the site is broken, and someone puts
 * `force-dynamic` back. This closes it — the admin calls this after a
 * successful write and the affected pages rebuild immediately.
 *
 * Admin-only, and it takes a scope rather than an arbitrary path, so it
 * cannot be used to force-rebuild the whole site.
 */
const schema = z.object({
  scope: z.enum(["blog", "portfolio", "testimonials"]),
  slug: z.string().max(200).optional(),
});

const PATHS: Record<string, string[]> = {
  // The homepage lists testimonials; /blog and /portfolio list their own.
  blog: ["/blog", "/sitemap.xml"],
  portfolio: ["/portfolio", "/sitemap.xml"],
  testimonials: ["/"],
};

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  const { scope, slug } = parsed.data;
  const paths = [...(PATHS[scope] ?? [])];
  if (scope === "blog" && slug) paths.push(`/blog/${slug}`);

  for (const path of paths) {
    revalidatePath(path);
  }

  // Bing and friends get told a URL changed. Best effort; never blocks.
  const submittable = paths.filter((p) => !p.endsWith(".xml"));
  await pingIndexNow(submittable);

  return NextResponse.json({ ok: true, revalidated: paths });
}
