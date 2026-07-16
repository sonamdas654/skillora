// Productized AI offers — specific, named systems instead of a vague
// "AI automation" bucket. Prices are GUIDE prices (like the rest of the site):
// the final quote is always confirmed in writing after the requirement review.
// The owner (Sonam Das) can tune any number in this one file.

export interface AiProduct {
  slug: string;
  name: string;
  tagline: string;
  idealFor: string;
  problem: string;
  workflow: string[];
  integrations: string[];
  setup: string;
  priceFrom: string;
  monthlyNote: string;
  humanFallback: string;
  icon: string;
}

export const aiProducts: AiProduct[] = [
  {
    slug: "whatsapp-lead-qualification",
    name: "WhatsApp Lead Qualification System",
    tagline: "Qualify new enquiries 24/7 and never lose a hot lead to a slow reply.",
    idealFor: "Businesses that get enquiries on WhatsApp but can't reply instantly.",
    problem: "New leads message at all hours, ask the same first questions, and go cold before anyone replies.",
    workflow: [
      "Greets the lead instantly and asks your qualifying questions",
      "Captures name, need, budget band and timeline into one place",
      "Flags hot leads and notifies you on WhatsApp / email",
      "Hands the conversation to you when it's ready to close",
    ],
    integrations: ["WhatsApp Business API", "Google Sheets / CRM", "Email / Telegram alerts"],
    setup: "7–14 days",
    priceFrom: "₹18,000",
    monthlyNote: "WhatsApp API + AI usage billed at cost (usually a few hundred ₹/month at low volume).",
    humanFallback: "Any conversation can be taken over by you at any moment — the bot never blocks a real person.",
    icon: "spark",
  },
  {
    slug: "support-knowledge-bot",
    name: "Customer Support Knowledge Bot",
    tagline: "Answer your most-asked questions instantly, on your site and WhatsApp.",
    idealFor: "Businesses answering the same FAQs (price, timings, policy) all day.",
    problem: "Your team burns hours repeating the same answers, and customers wait for basics.",
    workflow: [
      "Trained only on your real FAQs, policies and info",
      "Answers instantly on website + WhatsApp, in a natural tone",
      "Says \"let me connect you to a person\" when unsure — never guesses",
      "Shows you what people ask most, so you improve the answers",
    ],
    integrations: ["Website widget", "WhatsApp Business API", "Your FAQ / docs"],
    setup: "7–14 days",
    priceFrom: "₹20,000",
    monthlyNote: "AI usage billed at cost; hosting is minimal. No per-seat fees.",
    humanFallback: "Unsure questions are routed to a human instead of a made-up answer.",
    icon: "bot",
  },
  {
    slug: "invoice-document-processing",
    name: "Invoice & Document Processing",
    tagline: "Turn bills, receipts and forms into clean data — automatically.",
    idealFor: "Businesses hand-typing data from invoices, receipts or forms.",
    problem: "Someone manually reads documents and re-types them into Excel — slow and error-prone.",
    workflow: [
      "Reads uploaded invoices / receipts / forms",
      "Extracts the fields you care about (amount, date, vendor, GST…)",
      "Drops clean rows into Google Sheets / your system",
      "Flags anything unclear for a quick human check",
    ],
    integrations: ["Google Sheets / Excel", "Email inbox", "Your accounting export"],
    setup: "10–18 days",
    priceFrom: "₹25,000",
    monthlyNote: "AI processing billed at cost, scaled to your document volume.",
    humanFallback: "Low-confidence extractions are held for your review, not silently saved.",
    icon: "file",
  },
  {
    slug: "report-automation",
    name: "Excel / Google Sheets Report Automation",
    tagline: "Stop rebuilding the same report every week.",
    idealFor: "Owners and teams manually assembling weekly / monthly reports.",
    problem: "Hours go into copy-pasting exports into the same report, every single week.",
    workflow: [
      "Pulls your raw data on a schedule",
      "Builds the KPIs, tables and charts you actually use",
      "Delivers the finished report to email / WhatsApp automatically",
      "You spend the time reading it, not making it",
    ],
    integrations: ["Google Sheets / Excel", "Your data source", "Email / WhatsApp delivery"],
    setup: "5–12 days",
    priceFrom: "₹12,000",
    monthlyNote: "Runs on low-cost automation; usually no meaningful monthly fee at small scale.",
    humanFallback: "You approve the report format once; changes are a quick tweak, not a rebuild.",
    icon: "chart",
  },
  {
    slug: "appointment-reminders",
    name: "Appointment Reminder System",
    tagline: "Cut no-shows with automatic WhatsApp reminders.",
    idealFor: "Clinics, salons, tutors, consultants — anyone with booked appointments.",
    problem: "No-shows waste slots, and manually messaging every client is a chore.",
    workflow: [
      "Reads your appointment list",
      "Sends timely WhatsApp / SMS reminders before each slot",
      "Lets clients confirm or ask to reschedule",
      "Flags reschedules back to you",
    ],
    integrations: ["WhatsApp Business API / SMS", "Google Sheets / calendar"],
    setup: "5–10 days",
    priceFrom: "₹10,000",
    monthlyNote: "Message costs (WhatsApp/SMS) billed at cost, based on how many you send.",
    humanFallback: "Reschedule requests come to you — the system never silently moves a booking.",
    icon: "clock",
  },
  {
    slug: "email-followup",
    name: "AI Email Follow-up System",
    tagline: "Follow up with every lead — without forgetting or sounding like a robot.",
    idealFor: "Businesses that lose deals simply because no one followed up.",
    problem: "Leads slip through the cracks because follow-ups are manual and easy to forget.",
    workflow: [
      "Drafts personalised follow-ups based on the lead's context",
      "Sends on a sensible schedule until they reply",
      "Stops the moment they respond — no spammy chains",
      "Keeps you in the loop and lets you edit before send if you want",
    ],
    integrations: ["Your email / inbox", "Google Sheets / CRM"],
    setup: "7–12 days",
    priceFrom: "₹15,000",
    monthlyNote: "AI usage billed at cost; no per-email fees.",
    humanFallback: "You can require approval before anything is sent in your name.",
    icon: "arrow",
  },
];

export function getAiProduct(slug: string) {
  return aiProducts.find((p) => p.slug === slug);
}
