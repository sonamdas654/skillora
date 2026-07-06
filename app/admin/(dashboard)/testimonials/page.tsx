import { prisma } from "@/lib/db";
import TestimonialsManager from "@/components/admin/TestimonialsManager";

export const metadata = { title: "Testimonials", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function TestimonialsAdminPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <TestimonialsManager
      testimonials={testimonials.map((t) => ({
        id: t.id,
        clientName: t.clientName,
        clientBusiness: t.clientBusiness,
        rating: t.rating,
        review: t.review,
        status: t.status,
      }))}
    />
  );
}
