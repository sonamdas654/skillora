import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppSticky from "./WhatsAppSticky";

export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="pt-16">{children}</main>
      <Footer />
      <WhatsAppSticky />
    </>
  );
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="relative overflow-hidden bg-grid border-b border-line">
      <div className="absolute inset-0 bg-hero-glow" aria-hidden />
      <div className="relative mx-auto max-w-[1520px] px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
        {eyebrow && (
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-white px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-accent shadow-sm">
            {eyebrow}
          </p>
        )}
        <h1 className="mx-auto max-w-3xl text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.08] text-ink">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg leading-7 text-ink-soft">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
