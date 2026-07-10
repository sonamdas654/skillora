"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface MessageView {
  id: string;
  sender: string;
  message: string;
  date: string;
}

interface TicketView {
  id: string;
  email: string;
  subject: string;
  status: string;
  updatedAt: string;
  clientName: string | null;
  messages: MessageView[];
}

const statusStyle: Record<string, string> = {
  Open: "bg-amber-50 text-amber-600",
  Replied: "bg-accent-soft text-accent",
  Closed: "bg-black/[0.05] text-ink-soft",
};

export default function TicketsManager({ tickets }: { tickets: TicketView[] }) {
  const router = useRouter();
  const [openId, setOpenId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function sendReply(id: string) {
    setBusy(true);
    setError("");
    const res = await fetch(`/api/admin/tickets/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: reply }),
    });
    setBusy(false);
    if (res.ok) {
      setReply("");
      router.refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "Reply failed");
    }
  }

  async function setStatus(id: string, status: string) {
    await fetch(`/api/admin/tickets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Support tickets</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Replies go to the client&apos;s portal and email instantly.
      </p>

      {tickets.length === 0 && (
        <p className="mt-6 rounded-2xl border border-line bg-white p-8 text-center text-sm text-ink-soft">
          No tickets yet.
        </p>
      )}

      <div className="mt-6 space-y-3">
        {tickets.map((t) => (
          <div key={t.id} className="rounded-2xl border border-line bg-white">
            <button
              onClick={() => setOpenId(openId === t.id ? null : t.id)}
              className="flex w-full flex-wrap items-center justify-between gap-2 px-5 py-4 text-left"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-ink">{t.subject}</span>
                <span className="text-xs text-ink-soft">
                  {t.clientName || t.email} · updated{" "}
                  {new Date(t.updatedAt).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </span>
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${statusStyle[t.status] ?? statusStyle.Open}`}
              >
                {t.status}
              </span>
            </button>

            {openId === t.id && (
              <div className="border-t border-line px-5 py-4">
                <div className="space-y-2.5">
                  {t.messages.map((m) => (
                    <div
                      key={m.id}
                      className={`max-w-[85%] rounded-xl px-3.5 py-2.5 ${
                        m.sender === "admin"
                          ? "ml-auto rounded-tr-sm bg-accent-soft"
                          : "rounded-tl-sm border border-line bg-background"
                      }`}
                    >
                      <p className="text-[11px] font-bold text-ink-soft">
                        {m.sender === "admin" ? "You" : t.clientName || "Client"} ·{" "}
                        {new Date(m.date).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="mt-0.5 whitespace-pre-line text-sm text-ink">{m.message}</p>
                    </div>
                  ))}
                </div>

                {t.status !== "Closed" && (
                  <div className="mt-4 space-y-2">
                    <textarea
                      rows={3}
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Write a reply…"
                      className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink focus:border-accent focus:outline-none"
                    />
                    {error && <p className="text-sm font-medium text-red-500">{error}</p>}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => sendReply(t.id)}
                        disabled={busy || reply.trim().length < 2}
                        className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
                      >
                        {busy ? "Sending…" : "Send reply"}
                      </button>
                      <button
                        onClick={() => setStatus(t.id, "Closed")}
                        className="rounded-full border border-line px-5 py-2 text-sm font-semibold text-ink-soft hover:border-red-300 hover:text-red-500"
                      >
                        Close ticket
                      </button>
                    </div>
                  </div>
                )}
                {t.status === "Closed" && (
                  <button
                    onClick={() => setStatus(t.id, "Open")}
                    className="mt-4 rounded-full border border-line px-5 py-2 text-sm font-semibold text-ink-soft hover:border-accent hover:text-accent"
                  >
                    Reopen ticket
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
