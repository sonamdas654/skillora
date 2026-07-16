// Niche, buyer-intent "solution" landing pages (e.g. "Website for restaurants").
// Each is genuinely distinct and useful — NOT a mass-generated city/keyword page.
// Everything here is real: pricing/timelines match the owner-set concept demos
// in lib/portfolio.ts, and each page cross-links to the actual live demo and
// the matching cost-guide blog post. No invented clients or results.

export interface Solution {
  slug: string;
  audience: string; // e.g. "Restaurants & cafés"
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  serviceSlug: string; // maps to lib/services.ts
  demoPath?: string; // a real, explorable concept demo
  demoLabel?: string;
  blogSlug?: string; // a real cost/guide blog post
  priceFrom: string;
  timeline: string;
  problem: string[];
  included: string[];
  clientProvides: string[];
  faqs: { q: string; a: string }[];
}

export const solutions: Solution[] = [
  {
    slug: "restaurant-website",
    audience: "Restaurants & cafés",
    metaTitle: "Restaurant Website Development in India — Menu, Booking & WhatsApp Orders",
    metaDescription:
      "A mobile-first restaurant website with a digital menu, table booking, WhatsApp ordering and Google Maps — so you get direct, commission-free orders. Guide price from ₹12,000.",
    h1: "Restaurant websites that bring direct, commission-free orders",
    intro:
      "Aggregators take 18–30% on every order and own your customer. A clean restaurant website gives you a 24/7 menu, direct WhatsApp orders and Google Maps visibility — you keep the margin and the relationship.",
    serviceSlug: "website-development",
    demoPath: "/portfolio/restaurant-website-concept",
    demoLabel: "Explore a live restaurant demo",
    blogSlug: "restaurant-website-cost-india",
    priceFrom: "₹12,000",
    timeline: "5–8 days",
    problem: [
      "Customers can't see your menu or prices before deciding — so they scroll past.",
      "Every aggregator order costs you commission and hides who your customer is.",
      "Walk-ins struggle to find accurate timings, location and contact.",
    ],
    included: [
      "Mobile-first digital menu that's easy to update",
      "WhatsApp order button — direct, zero-commission orders",
      "Table / callback booking form",
      "Google Maps, timings and one-tap call",
      "Photo gallery to sell the ambience",
    ],
    clientProvides: ["Menu items & prices", "Food / interior photos", "Logo (if any)", "Address & contact details"],
    faqs: [
      {
        q: "Do I still need Zomato or Swiggy if I have a website?",
        a: "Aggregators are great for discovery, but you pay commission on every order. Your website gives you direct, commission-free orders from repeat customers. Most restaurants use both — website for regulars, aggregators for reach.",
      },
      {
        q: "How do customers order from the website?",
        a: "A WhatsApp order button lets them order directly with zero commission. If you want, we can add a full online cart with online payments later.",
      },
      {
        q: "Can I update the menu myself?",
        a: "Yes — the menu is built to be easy to edit, and we hand over clear instructions (or a short training video) at delivery.",
      },
    ],
  },
  {
    slug: "gym-website",
    audience: "Gyms & fitness studios",
    metaTitle: "Gym & Fitness Website Development in India — Plans, Trainers & Lead Capture",
    metaDescription:
      "A high-energy gym website with membership plans, class schedule, trainer profiles and a lead form — so people join instead of just walking past. Guide price from ₹12,000.",
    h1: "Gym websites that turn visitors into memberships",
    intro:
      "Most gyms rely on walk-ins because their plans, trainers and timings aren't visible online. A focused gym website shows all of that and captures leads while you train.",
    serviceSlug: "website-development",
    demoPath: "/portfolio/gym-website-concept",
    demoLabel: "Explore a live gym demo",
    blogSlug: "gym-website-cost-india",
    priceFrom: "₹12,000",
    timeline: "5–8 days",
    problem: [
      "Prospects can't see membership plans or prices without visiting.",
      "Trainers and class timings aren't visible, so trust is low.",
      "No way to capture a lead when someone is interested at 11 pm.",
    ],
    included: [
      "Membership plans with clear pricing",
      "Class schedule and trainer profiles",
      "Lead-capture form (with WhatsApp follow-up)",
      "Optional BMI calculator to pull people in",
      "Photo/video gallery of the space",
    ],
    clientProvides: ["Membership plans & prices", "Trainer photos & bios", "Class timings", "Logo (if any)"],
    faqs: [
      {
        q: "Can leads come straight to my WhatsApp?",
        a: "Yes — the lead form can notify you on WhatsApp and email the moment someone submits, so you can follow up fast.",
      },
      {
        q: "Can members book classes online later?",
        a: "We can start with a schedule + lead form and add online class booking or payments as a later phase when you're ready.",
      },
    ],
  },
  {
    slug: "salon-booking-website",
    audience: "Salons & spas",
    metaTitle: "Salon Booking Website in India — Services, Prices & Online Appointments",
    metaDescription:
      "An elegant salon website with a service menu, price list, online appointment booking and Instagram gallery — so clients book instead of calling. Guide price from ₹10,000.",
    h1: "Salon websites that fill your appointment book",
    intro:
      "Salons miss bookings when clients can't see services, prices or open slots. A clean, elegant salon website lets people browse and book any time — and shows off your work.",
    serviceSlug: "website-development",
    demoPath: "/portfolio/salon-website-concept",
    demoLabel: "Explore a live salon demo",
    blogSlug: "salon-booking-website-india",
    priceFrom: "₹10,000",
    timeline: "4–7 days",
    problem: [
      "Clients can't see the service list or prices before booking.",
      "Bookings rely on phone calls that get missed during appointments.",
      "Your best work lives on Instagram but never converts to a booking.",
    ],
    included: [
      "Service menu with a clear price list",
      "Online appointment / callback booking",
      "Instagram feed to showcase your work",
      "WhatsApp booking button",
      "Working hours, location and contact",
    ],
    clientProvides: ["Service list & prices", "Salon photos", "Working hours", "Instagram handle"],
    faqs: [
      {
        q: "Do clients need an app to book?",
        a: "No — booking works straight from the website on any phone, and can send the request to your WhatsApp so you stay in control of the calendar.",
      },
      {
        q: "Can I show my Instagram automatically?",
        a: "Yes — we can embed your Instagram so new posts appear on the site without extra work.",
      },
    ],
  },
  {
    slug: "whatsapp-automation",
    audience: "Local businesses & service providers",
    metaTitle: "WhatsApp Automation for Local Businesses in India — Auto-Replies & Lead Capture",
    metaDescription:
      "An AI-assisted WhatsApp system that answers common questions 24/7, captures leads and hands complex chats to a human. Honest setup and running costs. Guide price from ₹15,000.",
    h1: "WhatsApp automation that answers customers 24/7 — with a human in the loop",
    intro:
      "You answer the same WhatsApp questions all day. A well-built WhatsApp assistant handles the repetitive ones instantly, captures the lead's details, and hands the tricky conversations to you — so nothing is missed and nothing feels robotic.",
    serviceSlug: "ai-automation",
    demoPath: "/portfolio/ai-chatbot-concept",
    demoLabel: "See an AI support-bot concept",
    blogSlug: "whatsapp-automation-for-small-business",
    priceFrom: "₹15,000",
    timeline: "7–14 days",
    problem: [
      "The same questions (price, timings, availability) eat hours every day.",
      "Leads message after hours and go cold before you reply.",
      "Generic bots feel robotic and frustrate real customers.",
    ],
    included: [
      "24/7 auto-replies trained on your real FAQs",
      "Lead capture (name, need, contact) into one place",
      "Clean hand-over to a human for complex chats",
      "WhatsApp integration and basic analytics",
      "Documented setup so you understand exactly how it works",
    ],
    clientProvides: ["Your common questions & answers", "Business info & policies", "WhatsApp number", "A human contact for handovers"],
    faqs: [
      {
        q: "Will it feel like a robot?",
        a: "No — it's built around your real answers and hands over to a human the moment a conversation needs judgement. The goal is faster replies, not a wall between you and your customer.",
      },
      {
        q: "Are there monthly running costs?",
        a: "Yes — the WhatsApp Business API and any AI usage have their own recurring costs, which are separate from the build and always shown to you up front. We keep them as low as your volume allows.",
      },
      {
        q: "Is my customer data safe?",
        a: "Your data isn't sold or used to train AI models. See our Data & File Security page for exactly how information is stored and who can access it.",
      },
    ],
  },
];

export function getSolution(slug: string) {
  return solutions.find((s) => s.slug === slug);
}
