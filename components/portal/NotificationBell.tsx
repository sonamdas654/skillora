"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Notif = {
  id: string;
  title: string;
  body: string | null;
  link: string | null;
  is_read: boolean;
  created_at: string;
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notif[]>([]);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const supabase = useRef(createClient()).current;

  async function load() {
    const { data } = await supabase
      .from("notifications")
      .select("id, title, body, link, is_read, created_at")
      .order("created_at", { ascending: false })
      .limit(20);
    setItems(data ?? []);
    setLoaded(true);
  }

  useEffect(() => {
    load();
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const unread = items.filter((n) => !n.is_read).length;

  async function markRead(n: Notif) {
    if (!n.is_read) {
      setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, is_read: true } : x)));
      await supabase.from("notifications").update({ is_read: true }).eq("id", n.id);
    }
  }

  async function markAllRead() {
    setItems((prev) => prev.map((x) => ({ ...x, is_read: true })));
    await supabase.from("notifications").update({ is_read: true }).eq("is_read", false);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => {
          setOpen((v) => !v);
          if (!loaded) load();
        }}
        className="relative grid size-9 place-items-center rounded-full border border-line bg-white text-ink hover:border-accent hover:text-accent"
        aria-label="Notifications"
      >
        🔔
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 max-w-[90vw] rounded-2xl border border-line bg-white p-2 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.35)]">
          <div className="flex items-center justify-between px-2 py-1.5">
            <p className="text-sm font-bold text-ink">Notifications</p>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-xs font-semibold text-accent hover:underline">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-2 py-6 text-center text-sm text-ink-soft">No notifications yet.</p>
            ) : (
              items.map((n) => (
                <Link
                  key={n.id}
                  href={n.link || "#"}
                  onClick={() => markRead(n)}
                  className={`block rounded-xl px-3 py-2.5 text-sm hover:bg-background ${!n.is_read ? "bg-accent-soft/50" : ""}`}
                >
                  <p className="font-semibold text-ink">{n.title}</p>
                  {n.body && <p className="mt-0.5 line-clamp-2 text-xs text-ink-soft">{n.body}</p>}
                  <p className="mt-1 text-[11px] text-ink-soft">
                    {new Date(n.created_at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
