"use client";

import { useState } from "react";
import WhatsAppIcon from "./icons/WhatsAppIcon";

// Lightweight share row for blog posts — no tracking scripts, just intent URLs.
export default function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  const linkCls =
    "inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-raised px-4 py-2 text-xs font-semibold text-ink-soft transition-colors hover:border-accent hover:text-accent";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-body-sm font-bold uppercase tracking-wider text-ink-soft">Share:</span>
      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={linkCls}
      >
        <WhatsAppIcon className="size-3.5 text-success" /> WhatsApp
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={linkCls}
      >
        LinkedIn
      </a>
      <a
        href={`https://x.com/intent/post?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={linkCls}
      >
        X / Twitter
      </a>
      <button type="button" onClick={copy} className={linkCls}>
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}
