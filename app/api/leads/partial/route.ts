import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

// Progressive lead capture. When a visitor enters their contact details and
// then leaves before finishing the full form, the client beacons here so we
// still capture a partial "Abandoned" lead the owner can follow up on.
//
// Kept intentionally quiet: no owner ping (avoids noise from tab-switchers),
// de-duped per email/day, and cleared automatically if the person later
// completes the full submission (see app/api/leads/route.ts).

const partialSchema = z.object({
  clientName: z.string().max(120).optional().or(z.literal("")),
  email: z.string().email().max(200),
  phone: z.string().min(7).max(20),
  serviceCategory: z.string().max(120).optional().or(z.literal("")),
  projectDescription: z.string().max(5000).optional().or(z.literal("")),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = partialSchema.safeParse(body);
  if (!parsed.success) {
    // Silent for beacons — never surface errors to the abandoning user.
    return NextResponse.json({ ok: false }, { status: 200 });
  }
  const d = parsed.data;

  try {
    // De-dupe: skip if we already captured this email (partial or full) in 24h.
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existing = await prisma.lead.findFirst({
      where: { email: d.email, createdAt: { gte: since } },
      select: { id: true },
    });
    if (existing) return NextResponse.json({ ok: true, deduped: true });

    await prisma.lead.create({
      data: {
        clientName: d.clientName || "(Not provided)",
        email: d.email,
        phone: d.phone,
        serviceCategory: d.serviceCategory || "Not selected yet",
        projectDescription:
          d.projectDescription || "(Started the project form but left before submitting — partial capture.)",
        budgetRange: "Not specified",
        leadStatus: "Abandoned",
        leadScore: "Low",
        source: "Partial (abandoned form)",
      },
    });
  } catch {
    // never fail a beacon
  }

  return NextResponse.json({ ok: true });
}
