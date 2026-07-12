import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { portfolioItems, getConceptBySlug } from "@/lib/portfolio";
import DemoChrome from "@/components/demos/DemoChrome";
import RestaurantDemo from "@/components/demos/RestaurantDemo";
import GymDemo from "@/components/demos/GymDemo";
import SalonDemo from "@/components/demos/SalonDemo";
import EcommerceDemo from "@/components/demos/EcommerceDemo";
import ChatbotDemo from "@/components/demos/ChatbotDemo";
import DashboardDemo from "@/components/demos/DashboardDemo";

// Only the concept builds have live demo pages.
export function generateStaticParams() {
  return portfolioItems.filter((p) => p.demoType).map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;

const DEMOS = {
  restaurant: RestaurantDemo,
  gym: GymDemo,
  salon: SalonDemo,
  ecommerce: EcommerceDemo,
  chatbot: ChatbotDemo,
  dashboard: DashboardDemo,
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getConceptBySlug(slug);
  if (!item) return {};
  return {
    title: `${item.title} — Live Concept Demo`,
    description: `Explore a live concept build by Skilloura: ${item.solution}`,
    alternates: { canonical: `/portfolio/${slug}` },
  };
}

export default async function DemoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getConceptBySlug(slug);
  if (!item || !item.demoType) notFound();

  const Demo = DEMOS[item.demoType];

  return (
    <DemoChrome title={item.title} serviceSlug={item.serviceSlug ?? "website-development"}>
      <Demo />
    </DemoChrome>
  );
}
