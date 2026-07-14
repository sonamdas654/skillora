"use client";

import { useState } from "react";
import Link from "next/link";
import { serviceCategories, serviceTabs } from "@/lib/services";
import Icon from "./Icons";

export default function ServicesTabs() {
  const [activeTab, setActiveTab] = useState<string>("All");
  const tabs = ["All", ...serviceTabs];
  const visible =
    activeTab === "All"
      ? serviceCategories
      : serviceCategories.filter((s) => s.tab === activeTab);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === tab
                ? "bg-ink text-white"
                : "border border-line bg-white text-ink-soft hover:border-accent hover:text-accent"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((s) => (
          <div key={s.slug} className="card-lift flex flex-col rounded-2xl border border-line bg-white p-6">
            <div className="flex items-start justify-between">
              <span className="grid size-12 place-items-center rounded-xl bg-accent-soft text-accent">
                <Icon name={s.icon} className="size-6" />
              </span>
              <span className="rounded-full bg-accent/[0.07] px-2.5 py-1 text-[11px] font-bold text-accent">
                From {s.startingPrice}
              </span>
            </div>
            <h3 className="mt-4 text-lg font-bold text-ink">{s.name}</h3>
            {/* Outcome-first: the result the client actually wants */}
            <p className="mt-1.5 text-sm leading-6 text-ink">{s.outcome}</p>
            <div className="mt-4 space-y-1.5 text-xs text-ink-soft">
              <p className="flex items-center gap-1.5">
                <Icon name="clock" className="size-3.5 shrink-0 text-accent" />
                Timeline: {s.timeline}
              </p>
              <p className="flex items-start gap-1.5">
                <Icon name="check" className="mt-0.5 size-3.5 shrink-0 text-mint" />
                <span>Best for: {s.bestFor}</span>
              </p>
            </div>
            {/* Example project — makes the outcome concrete */}
            <div className="mt-4 rounded-xl bg-background px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">
                Example project
              </p>
              <p className="mt-0.5 text-xs font-medium leading-5 text-ink">{s.exampleProject}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {s.services.slice(0, 4).map((item) => (
                <span key={item} className="rounded-full bg-black/[0.04] px-2.5 py-1 text-[11px] font-medium text-ink-soft">
                  {item}
                </span>
              ))}
              {s.services.length > 4 && (
                <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-semibold text-accent">
                  +{s.services.length - 4} more
                </span>
              )}
            </div>
            <div className="mt-auto pt-5">
              <Link
                href={`/start-project?service=${s.slug}`}
                className="block rounded-full bg-ink px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-accent transition-colors"
              >
                Get Free Project Plan
              </Link>
              <Link
                href={`/services/${s.slug}`}
                data-track="service_detail_click"
                className="mt-2 flex items-center justify-center gap-1 text-xs font-semibold text-ink-soft hover:text-accent transition-colors"
              >
                View full details <Icon name="arrow" className="size-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
