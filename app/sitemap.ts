import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { serviceCategories } from "@/lib/services";
import { blogPosts } from "@/lib/blog";
import { policies } from "@/lib/policies";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const staticPages = [
    "",
    "/services",
    "/pricing",
    "/portfolio",
    "/how-it-works",
    "/about",
    "/contact",
    "/faq",
    "/blog",
    "/start-project",
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

  return [...staticPages, ...servicePages, ...blogPages, ...policyPages];
}
