"use client";

import { useState, useRef, useEffect } from "react";

type Msg = { from: "bot" | "user"; text: string };

// Rule-based canned replies — a concept of an AI FAQ agent.
function reply(q: string): string {
  const t = q.toLowerCase();
  if (/price|cost|charge|fee|rate/.test(t)) return "Our plans start at ₹1,499/month. Want me to share the full price list or connect you to the team?";
  if (/hour|open|time|timing/.test(t)) return "We're open Mon–Sat, 10 AM to 8 PM. Sundays we run on appointment only. 🕙";
  if (/location|address|where|reach/.test(t)) return "We're at 12 MG Road, near Metro Gate 2. I can send you a Google Maps link — shall I?";
  if (/human|agent|call|talk|person/.test(t)) return "Sure — connecting you to a team member now. Meanwhile, can I take your name & number? 🙋";
  if (/book|appointment|slot|order/.test(t)) return "Great! I can book that for you. Which day and time works best?";
  if (/hello|hi|hey|namaste/.test(t)) return "Hi there! 👋 I'm SupportGenie. Ask me about pricing, timings, location or booking.";
  return "Good question! I've noted it and a team member will follow up. Meanwhile, you can ask me about pricing, timings, location or booking.";
}

const QUICK = ["What are your prices?", "Are you open now?", "Where are you located?", "Talk to a human"];

export default function ChatbotDemo() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "bot", text: "Hi there! 👋 I'm SupportGenie, the AI assistant. Ask me anything — pricing, timings, location or booking." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);

  const send = (text: string) => {
    const q = text.trim();
    if (!q) return;
    setMsgs((m) => [...m, { from: "user", text: q }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { from: "bot", text: reply(q) }]);
    }, 700);
  };

  return (
    <div className="bg-slate-950 text-slate-100 [font-family:system-ui,sans-serif]">
      <header className="sticky top-[41px] z-40 border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <span className="text-lg font-black tracking-tight text-blue-400">Support<span className="text-white">Genie</span></span>
          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-400">● Online 24/7</span>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(60% 60% at 30% 0%, rgba(40,87,255,0.3), transparent 60%)" }} />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">AI Support Agent</p>
            <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">
              Answer every customer, <span className="text-blue-400">instantly</span> — even at 2 AM.
            </h1>
            <p className="mt-4 max-w-md text-slate-400">
              Trained on your FAQs, SupportGenie replies on your website and WhatsApp, captures leads and hands complex chats to a human.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-slate-300">
              <li>✓ 24/7 instant replies</li>
              <li>✓ WhatsApp + website</li>
              <li>✓ Lead capture &amp; human handover</li>
              <li>✓ Learns from your own content</li>
            </ul>
            <p className="mt-6 text-xs text-slate-500">👉 Try it live — type or tap a question on the right.</p>
          </div>

          {/* Live chat */}
          <div className="mx-auto flex h-[480px] w-full max-w-sm flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-white/10 bg-slate-800/60 px-4 py-3">
              <span className="grid size-9 place-items-center rounded-full bg-blue-500 text-lg">🤖</span>
              <div>
                <p className="text-sm font-bold">SupportGenie</p>
                <p className="text-[11px] text-emerald-400">● Typically replies instantly</p>
              </div>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${m.from === "user" ? "rounded-br-sm bg-blue-600 text-white" : "rounded-bl-sm bg-slate-800 text-slate-100"}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-sm bg-slate-800 px-4 py-3 text-sm">
                    <span className="inline-flex gap-1">
                      <span className="size-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
                      <span className="size-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
                      <span className="size-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
                    </span>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
            <div className="border-t border-white/10 p-3">
              <div className="mb-2 flex flex-wrap gap-1.5">
                {QUICK.map((q) => (
                  <button key={q} onClick={() => send(q)} className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] text-slate-300 hover:bg-white/5">{q}</button>
                ))}
              </div>
              <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2">
                <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message…" className="flex-1 rounded-full bg-slate-800 px-4 py-2.5 text-sm outline-none placeholder:text-slate-500" />
                <button type="submit" className="grid size-10 place-items-center rounded-full bg-blue-600 text-white">➤</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-500">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-lg font-black text-blue-400">SupportGenie</span>
          <span>© {new Date().getFullYear()} SupportGenie (concept). Built by Skilloura.</span>
        </div>
      </footer>
    </div>
  );
}
