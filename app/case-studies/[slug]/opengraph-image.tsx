import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { getCaseStudy } from "@/lib/caseStudies";

export const alt = "Skilloura case study";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);

  return renderOgImage({
    eyebrow: "Case study",
    title: study?.title ?? "Case study",
    note: study?.summary,
  });
}
