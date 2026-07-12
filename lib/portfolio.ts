// Demo/concept projects — honestly labeled. Replace with real client work
// (with permission) as projects complete. No fake clients, no fake results.
export interface PortfolioItem {
  slug: string;
  title: string;
  industry: string;
  category: string;
  problem: string;
  solution: string;
  features: string[];
  technology: string;
  isDemo: boolean;
  accent: string;
  icon: string;
  // Enriched fields (concept builds only — DB items may omit these)
  demoType?: "restaurant" | "gym" | "salon" | "ecommerce" | "chatbot" | "dashboard";
  serviceSlug?: string;
  tools?: string[];
  timeline?: string;
  priceRange?: string;
  clientProvides?: string[];
}

export const portfolioItems: PortfolioItem[] = [
  {
    slug: "restaurant-website-concept",
    title: "Spice Route — Restaurant Website",
    industry: "Restaurant / Food",
    category: "Website Development",
    problem: "Restaurants lose orders when customers can't see the menu or contact them online.",
    solution:
      "A mobile-first restaurant website concept with digital menu, gallery, Google Maps, table booking and a WhatsApp order button.",
    features: ["Digital menu", "Table booking", "WhatsApp ordering", "Google Maps", "Photo gallery"],
    technology: "Next.js, Tailwind CSS",
    isDemo: true,
    accent: "#ff6b35",
    icon: "globe",
    demoType: "restaurant",
    serviceSlug: "website-development",
    tools: ["Next.js", "Tailwind CSS", "WhatsApp API", "Google Maps"],
    timeline: "5–8 days",
    priceRange: "₹12,000–₹25,000",
    clientProvides: ["Menu items & prices", "Food/interior photos", "Logo (if any)", "Address & contact"],
  },
  {
    slug: "gym-website-concept",
    title: "IronCore — Gym Website",
    industry: "Fitness",
    category: "Website Development",
    problem: "Gyms rely on walk-ins because their plans, trainers and timings aren't visible online.",
    solution:
      "A high-energy gym website concept with membership plans, trainer profiles, class schedule and lead capture form.",
    features: ["Membership plans", "Class schedule", "Trainer profiles", "Lead form", "BMI calculator"],
    technology: "Next.js, Tailwind CSS",
    isDemo: true,
    accent: "#e11d48",
    icon: "shield",
    demoType: "gym",
    serviceSlug: "website-development",
    tools: ["Next.js", "Tailwind CSS", "Lead form", "WhatsApp API"],
    timeline: "5–8 days",
    priceRange: "₹12,000–₹22,000",
    clientProvides: ["Membership plans & prices", "Trainer photos & bios", "Class timings", "Logo (if any)"],
  },
  {
    slug: "salon-website-concept",
    title: "Luxe Salon — Booking Website",
    industry: "Beauty / Salon",
    category: "Website Development",
    problem: "Salons miss bookings when clients can't see services, prices or available slots.",
    solution:
      "An elegant salon website concept with service menu, price list, online appointment booking and Instagram gallery.",
    features: ["Service menu", "Online booking", "Price list", "Instagram feed", "WhatsApp button"],
    technology: "Next.js, Tailwind CSS",
    isDemo: true,
    accent: "#a855f7",
    icon: "palette",
    demoType: "salon",
    serviceSlug: "website-development",
    tools: ["Next.js", "Tailwind CSS", "Booking form", "Instagram embed"],
    timeline: "4–7 days",
    priceRange: "₹10,000–₹20,000",
    clientProvides: ["Service list & prices", "Salon photos", "Working hours", "Instagram handle"],
  },
  {
    slug: "ecommerce-concept",
    title: "CraftKart — Ecommerce Store",
    industry: "Ecommerce / Retail",
    category: "Website Development",
    problem: "Small sellers depend fully on marketplaces and lose margin on every sale.",
    solution:
      "An ecommerce store concept with product catalog, cart, secure checkout, order tracking and an admin panel for inventory.",
    features: ["Product catalog", "Cart & checkout", "Payment gateway", "Order tracking", "Admin panel"],
    technology: "Next.js, Razorpay, PostgreSQL",
    isDemo: true,
    accent: "#0fbf8f",
    icon: "chart",
    demoType: "ecommerce",
    serviceSlug: "website-development",
    tools: ["Next.js", "Razorpay", "PostgreSQL", "Admin panel"],
    timeline: "12–20 days",
    priceRange: "₹28,000–₹60,000",
    clientProvides: ["Product photos & details", "Pricing & stock", "Payment/UPI details", "Logo & brand colours"],
  },
  {
    slug: "ai-chatbot-concept",
    title: "SupportGenie — AI Support Chatbot",
    industry: "Customer Support",
    category: "AI & Automation",
    problem: "Businesses answer the same customer questions manually, all day, every day.",
    solution:
      "An AI chatbot concept trained on business FAQs that answers customers 24/7 on website and WhatsApp, and hands over complex queries to a human.",
    features: ["24/7 auto replies", "WhatsApp integration", "Human handover", "Lead capture", "Analytics"],
    technology: "Claude API, Node.js, WhatsApp API",
    isDemo: true,
    accent: "#2857ff",
    icon: "bot",
    demoType: "chatbot",
    serviceSlug: "ai-automation",
    tools: ["Claude API", "Node.js", "WhatsApp API"],
    timeline: "7–14 days",
    priceRange: "₹15,000–₹40,000",
    clientProvides: ["Common questions & answers", "Business info & policies", "WhatsApp number", "Handover contact"],
  },
  {
    slug: "sales-dashboard-concept",
    title: "PulseBoard — Sales Dashboard",
    industry: "Business Analytics",
    category: "Data & Dashboards",
    problem: "Owners make decisions from messy Excel sheets with no clear view of sales trends.",
    solution:
      "A Power BI dashboard concept that turns raw sales exports into live KPIs — revenue, top products, regions and monthly trends.",
    features: ["Live KPIs", "Trend charts", "Top products", "Region breakdown", "Auto refresh"],
    technology: "Power BI, Excel, SQL",
    isDemo: true,
    accent: "#f59e0b",
    icon: "chart",
    demoType: "dashboard",
    serviceSlug: "data-dashboard",
    tools: ["Power BI", "Excel", "SQL"],
    timeline: "5–10 days",
    priceRange: "₹8,000–₹25,000",
    clientProvides: ["Sales/Excel data export", "KPIs you care about", "Access to data source"],
  },
];

// Concept demo slugs that have a live, explorable demo page at /portfolio/<slug>.
export function getConceptBySlug(slug: string) {
  return portfolioItems.find((p) => p.slug === slug && p.isDemo);
}
