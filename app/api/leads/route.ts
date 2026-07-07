import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { scoreLead } from "@/lib/leadScore";
import { notifyNewLead, confirmLeadToClient } from "@/lib/notify";

const leadSchema = z.object({
  clientName: z.string().min(2).max(120),
  email: z.string().email().max(200),
  phone: z.string().min(7).max(20),
  businessName: z.string().max(200).optional().or(z.literal("")),
  cityCountry: z.string().max(200).optional().or(z.literal("")),
  serviceCategory: z.string().min(1).max(100),
  serviceType: z.string().max(200).optional().or(z.literal("")),
  projectDescription: z.string().min(10).max(5000),
  budgetRange: z.string().min(1).max(60),
  deadline: z.string().max(40).optional().or(z.literal("")),
  projectStatus: z.string().max(60).optional().or(z.literal("")),
  preferredContact: z.string().max(30).optional().or(z.literal("")),
  bestTimeToContact: z.string().max(60).optional().or(z.literal("")),
  readyToStart: z.string().max(20).optional().or(z.literal("")),
  advancePaymentComfort: z.string().max(30).optional().or(z.literal("")),
  additionalNotes: z.string().max(3000).optional().or(z.literal("")),
  hasDomain: z.string().max(20).optional().or(z.literal("")),
  hasHosting: z.string().max(20).optional().or(z.literal("")),
  needsMaintenance: z.string().max(20).optional().or(z.literal("")),
  referenceLinks: z.string().max(3000).optional().or(z.literal("")),
  termsAccepted: z.literal(true),
  selectedDemoConcept: z.string().max(200).optional().or(z.literal("")),
  // Dynamic service-wise answers: [{ fieldKey, question, answer }]
  formAnswers: z
    .array(
      z.object({
        fieldKey: z.string().max(80),
        question: z.string().max(300),
        answer: z.string().max(5000),
      })
    )
    .max(60)
    .optional(),
  // honeypot — bots fill this
  website: z.string().max(0).optional().or(z.literal("")),
});

// naive in-memory rate limit (per runtime instance)
const hits = new Map<string, { count: number; ts: number }>();
function rateLimited(ip: string) {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now - rec.ts > 60_000) {
    hits.set(ip, { count: 1, ts: now });
    return false;
  }
  rec.count++;
  return rec.count > 5;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const d = parsed.data;

  const hasReferences =
    !!d.referenceLinks ||
    (d.formAnswers ?? []).some(
      (a) => a.fieldKey.includes("reference") && a.answer.trim().length > 0
    );

  const leadScore = scoreLead({
    budgetRange: d.budgetRange,
    deadline: d.deadline || undefined,
    projectStatus: d.projectStatus || undefined,
    readyToStart: d.readyToStart || undefined,
    advancePaymentComfort: d.advancePaymentComfort || undefined,
    hasFilesOrReferences: hasReferences,
  });

  const answers = [...(d.formAnswers ?? [])];
  if (d.referenceLinks) {
    answers.push({ fieldKey: "reference_links", question: "Reference links", answer: d.referenceLinks });
  }
  if (d.selectedDemoConcept) {
    answers.push({ fieldKey: "selected_demo_concept", question: "Selected Reference Concept", answer: d.selectedDemoConcept });
  }

  const lead = await prisma.lead.create({
    data: {
      clientName: d.clientName,
      email: d.email,
      phone: d.phone,
      businessName: d.businessName || null,
      cityCountry: d.cityCountry || null,
      serviceCategory: d.serviceCategory,
      serviceType: d.serviceType || null,
      projectDescription: d.projectDescription,
      budgetRange: d.budgetRange,
      deadline: d.deadline || null,
      projectStatus: d.projectStatus || null,
      preferredContact: d.preferredContact || null,
      bestTimeToContact: d.bestTimeToContact || null,
      readyToStart: d.readyToStart || null,
      advancePaymentComfort: d.advancePaymentComfort || null,
      additionalNotes: d.additionalNotes || null,
      hasDomain: d.hasDomain || null,
      hasHosting: d.hasHosting || null,
      needsMaintenance: d.needsMaintenance || null,
      leadScore,
      source: "website",
      formAnswers: {
        create: answers.map((a) => ({
          fieldKey: a.fieldKey,
          question: a.question,
          answer: a.answer,
        })),
      },
    },
  });

  // Must await on serverless — the runtime freezes once the response returns.
  await notifyNewLead(lead, answers).catch(() => {});
  await confirmLeadToClient(lead).catch(() => {});

  return NextResponse.json({ ok: true, leadId: lead.id, leadScore });
}
