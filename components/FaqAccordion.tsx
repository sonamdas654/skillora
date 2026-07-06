"use client";

import { useState } from "react";
import type { Faq } from "@/lib/faqs";

export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="divide-y divide-line rounded-2xl border border-line bg-white">
      {faqs.map((faq, i) => {
        const open = openIdx === i;
        return (
          <div key={faq.q}>
            <button
              className="flex w-full items-center justify-between gap-4 px-5 sm:px-6 py-5 text-left"
              onClick={() => setOpenIdx(open ? null : i)}
              aria-expanded={open}
            >
              <span className="text-base font-semibold text-ink">{faq.q}</span>
              <span
                className={`grid size-7 shrink-0 place-items-center rounded-full border border-line text-ink-soft transition-transform duration-300 ${
                  open ? "rotate-45 border-accent text-accent" : ""
                }`}
              >
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${
                open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-5 sm:px-6 pb-5 text-sm leading-6 text-ink-soft">{faq.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
