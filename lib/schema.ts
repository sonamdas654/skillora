// JSON-LD structured data builders — plan: SEO/trust pass.
// Only real, verifiable facts go in here (no fake ratings/reviews/addresses).
import { site } from "./site";
import type { BlogPost } from "./blog";

const BASE = "https://www.skilloura.com";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE}/#organization`,
    name: site.name,
    url: BASE,
    logo: `${BASE}/logo-mark.png`,
    image: `${BASE}/logo-full.png`,
    slogan: site.tagline,
    email: site.email,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: site.email,
      availableLanguage: ["English", "Hindi"],
    },
    sameAs: [site.googleReviewUrl],
  };
}

export function professionalServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${BASE}/#business`,
    name: site.name,
    url: BASE,
    image: `${BASE}/logo-full.png`,
    description: site.positioning,
    email: site.email,
    telephone: `+${site.whatsappNumber}`,
    priceRange: "₹₹",
    areaServed: [
      { "@type": "Country", name: "India" },
      { "@type": "Place", name: "Worldwide (remote)" },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "10:00",
        closes: "19:00",
      },
    ],
    sameAs: [site.googleReviewUrl],
    parentOrganization: { "@id": `${BASE}/#organization` },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE}/#website`,
    name: site.name,
    url: BASE,
    publisher: { "@id": `${BASE}/#organization` },
  };
}

export function serviceSchema(service: {
  name: string;
  slug: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    url: `${BASE}/services/${service.slug}`,
    description: service.description,
    serviceType: service.name,
    areaServed: { "@type": "Country", name: "India" },
    provider: { "@id": `${BASE}/#organization` },
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function blogPostingSchema(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: "en",
    image: `${BASE}/opengraph-image`,
    url: `${BASE}/blog/${post.slug}`,
    author: { "@id": `${BASE}/#organization` },
    publisher: { "@id": `${BASE}/#organization` },
    mainEntityOfPage: `${BASE}/blog/${post.slug}`,
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${BASE}${item.path}`,
    })),
  };
}
