"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TicketReplyForm({ ticketId }: { ticketId: string }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/client/tickets/${ticketId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setMessage("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <textarea
        required
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write a reply…"
        className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-soft/60 focus:border-accent focus:outline-none"
        maxLength={4000}
      />
      {error && <p className="text-sm font-medium text-red-500">{error}</p>}
      <button
        disabled={busy || message.trim().length < 2}
        className="rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-white hover:bg-accent-deep transition-colors disabled:opacity-60"
      >
        {busy ? "Sending…" : "Send reply"}
      </button>
    </form>
  );
}
