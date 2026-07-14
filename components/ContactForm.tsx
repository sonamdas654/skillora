"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/track";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("sent");
      trackEvent("contact_form_submit");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-mint/30 bg-mint/10 p-8 text-center">
        <p className="text-lg font-bold text-ink">Message received ✓</p>
        <p className="mt-2 text-sm text-ink-soft">
          Thank you! I&apos;ll reply within 24 hours on your email or phone.
        </p>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-soft/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="mb-1.5 block text-sm font-semibold text-ink">
            Name <span className="text-red-500">*</span>
          </label>
          <input id="c-name" name="name" required className={inputCls} placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="c-email" className="mb-1.5 block text-sm font-semibold text-ink">
            Email <span className="text-red-500">*</span>
          </label>
          <input id="c-email" name="email" type="email" required className={inputCls} placeholder="you@example.com" />
        </div>
      </div>
      <div>
        <label htmlFor="c-phone" className="mb-1.5 block text-sm font-semibold text-ink">
          Phone / WhatsApp
        </label>
        <input id="c-phone" name="phone" className={inputCls} placeholder="+91 ..." />
      </div>
      <div>
        <label htmlFor="c-message" className="mb-1.5 block text-sm font-semibold text-ink">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="c-message"
          name="message"
          required
          rows={5}
          className={inputCls}
          placeholder="Describe your question or requirement in plain words..."
        />
      </div>
      {status === "error" && (
        <p className="text-sm font-medium text-red-500">
          Something went wrong. Please try again or contact via WhatsApp.
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-accent px-6 py-3.5 text-base font-semibold text-white hover:bg-accent-deep transition-colors disabled:opacity-60"
      >
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
