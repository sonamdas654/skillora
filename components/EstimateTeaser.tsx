"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/track";
import Icon from "./Icons";
import { serviceCategories } from "@/lib/services";

// Two-tap transparent guide-price preview on the homepage. Shows the same
// package guide prices as /pricing — the exact quote always comes from the
// written quotation after reviewing scope.
function parsePrice(price: string): number | null {
  const digits = price.replace(/[^0-9]/g, "");
  return digits ? Number(digits) : null;
}

function money(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function EstimateTeaser() {
  const [serviceSlug, setServiceSlug] = useState(serviceCategories[0].slug);
  const [pkgIndex, setPkgIndex] = useState(0);
  const [touched, setTouched] = useState(false);

  const service = useMemo(
    () => serviceCategories.find((s) => s.slug === serviceSlug) ?? serviceCategories[0],
    [serviceSlug]
  );
  const pkg = service.packages[Math.min(pkgIndex, service.packages.length - 1)];
  const ourPrice = parsePrice(pkg.price);

  function interact() {
    if (!touched) {
      setTouched(true);
      // trackEvent, not @vercel/analytics track() directly.
      //
      // This was the only one of the five conversion events calling the Vercel
      // SDK straight, which meant it reached Vercel Analytics and never reached
      // Google Analytics — so a GA4 funnel showed four events and implied
      // nobody used the estimator. trackEvent fires to both.
      trackEvent("estimate_teaser_used");
    }
  }

  return (
    <div className="rounded-panel border border-white/80 bg-surface/60 p-6 sm:p-8 shadow-[0_24px_55px_-30px_rgba(15,23,42,0.3)] ring-1 ring-line/60 backdrop-blur-xl">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div>
          {/* Step 1: service */}
          <p className="text-body-sm font-bold uppercase tracking-wider text-ink-soft">
            1 · Pick a service
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {serviceCategories.map((s) => (
              <button
                key={s.slug}
                type="button"
                onClick={() => {
                  interact();
                  setServiceSlug(s.slug);
                  setPkgIndex(0);
                }}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  s.slug === serviceSlug
                    ? "border-accent bg-accent text-white"
                    : "border-line bg-surface-raised text-ink-soft hover:border-accent hover:text-accent"
                }`}
              >
                {s.tab}
              </button>
            ))}
          </div>

          {/* Step 2: package */}
          <p className="mt-6 text-body-sm font-bold uppercase tracking-wider text-ink-soft">
            2 · Pick a project size
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {service.packages.map((p, i) => (
              <button
                key={p.name}
                type="button"
                onClick={() => {
                  interact();
                  setPkgIndex(i);
                }}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  i === Math.min(pkgIndex, service.packages.length - 1)
                    ? "border-mint bg-mint text-white"
                    : "border-line bg-surface-raised text-ink-soft hover:border-mint hover:text-mint"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Result */}
        <div className="rounded-card border border-line bg-surface p-6 text-center">
          {ourPrice ? (
            <>
              <p className="text-body-sm font-semibold uppercase tracking-wider text-ink-soft">
                Guide price from
              </p>
              <p className="mt-2 text-display-2 font-extrabold tracking-tight text-ink">
                {money(ourPrice)}
                <span className="text-title-2 font-bold text-brand">+</span>
              </p>
              {pkg.delivery && (
                <p className="mt-1 text-body-sm font-semibold text-success">Delivery: {pkg.delivery}</p>
              )}
            </>
          ) : (
            <>
              <p className="text-display-3 font-extrabold tracking-tight text-ink">Custom</p>
              <p className="mt-1 text-body-sm font-semibold text-ink-soft">
                Quoted after a written scope — no surprises
              </p>
            </>
          )}
          <p className="mt-3 text-micro leading-4 text-ink-soft">
            Guide price for {pkg.name}. Final quote depends on your exact scope — always in
            writing before any payment.
          </p>
          <Link
            href={`/start-project?service=${service.slug}`}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-body-sm font-bold text-white shadow-[0_10px_24px_-10px_rgba(40,87,255,0.8)] hover:bg-brand-deep transition-colors"
          >
            Get exact quote <Icon name="arrow" className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
