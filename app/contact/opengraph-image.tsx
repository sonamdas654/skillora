import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Tell us the requirement — Skilloura";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOgImage({
    eyebrow: "Contact",
    title: "Tell us the requirement",
    note: "A written scope before you pay anything",
  });
}
