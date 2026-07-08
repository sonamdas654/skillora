import type { Metadata } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { site } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
