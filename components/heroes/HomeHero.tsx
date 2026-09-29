import Link from "next/link";
import Icon from "@/components/Icons";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import PremiumShowcaseCarousel from "./PremiumShowcaseCarousel";
import { whatsappLink } from "@/lib/site";

const TRUST = [
  { icon: "shield", label: "No hidden cost" },
  { icon: "clock", label: "Clear timeline" },
  { icon: "spark", label: "Dedicated project team" },
];

export default function HomeHero() {
  return (
    <section className="hero-reference relative isolate overflow-hidden bg-canvas">
      <div className="hero-reference__glow" aria-hidden />

      <div className="relative mx-auto max-w-page px-4 pb-10 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pb-12 lg:pt-24">
        <div className="grid min-w-0 items-center gap-12 min-[900px]:grid-cols-[0.96fr_1.04fr] min-[900px]:gap-5">
          <div className="relative z-10 min-w-0">
            <p className="rise inline-flex items-center gap-3 text-micro font-mono uppercase text-ink-soft">
              <span className="animate-signal-pulse block size-2 rounded-pill bg-signal" />
              Accepting projects · team delivered
            </p>

            <h1 className="rise mt-6 max-w-none text-display-1 text-ink xl:text-[4.2rem]" style={{ ["--rise-delay" as string]: "80ms" }}>
              Websites, apps and AI systems, built to a
            </h1>
            <p className="rise hero-reference__script mt-1" style={{ ["--rise-delay" as string]: "130ms" }}>
              written scope
            </p>

            <p className="rise mt-6 max-w-xl text-body-lg text-ink-soft min-[900px]:max-w-[36ch] xl:max-w-xl" style={{ ["--rise-delay" as string]: "180ms" }}>
              Share the requirement once. Get an itemised scope, a fixed quote and exact dates — before you pay anything.
            </p>

            <div className="rise mt-7 grid gap-3 sm:flex sm:flex-wrap" style={{ ["--rise-delay" as string]: "230ms" }}>
              <Link href="/start-project" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-pill bg-brand px-6 py-3.5 text-body-base font-semibold text-on-brand shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-deep">
                Get my written scope <Icon name="arrow" className="size-4" />
              </Link>
              <a href={whatsappLink("Hi! I'd like to discuss a project with Skilloura.")} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-pill border border-line-strong bg-surface/85 px-6 py-3.5 text-body-base font-semibold text-ink shadow-e1 backdrop-blur transition hover:-translate-y-0.5 hover:border-brand hover:text-brand">
                <WhatsAppIcon className="size-5 text-success" /> Ask on WhatsApp
              </a>
            </div>

            <ul className="rise mt-7 flex flex-wrap gap-x-6 gap-y-3 text-body-sm text-ink-soft" style={{ ["--rise-delay" as string]: "280ms" }}>
              {TRUST.map((item) => (
                <li key={item.label} className="flex items-center gap-2">
                  <Icon name={item.icon} className="size-4 text-ink" />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="rise min-w-0 overflow-hidden" style={{ ["--rise-delay" as string]: "160ms" }}>
            <PremiumShowcaseCarousel />
          </div>
        </div>

      </div>
    </section>
  );
}
