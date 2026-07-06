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
              <div className="text-right">
                <span className="rounded-full bg-accent/[0.07] px-2.5 py-1 text-[11px] font-semibold text-accent">
                  Estimate Live
                </span>
              </div>
            </div>
            <h3 className="mt-4 text-lg font-bold text-ink">{s.name}</h3>
            <p className="mt-1.5 text-sm leading-6 text-ink-soft">{s.description}</p>
            <div className="mt-4 space-y-1.5 text-xs text-ink-soft">
              <p className="flex items-center gap-1.5">
                <Icon name="clock" className="size-3.5 text-accent" />
                Timeline: {s.timeline}
              </p>
              <p className="flex items-center gap-1.5">
                <Icon name="check" className="size-3.5 text-mint" />
                Best for: {s.bestFor}
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {s.services.slice(0, 5).map((item) => (
                <span key={item} className="rounded-full bg-black/[0.04] px-2.5 py-1 text-[11px] font-medium text-ink-soft">
                  {item}
                </span>
              ))}
              {s.services.length > 5 && (
                <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-semibold text-accent">
                  +{s.services.length - 5} more
                </span>
              )}
            </div>
            <div className="mt-auto pt-5 flex items-center gap-2">
              <Link
                href={`/services/${s.slug}`}
                className="flex-1 rounded-full border border-line px-4 py-2 text-center text-sm font-semibold text-ink hover:border-accent hover:text-accent transition-colors"
              >
                View Details
              </Link>
              <Link
                href={`/start-project?service=${s.slug}`}
                className="flex-1 rounded-full bg-ink px-4 py-2 text-center text-sm font-semibold text-white hover:bg-accent transition-colors"
              >
                Submit Requirement
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
