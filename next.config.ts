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
