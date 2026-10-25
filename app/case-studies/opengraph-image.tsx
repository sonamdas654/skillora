import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "How these were actually built — Skilloura";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOgImage({
    eyebrow: "Case studies",
    title: "How these were actually built",
    note: "Decisions, trade-offs and what we would change",
  });
}
