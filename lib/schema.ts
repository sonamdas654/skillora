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
    // Region only — no street or postal code, because there is no public
    // address to state. "Odisha, India" is the location the Terms page
    // already declares, so this adds no new claim; it just makes a fact
    // Google previously had no way to read machine-readable.
    address: {
      "@type": "PostalAddress",
      addressRegion: "Odisha",
      addressCountry: "IN",
    },
    founder: {
      "@type": "Person",
      "@id": `${BASE}/#founder`,
      name: "Sonam Das",
      jobTitle: "Founder",
      image: `${BASE}/founder.png`,
      alumniOf: { "@type": "CollegeOrUniversity", name: "BITS Pilani" },
      worksFor: { "@id": `${BASE}/#organization` },
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
    address: {
      "@type": "PostalAddress",
      addressRegion: "Odisha",
      addressCountry: "IN",
    },
    // Odisha listed first: it is where the business actually operates from,
    // and a local signal is the one a new site can realistically compete on.
    // India and remote stay, because the work genuinely is delivered remotely.
    areaServed: [
      { "@type": "State", name: "Odisha" },
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

/**
 * Service schema for an industry solution page.
 *
 * This used to be written inline in app/solutions/[slug]/page.tsx, complete
 * with its own `const BASE = "https://www.skilloura.com"`. A second copy of
 * the canonical origin is exactly how the hostname split-brain in this repo
 * happened, so the literal lives in one file only.
 */
export function solutionServiceSchema(sol: {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  audience: string;
}, serviceName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: sol.metaTitle,
    url: `${BASE}/solutions/${sol.slug}`,
    description: sol.metaDescription,
    serviceType: serviceName,
    areaServed: { "@type": "Country", name: "India" },
    audience: { "@type": "Audience", audienceType: sol.audience },
    provider: { "@id": `${BASE}/#organization` },
  };
}

/**
 * ProfilePage + Person for the About page.
 *
 * /about carried no page-level structured data at all, even though it states
 * real, checkable credentials — an M.Tech from BITS Pilani, a decade of
 * hands-on work, five years of enterprise IT. Organization schema nests a
 * founder node, but nothing told search engines that /about is *the* page
 * about that person. This does, and it repeats only facts the page shows.
 */
export function founderProfileSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${BASE}/about#profile`,
    url: `${BASE}/about`,
    mainEntity: {
      "@type": "Person",
      "@id": `${BASE}/#founder`,
      name: "Sonam Das",
      jobTitle: "Founder",
      image: `${BASE}/founder.png`,
      url: `${BASE}/about`,
      email: site.email,
      alumniOf: { "@type": "CollegeOrUniversity", name: "BITS Pilani" },
      worksFor: { "@id": `${BASE}/#organization` },
      knowsAbout: [
        "Web development",
        "Mobile app development",
        "AI automation",
        "Business dashboards",
        "Custom software",
      ],
    },
  };
}

/**
 * ContactPage for /contact.
 *
 * The page has always displayed business hours, a service area, an email and
 * a WhatsApp number, and none of it was machine-readable. The contactPoint
 * here repeats only what the page shows.
 */
export function contactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${BASE}/contact#contactpage`,
    url: `${BASE}/contact`,
    about: { "@id": `${BASE}/#organization` },
    mainEntity: {
      "@id": `${BASE}/#organization`,
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer service",
          email: site.email,
          telephone: `+${site.whatsappNumber}`,
          availableLanguage: ["English", "Hindi"],
          areaServed: "IN",
        },
      ],
    },
  };
}
