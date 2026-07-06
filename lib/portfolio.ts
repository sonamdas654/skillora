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
}

export const portfolioItems: PortfolioItem[] = [
  {
    slug: "restaurant-website-demo",
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
  },
  {
    slug: "gym-website-demo",
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
  },
  {
    slug: "salon-website-demo",
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
  },
  {
    slug: "ecommerce-demo",
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
  },
  {
    slug: "ai-chatbot-demo",
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
  },
  {
    slug: "sales-dashboard-demo",
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
  },
];
