import Link from "next/link";
import Logo from "./Logo";
import { site, whatsappLink } from "@/lib/site";
import { serviceCategories } from "@/lib/services";

const company = [
  { href: "/about", label: "About" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

const legal = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/refund-policy", label: "Refund Policy" },
  { href: "/revision-policy", label: "Revision Policy" },
  { href: "/payment-policy", label: "Payment Policy" },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-4 text-sm leading-6 text-ink-soft max-w-xs">
              {site.tagline} Websites, apps, AI automation, design, dashboards
              and marketing — with a clear requirement-based process.
            </p>
            <a
              href={whatsappLink("Hi! I found you through skillora.com.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-mint/10 px-4 py-2 text-sm font-semibold text-mint hover:bg-mint/20 transition-colors"
            >
              Chat on WhatsApp
            </a>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink">Services</h3>
            <ul className="mt-4 space-y-2.5">
              {serviceCategories.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-sm text-ink-soft hover:text-accent transition-colors"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink">Company</h3>
            <ul className="mt-4 space-y-2.5">
              {company.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-ink-soft hover:text-accent transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink">Policies</h3>
            <ul className="mt-4 space-y-2.5">
              {legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-ink-soft hover:text-accent transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="mt-6 text-sm font-semibold text-ink">Contact</h3>
            <a
              href={`mailto:${site.email}`}
              className="mt-2 block text-sm text-ink-soft hover:text-accent transition-colors"
            >
              {site.email}
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-line pt-6">
          <p className="text-xs text-ink-soft">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="text-xs text-ink-soft">
            Clear pricing · Demo before delivery · Secure file handling
          </p>
        </div>
      </div>
    </footer>
  );
}
