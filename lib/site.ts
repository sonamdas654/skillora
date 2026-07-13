export const site = {
  name: "Skilloura",
  domain: "skilloura.com",
  tagline: "Smart Digital Services, Delivered with Skill.",
  positioning:
    "I help businesses, creators and professionals build websites, apps, AI automation, designs, dashboards and digital systems with a clear requirement-based process.",
  email: "contact@skilloura.com",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "916370133101",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://skilloura.com",
  businessHours: "Mon–Sat, 10 AM – 7 PM IST",
  serviceArea: "India + global (fully remote)",
};

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${site.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const budgetRanges = [
  "Below ₹5,000",
  "₹5,000–₹10,000",
  "₹10,000–₹25,000",
  "₹25,000–₹50,000",
  "₹50,000+",
  "Custom budget",
];

export const projectStatusOptions = [
  "Just exploring",
  "Need quotation",
  "Ready to start",
  "Urgent project",
  "Need consultation first",
];

export const contactTimes = [
  "Morning (9 AM – 12 PM)",
  "Afternoon (12 PM – 4 PM)",
  "Evening (4 PM – 8 PM)",
  "Night (8 PM – 11 PM)",
  "Anytime",
];
