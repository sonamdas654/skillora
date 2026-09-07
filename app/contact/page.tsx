import type { Metadata } from "next";
import Link from "next/link";
import PageShell, { PageHero } from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icons";
import ContactForm from "@/components/ContactForm";
import { Section } from "@/components/Section";
import { site, whatsappLink } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import { contactPageSchema } from "@/lib/schema";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

export const metadata: Metadata = {
  alternates: { canonical: "/contact" },
  title: "Contact — Ask Anything, Get a Reply Within 24 Hours",
  description:
    "Contact Skilloura for websites, apps, AI automation, design and digital services. WhatsApp, email or contact form — reply within 24 hours.",
};

export default function ContactPage() {
  return (
    <PageShell>
      <JsonLd data={contactPageSchema()} />
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Let&apos;s <span className="font-accent italic text-brand">talk</span>
          </>
        }
        subtitle="Not sure where to start? Send a message in plain words — we'll suggest the right direction, honestly."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]}
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          {/* Left: message + form */}
          <Reveal>
            <div>
              <h2 className="text-display-3 text-ink">Let&apos;s talk about your project</h2>
              <p className="mt-3 max-w-xl text-body-lg text-ink-soft">
                Share your idea, question or requirement. Skilloura replies within 24 hours with the
                right direction — honestly, including cheaper options if they fit better.
              </p>
              <div className="mt-7 rounded-card border border-line bg-surface p-6 shadow-e1 sm:p-8">
                <h3 className="text-title-2 text-ink">Send a message</h3>
                <p className="mb-6 mt-1.5 text-body-sm text-ink-soft">
                  For general questions. Project requirements get better results through the{" "}
                  <Link href="/start-project" className="font-semibold text-brand underline underline-offset-2">
                    smart form
                  </Link>
                  .
                </p>
                <ContactForm />
              </div>
            </div>
          </Reveal>

          {/* Right: contact cards */}
          <Reveal delay={0.1}>
            <div className="grid gap-4 sm:grid-cols-2">
              <a
                href={whatsappLink("Hi! I have a question about your services.")}
                target="_blank"
                rel="noopener noreferrer"
                className="card-lift rounded-card border border-line bg-surface p-5 shadow-e1"
              >
                <span className="grid size-10 place-items-center rounded-chip bg-success-soft text-success">
                  <WhatsAppIcon className="size-5" />
                </span>
                <p className="mt-3 text-title-3 text-ink">WhatsApp</p>
                <p className="mt-1 text-body-sm text-ink-soft">Fastest reply — usually within hours</p>
              </a>

              <a
                href={`mailto:${site.email}`}
                className="card-lift rounded-card border border-line bg-surface p-5 shadow-e1"
              >
                <span className="grid size-10 place-items-center rounded-chip bg-brand-soft text-brand">
                  <Icon name="file" className="size-5" />
                </span>
                <p className="mt-3 text-title-3 text-ink">Email</p>
                <p className="mt-1 break-all text-body-sm text-ink-soft">{site.email}</p>
              </a>

              <div className="rounded-card border border-line bg-surface p-5 shadow-e1">
                <span className="grid size-10 place-items-center rounded-chip bg-brand-soft text-brand">
                  <Icon name="clock" className="size-5" />
                </span>
                <p className="mt-3 text-title-3 text-ink">Business hours</p>
                <p className="mt-1 text-body-sm text-ink-soft">{site.businessHours}</p>
              </div>

              <div className="rounded-card border border-line bg-surface p-5 shadow-e1">
                <span className="grid size-10 place-items-center rounded-chip bg-brand-soft text-brand">
                  <Icon name="globe" className="size-5" />
                </span>
                <p className="mt-3 text-title-3 text-ink">Service area</p>
                <p className="mt-1 text-body-sm text-ink-soft">{site.serviceArea}</p>
              </div>

              <Link
                href="/start-project"
                className="card-lift rounded-card border border-line bg-surface p-5 shadow-e1"
              >
                <span className="grid size-10 place-items-center rounded-chip bg-brand-soft text-brand">
                  <Icon name="spark" className="size-5" />
                </span>
                <p className="mt-3 text-title-3 text-ink">Project request</p>
                <p className="mt-1 text-body-sm text-ink-soft">Use the smart form for an accurate quote</p>
              </Link>

              <a
                href={whatsappLink("Hi! I'd like to book a free 15-minute consultation call.")}
                target="_blank"
                rel="noopener noreferrer"
                className="card-lift rounded-card border border-line bg-surface p-5 shadow-e1"
              >
                <span className="grid size-10 place-items-center rounded-chip bg-success-soft text-success">
                  <Icon name="smartphone" className="size-5" />
                </span>
                <p className="mt-3 text-title-3 text-ink">Consultation</p>
                <p className="mt-1 text-body-sm text-ink-soft">Book a free 15-min call on WhatsApp</p>
              </a>

              <a
                href={site.googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="card-lift rounded-card border border-line bg-surface p-5 shadow-e1 sm:col-span-2"
              >
                <div className="flex items-center gap-3">
                  <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-chip bg-warning-soft text-title-2 text-warning-ink">★</span>
                  <div>
                    <p className="text-title-3 text-ink">Find us on Google</p>
                    <p className="mt-1 text-body-sm text-ink-soft">See our Business Profile &amp; leave a review ⭐</p>
                  </div>
                </div>
              </a>

              {/* Who handles what */}
              <div className="rounded-card border border-line bg-surface-sunken p-5 sm:col-span-2">
                <p className="text-micro font-mono uppercase text-ink-muted">Reach the right place</p>
                <ul className="mt-3 space-y-2 text-body-sm text-ink-soft">
                  <li>
                    <span className="font-semibold text-ink">New project:</span>{" "}
                    <Link href="/start-project" className="font-medium text-brand underline underline-offset-2">smart project form</Link>
                  </li>
                  <li>
                    <span className="font-semibold text-ink">Existing client — support &amp; billing:</span>{" "}
                    <Link href="/client/login" className="font-medium text-brand underline underline-offset-2">your client portal</Link> (tickets &amp; invoices)
                  </li>
                  <li>
                    <span className="font-semibold text-ink">Anything else:</span>{" "}
                    <a href={`mailto:${site.email}`} className="font-medium text-brand underline underline-offset-2">{site.email}</a>
                  </li>
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </PageShell>
  );
}
