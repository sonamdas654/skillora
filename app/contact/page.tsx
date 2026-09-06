import type { Metadata } from "next";
import Link from "next/link";
import PageShell, { PageHero } from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icons";
import ContactForm from "@/components/ContactForm";
import { Section } from "@/components/Section";
import { site, whatsappLink } from "@/lib/site";
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
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Let&apos;s{" "}
            <span className="font-accent font-normal text-accent">talk</span>
          </>
        }
        subtitle="Not sure where to start? Send a message in plain words — we'll suggest the right direction, honestly."
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          {/* Left: message + form */}
          <Reveal>
            <div>
              <h2 className="text-2xl font-bold text-ink">Let&apos;s talk about your project</h2>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                Share your idea, question or requirement. Skilloura replies within 24 hours with the
                right direction — honestly, including cheaper options if they fit better.
              </p>
              <div className="mt-6 rounded-3xl border border-line bg-white p-6 sm:p-8">
                <h3 className="text-lg font-bold text-ink">Send a message</h3>
                <p className="mt-1 mb-6 text-sm text-ink-soft">
                  For general questions. Project requirements get better results through the{" "}
                  <Link href="/start-project" className="font-semibold text-accent hover:underline">
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
                className="card-lift rounded-2xl border border-line bg-white p-5"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-mint/10 text-mint">
                  <WhatsAppIcon className="size-5" />
                </span>
                <p className="mt-3 font-bold text-ink">WhatsApp</p>
                <p className="text-sm text-ink-soft">Fastest reply — usually within hours</p>
              </a>

              <a
                href={`mailto:${site.email}`}
                className="card-lift rounded-2xl border border-line bg-white p-5"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-accent-soft text-accent">
                  <Icon name="file" className="size-5" />
                </span>
                <p className="mt-3 font-bold text-ink">Email</p>
                <p className="text-sm text-ink-soft break-all">{site.email}</p>
              </a>

              <div className="rounded-2xl border border-line bg-white p-5">
                <span className="grid size-11 place-items-center rounded-xl bg-accent-soft text-accent">
                  <Icon name="clock" className="size-5" />
                </span>
                <p className="mt-3 font-bold text-ink">Business hours</p>
                <p className="text-sm text-ink-soft">{site.businessHours}</p>
              </div>

              <div className="rounded-2xl border border-line bg-white p-5">
                <span className="grid size-11 place-items-center rounded-xl bg-accent-soft text-accent">
                  <Icon name="globe" className="size-5" />
                </span>
                <p className="mt-3 font-bold text-ink">Service area</p>
                <p className="text-sm text-ink-soft">{site.serviceArea}</p>
              </div>

              <Link
                href="/start-project"
                className="card-lift rounded-2xl border border-line bg-white p-5"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-accent-soft text-accent">
                  <Icon name="spark" className="size-5" />
                </span>
                <p className="mt-3 font-bold text-ink">Project request</p>
                <p className="text-sm text-ink-soft">Use the smart form for an accurate quote</p>
              </Link>

              <a
                href={whatsappLink("Hi! I'd like to book a free 15-minute consultation call.")}
                target="_blank"
                rel="noopener noreferrer"
                className="card-lift rounded-2xl border border-line bg-white p-5"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-mint/10 text-mint">
                  <Icon name="smartphone" className="size-5" />
                </span>
                <p className="mt-3 font-bold text-ink">Consultation</p>
                <p className="text-sm text-ink-soft">Book a free 15-min call on WhatsApp</p>
              </a>

              <a
                href={site.googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="card-lift rounded-2xl border border-line bg-white p-5 sm:col-span-2"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-500 text-lg font-black">★</span>
                  <div>
                    <p className="font-bold text-ink">Find us on Google</p>
                    <p className="text-sm text-ink-soft">See our Business Profile &amp; leave a review ⭐</p>
                  </div>
                </div>
              </a>

              {/* Who handles what */}
              <div className="sm:col-span-2 rounded-2xl border border-line bg-soft-panel p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-ink">Reach the right place</p>
                <ul className="mt-3 space-y-1.5 text-sm text-ink-soft">
                  <li>
                    <span className="font-semibold text-ink">New project:</span>{" "}
                    <Link href="/start-project" className="text-accent hover:underline">smart project form</Link>
                  </li>
                  <li>
                    <span className="font-semibold text-ink">Existing client — support &amp; billing:</span>{" "}
                    <Link href="/client/login" className="text-accent hover:underline">your client portal</Link> (tickets &amp; invoices)
                  </li>
                  <li>
                    <span className="font-semibold text-ink">Anything else:</span>{" "}
                    <a href={`mailto:${site.email}`} className="text-accent hover:underline">{site.email}</a>
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
