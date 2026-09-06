import Link from "next/link";
import Logo from "./Logo";
import WhatsAppIcon from "./icons/WhatsAppIcon";
import { site, whatsappLink } from "@/lib/site";
import { serviceCategories } from "@/lib/services";

const company = [
  { href: "/about", label: "About" },
  { href: "/ai-solutions", label: "AI Systems" },
  { href: "/solutions", label: "Solutions by Industry" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/references", label: "Reference Layouts" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

const legal = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/data-security", label: "Data & File Security" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/refund-policy", label: "Refund Policy" },
  { href: "/revision-policy", label: "Revision Policy" },
  { href: "/payment-policy", label: "Payment Policy" },
];

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-accent"
    >
      <span className="h-px w-0 bg-accent transition-all duration-300 group-hover:w-3" aria-hidden />
      <span className="transition-transform duration-300 group-hover:translate-x-0.5">{label}</span>
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-line bg-gradient-to-b from-surface via-canvas to-surface-sunken">
      {/* Hairline glow along the top edge */}
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
        aria-hidden
      />
      {/* Soft brand glows in the corners */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(38% 55% at 6% 0%, rgb(224 145 63 / 0.10), transparent 60%), radial-gradient(34% 50% at 94% 100%, rgb(14 82 87 / 0.07), transparent 60%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1520px] px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 pb-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand + CTA */}
          <div className="max-w-sm">
            <Logo size="lg" />
            <p className="mt-4 text-sm leading-6 text-ink-soft">
              {site.tagline} Websites, apps, AI automation, design, dashboards
              and marketing — with a clear requirement-based process.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={whatsappLink("Hi! I found you through skilloura.com.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-mint px-5 py-2.5 text-sm font-semibold text-white shadow-e2 transition-all hover:scale-[1.03] hover:brightness-105"
              >
                <WhatsAppIcon className="size-4" />
                Chat on WhatsApp
              </a>
              <Link
                href="/start-project"
                className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-white/70 px-5 py-2.5 text-sm font-semibold text-accent backdrop-blur transition-colors hover:border-accent hover:bg-accent-soft"
              >
                Get Free Quote
              </Link>
            </div>
            <a
              href={`mailto:${site.email}`}
              className="mt-5 inline-block text-sm font-medium text-ink-soft transition-colors hover:text-accent"
            >
              {site.email}
            </a>
            <p className="mt-3 text-xs text-ink-soft">
              Serving {site.serviceArea} · {site.businessHours}
            </p>
            <a
              href={site.googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-ink-soft transition-colors hover:text-accent"
            >
              <span className="text-amber-500">★</span> Review us on Google
            </a>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink">Services</h3>
            <ul className="mt-5 space-y-3">
              {serviceCategories.map((s) => (
                <li key={s.slug}>
                  <FooterLink href={`/services/${s.slug}`} label={s.name} />
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink">Company</h3>
            <ul className="mt-5 space-y-3">
              {company.map((l) => (
                <li key={l.href}>
                  <FooterLink href={l.href} label={l.label} />
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink">Policies</h3>
            <ul className="mt-5 space-y-3">
              {legal.map((l) => (
                <li key={l.href}>
                  <FooterLink href={l.href} label={l.label} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-accent/10 pt-5 sm:flex-row">
          <p className="text-xs font-medium text-ink-soft">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="text-xs font-medium text-ink-soft">
            Clear pricing · Preview before delivery · Secure file handling
          </p>
        </div>
      </div>
    </footer>
  );
}
