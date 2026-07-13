import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LIVE_DEMOS } from "@/lib/liveDemos";
import DemoChrome from "@/components/demos/DemoChrome";
import SaaSDemo from "@/components/demos/SaaSDemo";
import EcommerceDemo from "@/components/demos/EcommerceDemo";
import RestaurantDemo from "@/components/demos/RestaurantDemo";
import PortfolioSiteDemo from "@/components/demos/PortfolioSiteDemo";
import RealEstateDemo from "@/components/demos/RealEstateDemo";
import EducationDemo from "@/components/demos/EducationDemo";
import ClinicDemo from "@/components/demos/ClinicDemo";

// Real, fully-explorable live demos for the Reference Design concept cards.
const DEMOS: Record<string, React.ComponentType> = {
  "web-saas": SaaSDemo,
  "web-ecommerce": EcommerceDemo,
  "web-local": RestaurantDemo,
  "web-portfolio": PortfolioSiteDemo,
  "web-realestate": RealEstateDemo,
  "web-education": EducationDemo,
  "web-clinic": ClinicDemo,
};

export function generateStaticParams() {
  return Object.keys(DEMOS).map((id) => ({ id }));
}
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const title = LIVE_DEMOS[id];
  if (!title) return {};
  return {
    title: `${title} — Live Concept Demo`,
    description: `Explore a real, working concept demo by Skilloura: ${title}.`,
    alternates: { canonical: `/demo/${id}` },
  };
}

export default async function LiveDemoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const Demo = DEMOS[id];
  const title = LIVE_DEMOS[id];
  if (!Demo || !title) notFound();

  return (
    <DemoChrome title={title} serviceSlug="website-development">
      <Demo />
    </DemoChrome>
  );
}
