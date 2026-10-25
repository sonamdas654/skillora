import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { serviceCategories } from "@/lib/services";

export const alt = "Skilloura service";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// Nine service pages, nine different cards. Name, outcome and price all come
// from lib/services.ts, the same source the page itself reads, so a card can
// never advertise a price the page does not show.
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = serviceCategories.find((s) => s.slug === slug);

  return renderOgImage({
    eyebrow: "Service",
    title: service?.name ?? "Digital services",
    note: service ? `${service.outcome} · From ${service.startingPrice}` : undefined,
  });
}
