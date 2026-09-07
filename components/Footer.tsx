import Link from "next/link";
import Logo from "./Logo";
import Icon from "./Icons";
import WhatsAppIcon from "./icons/WhatsAppIcon";
import { site, whatsappLink } from "@/lib/site";
import { serviceCategories } from "@/lib/services";

/**
 * Footer.
 *
 * The previous one was the standard four-column template — brand blurb, three
 * link lists, copyright bar — which is exactly the shape every agency site
 * ends on. This is two deliberate moments instead:
 *
 * 1. A closing band on the one deep ink surface the art direction allows,
 *    carrying the actual offer. This is also where the signal green earns its
 *    keep: on deep petrol the contrast is genuinely high, which is the only
 *    place a full signal fill is permitted.
 * 2. A quiet directory floor — mono group labels, hairline rules, no cards —
 *    followed by a single identity line.
 *
 * Every link from the old footer is still here: nine services, ten company
 * pages, six policies, email, WhatsApp, the Google review link, service area
 * and business hours.
 */

const company = [
  { href: "/about", label: "About" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/ai-solutions", label: "AI Systems" },
  { href: "/solutions", label: "Solutions by Industry" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/case-studies", label: "Case Studies" },
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

const guarantees = [
  "Written scope before ₹1",
  "Private staging preview",
  "Full source handover",
];

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block py-1 text-body-sm text-ink-soft transition-colors hover:text-brand"
    >
      {label}
    </Link>
  );
}

function LinkGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-3 border-b border-line pb-2 text-micro font-mono uppercase text-ink-muted">
        {label}
      </h3>
      {children}
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="mt-auto">
      {/* ── Closing moment ───────────────────────────────────── */}
      <section
        data-footer-cta
        className="relative overflow-hidden bg-surface-ink text-on-ink"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-32 size-[32rem] rounded-pill opacity-60 blur-[90px]"
          style={{ background: "rgb(168 220 30 / 0.13)" }}
        />
        <div className="relative mx-auto flex max-w-page flex-col gap-8 px-4 py-14 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8 lg:py-16">
          <div className="max-w-xl">
            <h2 className="text-display-3">
              Tell us the requirement. Get the{" "}
              <span className="font-accent italic text-signal">scope in writing</span>.
            </h2>
            <p className="mt-3 text-body-base text-on-ink-soft">
              Nothing starts, and nothing is charged, until the scope, the price and the
              dates are agreed and documented.
            </p>
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
              {guarantees.map((g) => (
                <li key={g} className="flex items-center gap-2 text-micro font-mono text-on-ink-soft">
                  <span aria-hidden className="size-1.5 rounded-pill bg-signal" />
                  {g}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/start-project"
              className="inline-flex items-center gap-2 rounded-pill bg-signal px-6 py-3.5 text-body-base font-semibold text-surface-ink transition-transform hover:scale-[1.02]"
            >
              Start my project
              <Icon name="arrow" className="size-4" />
            </Link>
            <a
              href={whatsappLink("Hi! I found you through skilloura.com.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-pill border border-line-on-ink px-5 py-3.5 text-body-base font-semibold text-on-ink transition-colors hover:bg-on-ink/10"
            >
              <WhatsAppIcon className="size-4" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── Directory floor ──────────────────────────────────── */}
      <div className="border-t border-line bg-canvas">
        <div className="mx-auto max-w-page px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <LinkGroup label="Services">
              <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-1">
                {serviceCategories.map((s) => (
                  <FooterLink key={s.slug} href={`/services/${s.slug}`} label={s.name} />
                ))}
              </div>
            </LinkGroup>

            <LinkGroup label="Company">
              {company.map((l) => (
                <FooterLink key={l.href} href={l.href} label={l.label} />
              ))}
            </LinkGroup>

            <LinkGroup label="Policies">
              {legal.map((l) => (
                <FooterLink key={l.href} href={l.href} label={l.label} />
              ))}
            </LinkGroup>

            <LinkGroup label="Direct line">
              <a
                href={`mailto:${site.email}`}
                className="block py-1 text-body-sm font-semibold text-ink transition-colors hover:text-brand"
              >
                {site.email}
              </a>
              <p className="mt-2 text-body-sm text-ink-soft">{site.businessHours}</p>
              <p className="mt-1 text-body-sm text-ink-soft">Serving {site.serviceArea}</p>
              <a
                href={site.googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-body-sm font-semibold text-ink-soft transition-colors hover:text-brand"
              >
                <span aria-hidden className="text-warning">
                  ★
                </span>
                Review us on Google
              </a>
            </LinkGroup>
          </div>
        </div>
      </div>

      {/* ── Identity line ────────────────────────────────────── */}
      <div className="border-t border-line bg-surface-sunken">
        <div className="mx-auto flex max-w-page flex-col items-start gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <Logo />
          <div className="flex flex-col gap-1 text-micro font-mono uppercase text-ink-muted sm:items-end">
            <p>Clear pricing · Preview before delivery · Secure file handling</p>
            <p>
              © {new Date().getFullYear()} {site.name}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
