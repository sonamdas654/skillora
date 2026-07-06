import Link from "next/link";
import PageShell from "@/components/PageShell";
import Icon from "@/components/Icons";
import { Section } from "@/components/Section";

export default function NotFound() {
  return (
    <PageShell>
      <Section className="min-h-[60vh] grid place-items-center">
        <div className="text-center">
          <p className="text-7xl font-extrabold text-accent/20">404</p>
          <h1 className="mt-4 text-3xl font-bold text-ink">
            This page went{" "}
            <span className="font-accent font-normal text-accent">missing</span>
          </h1>
          <p className="mt-3 text-ink-soft">
            The page you&apos;re looking for doesn&apos;t exist or has moved.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-deep transition-colors"
            >
              Back to home <Icon name="arrow" className="size-4" />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-6 py-3 text-sm font-semibold text-ink hover:border-accent hover:text-accent transition-colors"
            >
              Browse services
            </Link>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
