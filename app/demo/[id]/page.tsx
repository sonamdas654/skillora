import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEMO_CONCEPTS } from "@/lib/demoConcepts";
import { serviceOf } from "@/lib/liveDemos";
import DemoChrome from "@/components/demos/DemoChrome";
import SaaSDemo from "@/components/demos/SaaSDemo";
import EcommerceDemo from "@/components/demos/EcommerceDemo";
import RestaurantDemo from "@/components/demos/RestaurantDemo";
import PortfolioSiteDemo from "@/components/demos/PortfolioSiteDemo";
import RealEstateDemo from "@/components/demos/RealEstateDemo";
import EducationDemo from "@/components/demos/EducationDemo";
import ClinicDemo from "@/components/demos/ClinicDemo";
import MobileAppDemo from "@/components/demos/MobileAppDemo";
import ChatbotDemo from "@/components/demos/ChatbotDemo";
import BrandingDemo from "@/components/demos/BrandingDemo";
import VideoDemo from "@/components/demos/VideoDemo";
import MarketingDemo from "@/components/demos/MarketingDemo";
import DashboardDemo from "@/components/demos/DashboardDemo";
import ResumeDemo from "@/components/demos/ResumeDemo";
import SoftwareDemo from "@/components/demos/SoftwareDemo";

// Website concepts have a bespoke demo each; the other services map by prefix
// to one strong representative live demo for that service.
const DEMO_BY_ID: Record<string, React.ComponentType> = {
  "web-saas": SaaSDemo,
  "web-ecommerce": EcommerceDemo,
  "web-local": RestaurantDemo,
  "web-portfolio": PortfolioSiteDemo,
  "web-realestate": RealEstateDemo,
  "web-education": EducationDemo,
  "web-clinic": ClinicDemo,
};
const DEMO_BY_PREFIX: Record<string, React.ComponentType> = {
  app: MobileAppDemo,
  ai: ChatbotDemo,
  brand: BrandingDemo,
  vid: VideoDemo,
  mkt: MarketingDemo,
  dash: DashboardDemo,
  cv: ResumeDemo,
  soft: SoftwareDemo,
};

function conceptTitle(id: string): string | undefined {
  for (const list of Object.values(DEMO_CONCEPTS)) {
    const c = list.find((x) => x.id === id);
    if (c) return c.title;
  }
  return undefined;
}

export function generateStaticParams() {
  return Object.values(DEMO_CONCEPTS)
    .flat()
    .map((c) => ({ id: c.id }));
}
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const title = conceptTitle(id);
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
  const Demo = DEMO_BY_ID[id] ?? DEMO_BY_PREFIX[id.split("-")[0]];
  const title = conceptTitle(id);
  if (!Demo || !title) notFound();

  return (
    <DemoChrome title={title} serviceSlug={serviceOf(id) ?? "website-development"}>
      <Demo />
    </DemoChrome>
  );
}
