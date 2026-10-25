import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Websites, AI systems and the work around them — Skilloura";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOgImage({
    eyebrow: "Services",
    title: "Websites, AI systems and the work around them",
    note: "Nine services, one clear process",
  });
}
