"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PaymentReferenceForm({ invoiceId }: { invoiceId: string }) {
  const router = useRouter();
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/client/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId, reference }),
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
        ✓ Reference received! We&apos;ll verify the payment (usually within a few hours) and
        you&apos;ll see it confirmed on your dashboard. Work proceeds as soon as it&apos;s verified.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <label htmlFor="reference" className="block text-sm font-semibold text-ink">
        After paying, enter your transaction / UTR reference
      </label>
      <input
        id="reference"
        required
        value={reference}
        onChange={(e) => setReference(e.target.value)}
        placeholder="e.g. 415023987654 (shown in your UPI app after payment)"
        className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-soft/60 focus:border-accent focus:outline-none"
      />
      {error && <p className="text-sm font-medium text-red-500">{error}</p>}
      <button
        disabled={busy || reference.trim().length < 4}
        className="w-full rounded-full bg-accent px-6 py-3 text-sm font-bold text-white hover:bg-accent-deep transition-colors disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {busy ? "Submitting…" : "I've paid — submit reference"}
      </button>
    </form>
  );
}
