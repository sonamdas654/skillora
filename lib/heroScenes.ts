// Typed access to the hero footage manifest that tools/video/encode.mjs
// writes. React never hardcodes a filename — filenames carry content hashes
// and change every time the footage is re-shot.
import manifest from "@/public/hero/manifest.json";

export interface HeroSource {
  src: string;
  bytes: number;
}

export interface HeroScene {
  id: string;
  /** Short human name, e.g. "Sales dashboard". */
  label: string;
  /**
   * Shown under the stage. Every scene is footage of a concept build, and the
   * caption is where that stays honest — the recording hides Skilloura's own
   * "Concept Project" banner because it is site chrome, not product.
   */
  caption: string;
  /** The route a visitor can open to see this for themselves. */
  route: string;
  serviceSlug: string;
  width: number;
  height: number;
  blurDataURL: string;
  poster: { webp: HeroSource; jpg: HeroSource };
  sources: {
    hd: { mp4: HeroSource; webm: HeroSource };
    md: { mp4: HeroSource; webm: HeroSource };
  };
}

export const heroScenes = manifest.scenes as unknown as HeroScene[];
export const heroBytesOnDisk: number = manifest.bytesOnDisk;
