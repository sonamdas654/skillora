"use client";

import { useState } from "react";
import Link from "next/link";
import { serviceCategories, serviceTabs } from "@/lib/services";
import Icon from "./Icons";

/**
 * The service index.
 *
 * This was a row of filter pills over a three-column grid of icon cards, each
 * card carrying an icon tile, a price chip, an outcome, two meta lines, an
 * example box, four feature pills and two buttons. Nine of them at once is a
 * wall — and it is the exact "heading + 3 cards" shape the brief rules out.
 *
 * It is now an index: one row per service, hairline-separated, with the name
 * and the outcome carrying the weight and the commercial facts sitting in a
 * mono column on the right where they can be compared down the page. That is
 * what someone choosing a service actually does — compare — and a grid makes
 * comparison harder, not easier.
 *
 * The tab filter is kept because filtering nine services is genuinely useful.
 * `data-track="service_detail_click"` is kept because site-wide analytics
 * depends on it.
 */
export default function ServicesTabs() {
  const [activeTab, setActiveTab] = useState<string>("All");
  const tabs = ["All", ...serviceTabs];
  const visible =
    activeTab === "All"
      ? serviceCategories
      : serviceCategories.filter((s) => s.tab === activeTab);

  return (
    <div>
      <div className="flex flex-wrap gap-x-5 gap-y-2 border-b border-line pb-4">
        {tabs.map((tab) => {
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              aria-pressed={active}
              className={`text-body-sm font-medium transition-colors ${
                active
                  ? "text-ink underline decoration-signal decoration-2 underline-offset-8"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <div>
        {visible.map((s, i) => (
          <div
            key={s.slug}
            className="grid gap-x-8 gap-y-4 border-b border-line py-7 lg:grid-cols-[auto_1fr_auto]"
          >
            <span className="hidden pt-1 font-mono text-micro text-ink-muted lg:block">
              {String(i + 1).padStart(2, "0")}
            </span>

            <div className="min-w-0">
              <h3 className="font-display text-title-1 text-ink">{s.name}</h3>
              <p className="mt-2 max-w-2xl text-body-base text-ink-soft">{s.outcome}</p>
              <p className="mt-3 text-body-sm text-ink-muted">
                <span className="font-mono uppercase">Example</span> — {s.exampleProject}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                <Link
                  href={`/start-project?service=${s.slug}`}
                  className="inline-flex items-center gap-2 rounded-pill bg-brand px-5 py-2.5 text-body-sm font-semibold text-on-brand transition-colors hover:bg-brand-deep"
                >
                  Get a project plan
                </Link>
                <Link
                  href={`/services/${s.slug}`}
                  data-track="service_detail_click"
                  className="group inline-flex items-center gap-1.5 text-body-sm font-semibold text-brand"
                >
                  Full details and packages
                  <Icon
                    name="arrow"
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </div>

            <dl className="shrink-0 lg:w-56 lg:border-l lg:border-line lg:pl-8">
              <div className="flex items-baseline justify-between gap-4 border-b border-line py-1.5 lg:border-b-0">
                <dt className="text-body-sm text-ink-soft">From</dt>
                <dd className="font-mono text-body-base font-medium text-ink">
                  {s.startingPrice}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-1.5">
                <dt className="text-body-sm text-ink-soft">Timeline</dt>
                <dd className="font-mono text-body-sm text-ink">{s.timeline}</dd>
              </div>
              <p className="mt-2 text-body-sm text-ink-muted">{s.bestFor}</p>
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}
