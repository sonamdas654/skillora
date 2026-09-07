import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import Icon from "@/components/Icons";
import { Section } from "@/components/Section";
import { whatsappLink } from "@/lib/site";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

export const metadata: Metadata = {
  title: "Thank You — Request Received",
  description: "Your project request has been received.",
  robots: { index: false },
};

export default function ThankYouPage() {
  return (
    <PageShell>
      <Section className="min-h-[60vh] grid place-items-center">
        <div className="mx-auto max-w-xl text-center">
          <span className="mx-auto grid size-20 place-items-center rounded-full bg-success/10 text-success">
            <Icon name="check" className="size-10" />
          </span>
          <h1 className="mt-6 text-display-3 sm:text-display-2 font-extrabold tracking-tight text-ink">
            Thank you! Your request is{" "}
            <span className="font-accent font-normal text-brand">received.</span>
          </h1>
          <p className="mt-4 text-body-base leading-7 text-ink-soft">
            Your project request has been received. We will review your details and contact you
            soon on WhatsApp or email — usually within 24 hours.
          </p>
          <div className="mt-8 rounded-card border border-line bg-surface p-6 text-left">
            <p className="text-body-sm font-bold text-ink">What happens next?</p>
            <ol className="mt-3 space-y-2 text-body-sm text-ink-soft">
              <li className="flex gap-2.5"><span className="font-bold text-brand">1.</span> We review your requirement and files</li>
              <li className="flex gap-2.5"><span className="font-bold text-brand">2.</span> You get a reply with questions or a clear proposal</li>
              <li className="flex gap-2.5"><span className="font-bold text-brand">3.</span> Scope, price and timeline finalized in writing</li>
            </ol>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={whatsappLink("Hi! I just submitted a project request on your website.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-success px-6 py-3 text-body-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              <WhatsAppIcon className="size-4" /> Continue on WhatsApp
            </a>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-6 py-3 text-body-sm font-semibold text-ink hover:border-brand hover:text-brand transition-colors"
            >
              Back to home
            </Link>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
