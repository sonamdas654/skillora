import { WebPreview, DashboardPreview } from "./ConceptPreviews";

// Maps each portfolio concept to a real output mockup so cards show what
// the deliverable looks like instead of an empty gradient. Rendered inside
// a dark "screen" frame, scaled down to fit the card header.
const WEB_IDS: Record<string, string> = {
  "restaurant-website-concept": "web-restaurant",
  "gym-website-concept": "web-gym",
  "salon-website-concept": "web-salon",
  "ecommerce-concept": "web-ecommerce",
};

function ChatMockup({ accent }: { accent: string }) {
  return (
    <div className="flex-1 flex flex-col p-4 gap-2.5 text-left">
      <div className="flex items-center gap-2 rounded-lg bg-slate-900 border border-slate-800 px-3 py-2">
        <span className="size-5 rounded-full" style={{ background: accent }} />
        <div>
          <p className="text-[9px] font-black text-white leading-3">SupportGenie</p>
          <p className="text-[7px] text-emerald-400 font-semibold">● Online · replies instantly</p>
        </div>
      </div>
      <div className="space-y-2">
        <div className="max-w-[75%] rounded-xl rounded-tl-sm bg-slate-800 px-3 py-2">
          <p className="text-[8px] text-slate-200 leading-3.5">Hi! What are your store timings today?</p>
        </div>
        <div className="ml-auto max-w-[75%] rounded-xl rounded-tr-sm px-3 py-2" style={{ background: `${accent}33`, border: `1px solid ${accent}55` }}>
          <p className="text-[8px] text-white leading-3.5">We&apos;re open 10 AM – 9 PM. Want me to book a visit slot for you?</p>
        </div>
        <div className="max-w-[75%] rounded-xl rounded-tl-sm bg-slate-800 px-3 py-2">
          <p className="text-[8px] text-slate-200 leading-3.5">Yes, 6 PM please</p>
        </div>
        <div className="ml-auto max-w-[75%] rounded-xl rounded-tr-sm px-3 py-2" style={{ background: `${accent}33`, border: `1px solid ${accent}55` }}>
          <p className="text-[8px] text-white leading-3.5">Done ✓ 6 PM booked. Confirmation sent on WhatsApp.</p>
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5">
        <span className="text-[7px] text-emerald-300 font-semibold">✓ Trained on your business data</span>
        <span className="text-[7px] text-slate-500">24/7 auto-replies</span>
      </div>
    </div>
  );
}

export default function PortfolioMockup({ slug, accent }: { slug: string; accent: string }) {
  const webId = WEB_IDS[slug];
  return (
    <div className="relative h-44 overflow-hidden bg-slate-950">
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 border-b border-slate-800 bg-slate-900/80 px-3 py-1.5">
        <span className="size-1.5 rounded-full bg-red-400/70" />
        <span className="size-1.5 rounded-full bg-amber-400/70" />
        <span className="size-1.5 rounded-full bg-emerald-400/70" />
        <span className="ml-2 h-2.5 flex-1 max-w-[55%] rounded-full bg-slate-800" />
      </div>
      <div className="origin-top-left scale-[0.72]" style={{ width: "139%" }}>
        <div className="flex flex-col">
          {webId ? (
            <WebPreview id={webId} accent={accent} />
          ) : slug === "ai-chatbot-concept" ? (
            <ChatMockup accent={accent} />
          ) : (
            <DashboardPreview id="dash-sales" accent={accent} />
          )}
        </div>
      </div>
    </div>
  );
}
