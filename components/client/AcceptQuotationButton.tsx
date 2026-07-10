"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AcceptQuotationButton({ quotationId }: { quotationId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);

  async function accept() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/client/quotations/${quotationId}/accept`, { method: "POST" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
      setConfirming(false);
    }
  }

  if (!confirming) {
    return (
      <div>
        <button
          onClick={() => setConfirming(true)}
          className="w-full rounded-full bg-mint px-6 py-3.5 text-base font-bold text-white shadow-[0_12px_26px_-12px_rgba(16,185,129,0.8)] hover:brightness-105 transition-all sm:w-auto"
        >
          Accept this quotation
        </button>
        {error && <p className="mt-2 text-sm font-medium text-red-500">{error}</p>}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-mint/25 bg-mint/5 p-4">
      <p className="text-sm font-medium text-ink">
        Accepting confirms the scope and price above. Work starts after the advance payment.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={accept}
          disabled={busy}
          className="rounded-full bg-mint px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
        >
          {busy ? "Confirming…" : "Yes, I accept"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={busy}
          className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink-soft"
        >
          Not yet
        </button>
      </div>
      {error && <p className="mt-2 text-sm font-medium text-red-500">{error}</p>}
    </div>
  );
}
