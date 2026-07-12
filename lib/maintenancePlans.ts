// Monthly maintenance plans — shown on /pricing and in the client portal.
//
// Pricing psychology (real-world SaaS/agency ladder):
//  • Basic Care ₹1,999 is a low-friction ENTRY HOOK — an easy "yes" that
//    turns one-time projects into recurring revenue and long retention.
//  • Growth Care is the HIGHLIGHTED centre tier (center-stage / compromise
//    effect) — most clients land here, and it's priced to be the smart pick.
//  • Elite Care sits high as a value ANCHOR, making Growth & Pro feel like
//    obvious value.
//  • Each tier reads "Everything in <lower> +" so the value ladder is clear.
export const maintenancePlans = [
  {
    name: "Basic Care",
    price: "₹1,999",
    period: "/month",
    features: [
      "Uptime monitoring",
      "Monthly backup",
      "Security & plugin updates",
      "1 small content edit / month",
    ],
  },
  {
    name: "Growth Care",
    price: "₹4,999",
    period: "/month",
    features: [
      "Everything in Basic Care",
      "4 content edits / month",
      "Monthly speed & health check",
      "Bug fixing",
      "Priority WhatsApp support",
    ],
    highlighted: true,
  },
  {
    name: "Pro Care",
    price: "₹8,999",
    period: "/month",
    features: [
      "Everything in Growth Care",
      "SEO upkeep",
      "Feature improvements",
      "Automation monitoring",
      "Monthly performance report",
    ],
  },
  {
    name: "Elite Care",
    price: "₹15,999",
    period: "/month",
    features: [
      "Everything in Pro Care",
      "Unlimited small edits",
      "Dedicated priority support",
      "Conversion & A/B tweaks",
      "Quarterly strategy call",
    ],
  },
];
