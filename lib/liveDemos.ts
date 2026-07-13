// Concept ids (from lib/demoConcepts.ts) that have a real, fully-explorable
// live demo at /demo/<id>. Used by the Reference Design step to decide whether
// "Explore Design" opens the live demo (new tab) or the fallback preview.
export const LIVE_DEMOS: Record<string, string> = {
  "web-saas": "SaaS Landing Page",
  "web-ecommerce": "Modern E-Commerce Store",
  "web-local": "Local Business Hub",
  "web-portfolio": "Creator Portfolio & Agency",
  "web-realestate": "Real Estate Listings",
  "web-education": "Coaching Institute",
  "web-clinic": "Clinic & Doctor Appointment",
};

export function hasLiveDemo(id: string): boolean {
  return Object.prototype.hasOwnProperty.call(LIVE_DEMOS, id);
}
