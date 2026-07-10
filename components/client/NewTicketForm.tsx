"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const inputCls =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-soft/60 focus:border-accent focus:outline-none";

export default function NewTicketForm({
  presetSubject,
  presetMessage,
  buttonLabel = "Open ticket",
}: {
  presetSubject?: string;
  presetMessage?: string;
  buttonLabel?: string;
}) {
  const router = useRouter();
  const [subject, setSubject] = useState(presetSubject ?? "");
  const [message, setMessage] = useState(presetMessage ?? "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/client/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setDone(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-mint/25 bg-mint/5 p-5 text-sm font-medium text-ink">
        ✓ Ticket received — you&apos;ll get a reply here and by email, usually within 24 hours.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        required
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Subject — e.g. Change needed on contact page"
        className={inputCls}
        maxLength={150}
      />
      <textarea
        required
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Describe what you need…"
        className={inputCls}
        maxLength={4000}
      />
      {error && <p className="text-sm font-medium text-red-500">{error}</p>}
      <button
        disabled={busy}
        className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white hover:bg-accent-deep transition-colors disabled:opacity-60"
      >
        {busy ? "Sending…" : buttonLabel}
      </button>
    </form>
  );
}
