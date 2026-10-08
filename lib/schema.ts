// JSON-LD structured data builders — plan: SEO/trust pass.
// Only real, verifiable facts go in here (no fake ratings/reviews/addresses).
import { site } from "./site";
import type { BlogPost } from "./blog";

// Single source of truth for the canonical origin. This used to be its own
// hardcoded literal, which meant JSON-LD @id values and canonical tags could
// drift apart without anything failing — the entity graph would simply stop
// consolidating. Trailing slash stripped so `${BASE}/path` never doubles up.
const BASE = site.url.replace(/\/$/, "");

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
    // Matches the Google Business Profile exactly: Bhubaneswar, Odisha,
    // 751031. An earlier version of this said there was "no public address to
    // state" — that was written before anyone checked the profile, which
    // publishes the locality and postcode. Google reconciles a site's
    // structured data against the profile, and a site claiming only "Odisha,
    // IN" against a profile claiming Bhubaneswar 751031 is a weaker match than
    // it needs to be. No street line, because the profile has none either.
    address: {
      "@type": "PostalAddress",
      addressLocality: site.locality,
      addressRegion: "Odisha",
      postalCode: site.postalCode,
      addressCountry: "IN",
    },
    // The phone was on ProfessionalService but not here, so the two nodes
    // described the same business with different contact detail.
    telephone: `+${site.whatsappNumber}`,
    founder: {
      "@type": "Person",
      "@id": `${BASE}/#founder`,
      name: "Sonam Das",
      jobTitle: "Founder",
      image: `${BASE}/sonam-das-founder-skilloura.webp`,
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
      addressLocality: site.locality,
      addressRegion: "Odisha",
      postalCode: site.postalCode,
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
 * /about carried no page-level structured data at all, even though it states a
 * real, checkable credential: an M.Tech from BITS Pilani. Organization schema
 * nests a founder node, but nothing told search engines that /about is *the*
 * page about that person. This does, and it repeats only facts the page shows.
 *
 * That last clause is a constraint, not a description. The experience figures
 * this comment used to cite — a decade of hands-on work, five years of
 * enterprise IT — left both founder blocks when the owner supplied their own
 * biography, so they left this note too. Nothing emitted here may assert
 * something a visitor cannot read on the page.
 */
/**
 * The founder image is named for its subject, not for its slot.
 *
 * It was /founder.png — a 2 MB PNG of a photograph, which is the wrong
 * container for one: re-encoded as WebP at the same dimensions it is 104 kB,
 * a 95% reduction with no visible difference at the size it renders. The
 * filename is now descriptive because an image file name is one of the few
 * signals Google Images has about what an image shows, and "founder.png"
 * tells it nothing.
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
      image: `${BASE}/sonam-das-founder-skilloura.webp`,
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

/**
 * HowTo for /how-it-works.
 *
 * An eight-step process page that had no HowTo markup — one of the clearest
 * schema misses on the site, because the steps are genuine, sequential and
 * already written out on the page. Only what the page shows is marked up.
 */
export function howToSchema(steps: { title: string; desc: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${BASE}/how-it-works#howto`,
    name: "How a project runs at Skilloura",
    description:
      "From requirement submission to final delivery: smart form, written quotation, preview before delivery and a documented handover.",
    totalTime: "P10D",
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.desc,
      url: `${BASE}/how-it-works#step-${i + 1}`,
    })),
  };
}

/**
 * ItemList for a service index. Tells search engines that /services is a
 * collection and what is in it, which it previously had no way to know.
 */
export function serviceListSchema(
  items: { slug: string; name: string; description: string }[],
  listUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${listUrl}#itemlist`,
    url: listUrl,
    numberOfItems: items.length,
    itemListElement: items.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.name,
      description: s.description,
      url: `${BASE}/services/${s.slug}`,
    })),
  };
}

/**
 * AggregateRating for the organisation — emitted ONLY from reviews a client
 * actually submitted.
 *
 * The site shows some studio-written testimonials, which the owner asked for
 * and which are marked `source = 'studio-written'` in the database. Showing
 * copy on your own page is one thing; telling Google you hold N verified
 * reviews averaging X stars is a different claim entirely, and making it
 * falsely is what earns a manual action — which would wreck the one goal this
 * whole rebuild exists for.
 *
 * So this function is the gate. It counts only `client-submitted` rows and
 * returns null until there are at least three of them, at which point the
 * schema starts being emitted on its own with no code change. Three, not one,
 * because a single review rendered as an aggregate is both statistically
 * silly and something Google is known to ignore or distrust.
 *
 * Do not "improve" this by passing all rows in. The filter is the point.
 */
export function aggregateRatingSchema(
  reviews: { rating: number; source?: string | null }[]
) {
  const real = reviews.filter((r) => r.source === "client-submitted");
  if (real.length < 3) return null;

  const total = real.reduce((sum, r) => sum + r.rating, 0);
  return {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    itemReviewed: { "@id": `${BASE}/#organization` },
    ratingValue: Number((total / real.length).toFixed(1)),
    reviewCount: real.length,
    bestRating: 5,
    worstRating: 1,
  };
}
