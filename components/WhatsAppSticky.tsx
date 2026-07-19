"use client";

import { useEffect, useState } from "react";
import { whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "./Header";

export default function WhatsAppSticky() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className={`fixed bottom-24 right-5 z-50 hidden lg:grid size-12 place-items-center rounded-full border border-line bg-white text-ink-soft shadow-[0_10px_24px_-10px_rgba(11,19,48,0.25)] transition-all duration-300 hover:text-accent hover:border-accent ${
          showTop ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-2"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
      <a
        href={whatsappLink("Hi! I want to discuss a project with Skilloura.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-5 right-5 z-50 hidden lg:grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.7)] hover:scale-110 transition-transform"
      >
        <WhatsAppIcon className="size-7" />
      </a>
    </>
  );
}
