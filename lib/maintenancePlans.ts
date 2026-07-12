// Monthly maintenance plans — shown on /pricing and in the client portal.
//
// Pricing psychology (real-world SaaS/agency ladder):
//  • Basic Care ₹1,999 is a low-friction ENTRY plan — an easy "yes" for
//    small/local clients that turns one-time projects into recurring revenue.
//  • Business Care is the HIGHLIGHTED centre tier (center-stage / compromise
//    effect) — most clients land here, and it's priced to be the smart pick.
//  • Growth Care sits higher as a value ANCHOR for serious, scaling clients.
//  • Each higher tier reads "Everything in <lower> +" so the ladder is clear.
export const maintenancePlans = [
  {
    name: "Basic Care",
    price: "₹1,999",
    period: "/month",
    features: [
      "Minor text & image updates",
      "Monthly backup",
      "Uptime monitoring",
    ],
  },
  {
    name: "Business Care",
    price: "₹4,999",
    period: "/month",
    features: [
      "Everything in Basic Care",
      "Content & feature updates",
      "Bug fixing",
      "Monthly performance report",
      "Speed & health check",
    ],
    highlighted: true,
  },
  {
    name: "Growth Care",
    price: "₹9,999",
    period: "/month",
    features: [
      "Everything in Business Care",
      "SEO support",
      "Analytics review",
      "Ongoing improvements",
      "Priority support",
    ],
  },
];
