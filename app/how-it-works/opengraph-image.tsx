import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "From requirement to handover — Skilloura";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOgImage({
    eyebrow: "Process",
    title: "From requirement to handover",
    note: "Eight steps, nothing charged before it is agreed",
  });
}
