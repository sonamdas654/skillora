import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Founder-led, built to a written scope — Skilloura";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOgImage({
    eyebrow: "About",
    title: "Founder-led, built to a written scope",
    note: "Sonam Das, Odisha",
  });
}
