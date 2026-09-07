import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * robots.txt
 *
 * The disallow list covers the genuinely private surfaces: the admin and
 * client portals, the API, the single-use review links, and the post-submit
 * thank-you page (which is also noindex).
 *
 * Deliberately NOT blocked: /get-started. It is the primary conversion page,
 * it is in the sitemap, and it now has real metadata — blocking it would hide
 * the one page the business most wants found.
 *
 * AI crawlers are allowed. This site's argument is that it explains its
 * process honestly and in public; being quotable by answer engines serves that
 * rather than working against it.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/thank-you", "/client", "/review", "/unauthorized"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
