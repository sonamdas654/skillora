import type { NextConfig } from "next";

const securityHeaders = [
  // Stop MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Disallow embedding the site in iframes (clickjacking protection)
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Send only the origin on cross-origin navigation
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // This site never needs these browser capabilities
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  // Phrasings people and inbound links actually use, pointed at the page that
  // answers them. Permanent, because these are naming choices rather than
  // temporary moves.
  async redirects() {
    return [
      // "web development" is the more common phrasing; the category slug is
      // website-development.
      { source: "/services/web-development", destination: "/services/website-development", permanent: true },
      { source: "/services/web-design", destination: "/services/website-development", permanent: true },
      { source: "/services/ecommerce", destination: "/services/ecommerce-development", permanent: true },
      { source: "/services/app-development", destination: "/services/mobile-app-development", permanent: true },
      { source: "/services/maintenance", destination: "/services/website-maintenance", permanent: true },
      { source: "/services/speed-optimization", destination: "/services/website-speed-optimization", permanent: true },
      { source: "/services/technical-seo", destination: "/services/seo", permanent: true },
      { source: "/services/google-business-profile", destination: "/services/local-seo", permanent: true },
      // Common alternative names for sections that already exist. Creating
      // real pages at these paths would split signals with /portfolio and
      // /blog for no benefit.
      { source: "/work", destination: "/portfolio", permanent: true },
      // /case-studies is a real page now — it was a redirect to /portfolio
      // while no such page existed. This one was a permanent (308) redirect,
      // which browsers cache hard, so it is fortunate it never reached
      // production: the new page would have been unreachable for anyone who
      // had followed the old one once.
      { source: "/insights", destination: "/blog", permanent: true },
      { source: "/articles", destination: "/blog", permanent: true },
      { source: "/quote", destination: "/start-project", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
    ];
  },

  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      {
        // Hero footage filenames carry a content hash (see
        // tools/video/encode.mjs), so they can be cached forever. A re-shoot
        // changes the hash and therefore the URL.
        source: "/hero/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
