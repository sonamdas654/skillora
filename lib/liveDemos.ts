// Every reference-design concept (see lib/demoConcepts.ts) has a real,
// fully-explorable live demo at /demo/<id>. Concept ids are prefixed by
// service, so we resolve the service (and thus the demo) from the prefix.
const PREFIX_SERVICE: Record<string, string> = {
  web: "website-development",
  app: "mobile-app-development",
  ai: "ai-automation",
  brand: "logo-branding",
  vid: "video-editing",
  mkt: "digital-marketing",
  dash: "data-dashboard",
  cv: "resume-career",
  soft: "custom-software",
};

export function serviceOf(id: string): string | undefined {
  return PREFIX_SERVICE[id.split("-")[0]];
}

export function hasLiveDemo(id: string): boolean {
  return Boolean(serviceOf(id));
}
