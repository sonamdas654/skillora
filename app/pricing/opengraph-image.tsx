import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Transparent guide prices — Skilloura";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOgImage({
    eyebrow: "Pricing",
    title: "Transparent guide prices",
    note: "Final quote after scope review, always in writing",
  });
}
