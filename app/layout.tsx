import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { site } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import SiteAnalytics from "@/components/SiteAnalytics";
import { organizationSchema, websiteSchema, professionalServiceSchema } from "@/lib/schema";

// Body font — clean, highly legible.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Display / heading font. Same superfamily as Instrument Serif below, so
// the display face and the italic accent are designed to sit together.
const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

// Elegant italic accent for highlighted words.
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

// Spec voice: prices, timelines, step numbers, document rows. This is the
// "written scope" register, and the thing that stops the site reading as
// another all-sans SaaS template.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description:
    "Get your website, app, AI automation, design and digital work done in one place. Submit your requirement through a smart project form and get a clear plan, price and timeline.",
  keywords: [
    "website development",
    "app development",
    "AI automation",
    "logo design",
    "video editing",
    "digital marketing",
    "freelance digital agency",
    "Skilloura",
  ],
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description:
      "Smart digital services: websites, apps, AI automation, design, dashboards and marketing — delivered with a clear requirement-based process.",
    url: site.url,
    siteName: site.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description:
      "Smart digital services: websites, apps, AI automation, design, dashboards and marketing — delivered with a clear requirement-based process.",
  },
  ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } }
    : {}),
};

// Pinch-zoom stays available. Locking it (maximumScale: 1 / user-scalable=no)
// is a WCAG 1.4.4 failure and a Lighthouse accessibility flag, and it only
// ever applied on Android/desktop Chrome anyway — iOS has overridden it since
// iOS 10. The redesign fixes the layout so an accidental pinch no longer makes
// the page look broken, which is the real fix.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <JsonLd data={[organizationSchema(), websiteSchema(), professionalServiceSchema()]} />
        {children}
        <Analytics />
        <SiteAnalytics />
      </body>
    </html>
  );
}
