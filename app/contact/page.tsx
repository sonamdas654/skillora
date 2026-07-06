import type { Metadata } from "next";
import PageShell, { PageHero } from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icons";
import ContactForm from "@/components/ContactForm";
import { Section } from "@/components/Section";
import { site, whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "@/components/Header";

export const metadata: Metadata = {
  title: "Contact — Ask Anything, Get a Reply Within 24 Hours",
  description:
    "Contact Skillora for websites, apps, AI automation, design and digital services. WhatsApp, email or contact form — reply within 24 hours.",
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
        subtitle="Not sure where to start? Send a message in plain words — I'll suggest the right direction, honestly."
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <div className="space-y-4">
              <a
                href={whatsappLink("Hi! I have a question about your services.")}
                target="_blank"
                rel="noopener noreferrer"
                className="card-lift flex items-center gap-4 rounded-2xl border border-line bg-white p-6"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-mint/10 text-mint">
                  <WhatsAppIcon className="size-6" />
                </span>
                <div>
                  <p className="font-bold text-ink">WhatsApp</p>
                  <p className="text-sm text-ink-soft">Fastest reply — usually within hours</p>
                </div>
              </a>
              <a
                href={`mailto:${site.email}`}
                className="card-lift flex items-center gap-4 rounded-2xl border border-line bg-white p-6"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
                  <Icon name="file" className="size-6" />
                </span>
                <div>
                  <p className="font-bold text-ink">Email</p>
                  <p className="text-sm text-ink-soft">{site.email}</p>
                </div>
              </a>
              <div className="rounded-2xl border border-line bg-white p-6">
                <p className="font-bold text-ink">Response time</p>
                <p className="mt-1 text-sm leading-6 text-ink-soft">
                  Every message gets a personal reply within 24 hours. For project requirements,
                  use the{" "}
                  <a href="/start-project" className="font-semibold text-accent hover:underline">
                    smart project form
                  </a>{" "}
                  — it captures everything needed for an accurate quote.
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-line bg-white p-6 sm:p-8">
              <h2 className="text-xl font-bold text-ink">Send a message</h2>
              <p className="mt-1 mb-6 text-sm text-ink-soft">
                For general questions. Project requirements get better results through the smart form.
              </p>
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </Section>
    </PageShell>
  );
}
