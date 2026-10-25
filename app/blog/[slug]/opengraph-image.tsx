import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { createPublicClient } from "@/lib/supabase/public";

export const alt = "Skilloura article";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// Read through the cookie-free public client, the same one the post itself
// uses. A card must never be the reason a route turns dynamic.
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let title = "Article";
  let note: string | undefined;
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("title, category, read_minutes")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    if (data?.title) {
      title = data.title as string;
      const parts = [data.category, data.read_minutes ? `${data.read_minutes} min read` : null]
        .filter(Boolean);
      note = parts.length ? parts.join(" · ") : undefined;
    }
  } catch {
    // A card is not worth failing a build or a request over. The generic
    // root card is a fine fallback; a 500 on an image route is not.
  }

  return renderOgImage({ eyebrow: "Guide", title, note });
}
