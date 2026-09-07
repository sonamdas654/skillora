import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { serviceCategories } from "@/lib/services";
import { focusServices } from "@/lib/focusServices";
import { createPublicClient } from "@/lib/supabase/public";
import { solutions } from "@/lib/solutions";
import { policies } from "@/lib/policies";
import { portfolioItems } from "@/lib/portfolio";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url;
  // Only canonical, directly-servable URLs belong here — /start-project is a
  // 307 to /get-started, so the redirect target is listed instead.
  const staticPages = [
    "",
    "/services",
    "/ai-solutions",
    "/solutions",
    "/pricing",
    "/portfolio",
    "/references",
    "/how-it-works",
    "/about",
    "/contact",
    "/faq",
    "/blog",
    "/get-started",
  ].map((p) => ({
    url: `${base}${p}`,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.8,
  }));

  const servicePages = serviceCategories.map((s) => ({
    url: `${base}/services/${s.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // Focused service pages — same template, same importance, separate list so
  // they do not clutter the nine-category navigation.
  const focusServicePages = focusServices.map((s) => ({
    url: `${base}/services/${s.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Read the same source the pages read. This used to map the static
  // lib/blog.ts array while /blog and /blog/[slug] read Supabase, so the
  // sitemap advertised a different set of URLs than the site actually served
  // — four published posts were missing from it entirely.
  const supabase = createPublicClient();
  const { data: publishedPosts } = await supabase
    .from("blog_posts")
    .select("slug, date")
    .eq("status", "published");

  const blogPages = (publishedPosts ?? []).map((p: { slug: string; date: string }) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: p.date ? new Date(p.date) : undefined,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Industry solution pages. Four genuinely distinct pages targeting real
  // local intent, and none of them was in the sitemap.
  const solutionPages = solutions.map((s) => ({
    url: `${base}/solutions/${s.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Live concept demos.
  //
  // Only the seven website concepts are listed. Each of those renders its own
  // bespoke component, so each is a genuinely different page. The remaining
  // 56 demo ids map by PREFIX onto nine shared components — so 56 URLs would
  // serve nine distinct bodies with different titles, which is duplicate
  // content and does not belong in a sitemap. They stay crawlable through
  // /references, which is the right way for a visitor to reach them.
  const demoPages = [
    "web-saas",
    "web-ecommerce",
    "web-local",
    "web-portfolio",
    "web-realestate",
    "web-education",
    "web-clinic",
  ].map((id) => ({
    url: `${base}/demo/${id}`,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const policyPages = policies.map((p) => ({
    url: `${base}/${p.slug}`,
    changeFrequency: "yearly" as const,
    priority: 0.3,
  }));

  // Bespoke, content-rich concept pages (restaurant, gym, salon, etc.)
  const portfolioPages = portfolioItems
    .filter((p) => p.demoType)
    .map((p) => ({
      url: `${base}/portfolio/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  return [
    ...staticPages,
    ...servicePages,
    ...focusServicePages,
    ...solutionPages,
    ...blogPages,
    ...demoPages,
    ...policyPages,
    ...portfolioPages,
  ];
}
