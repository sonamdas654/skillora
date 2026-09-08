// What the homepage's "what we build" band shows, and where each picture
// comes from.
//
// Every image here is a screenshot of a real, openable page in this repo —
// four of them are the posters the hero carousel already loads (so they cost
// nothing extra on the wire), and three are stills captured by
// tools/video/posters.mjs from demos that were never filmed.
//
// Nothing is stock and nothing is a mockup of software that does not exist.
// If a demo changes, re-run the capture and the band follows; no filename is
// ever written into a component.
import { heroScenes } from "@/lib/heroScenes";
import stillManifest from "@/public/build/manifest.json";
import { serviceCategories } from "@/lib/services";

interface Still {
  id: string;
  route: string;
  serviceSlug: string;
  width: number;
  height: number;
  webp: { src: string; bytes: number };
  jpg: { src: string; bytes: number };
}

const stills = stillManifest.stills as Still[];

export interface BuildTile {
  slug: string;
  /** Service name, straight from lib/services.ts — never a second copy. */
  name: string;
  outcome: string;
  startingPrice: string;
  /** The page a visitor can open to see this build working. */
  demoRoute: string;
  image: { src: string; width: number; height: number };
  /** Only the hero posters carry one; the stills are lazy and below the fold. */
  blurDataURL?: string;
}

/**
 * Order is commercial, not alphabetical: the flagship website build leads and
 * renders wide, then the rest by what people actually ask for.
 */
const ORDER = [
  "website-development",
  "mobile-app-development",
  "ai-automation",
  "data-dashboard",
  "custom-software",
  "logo-branding",
  "digital-marketing",
];

function pictureFor(slug: string) {
  // A filmed scene wins — it is the same asset the hero already downloaded.
  const scene = heroScenes.find((s) => s.serviceSlug === slug);
  if (scene) {
    return {
      demoRoute: scene.route,
      image: { src: scene.poster.webp.src, width: scene.width, height: scene.height },
      blurDataURL: scene.blurDataURL,
    };
  }
  const still = stills.find((s) => s.serviceSlug === slug);
  if (still) {
    return {
      demoRoute: still.route,
      image: { src: still.webp.src, width: still.width, height: still.height },
    };
  }
  return null;
}

/**
 * Built at module scope, so a service that loses its picture is a build-time
 * failure rather than a silently missing card on the homepage.
 */
export const buildTiles: BuildTile[] = ORDER.map((slug) => {
  const service = serviceCategories.find((s) => s.slug === slug);
  if (!service) throw new Error(`buildShowcase: no service named ${slug}`);
  const picture = pictureFor(slug);
  if (!picture) throw new Error(`buildShowcase: no picture for ${slug}`);
  return {
    slug,
    name: service.name,
    outcome: service.outcome,
    startingPrice: service.startingPrice,
    ...picture,
  };
});
