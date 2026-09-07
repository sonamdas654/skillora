import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { serviceCategories } from "@/lib/services";
import { focusServices } from "@/lib/focusServices";
import { blogPosts } from "@/lib/blog";
import { policies } from "@/lib/policies";
import { portfolioItems } from "@/lib/portfolio";

export default function sitemap(): MetadataRoute.Sitemap {
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

  const blogPages = blogPosts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
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
    ...blogPages,
    ...policyPages,
    ...portfolioPages,
  ];
}
