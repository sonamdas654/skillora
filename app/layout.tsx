import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Instrument_Serif } from "next/font/google";
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

// Display / heading font — modern, premium SaaS feel.
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

// Elegant italic accent for highlighted words.
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jakarta.variable} ${instrumentSerif.variable} h-full antialiased`}
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
