import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

// AI features — plan section 29 (MVP): requirement summary + quotation draft.
// Requires ANTHROPIC_API_KEY in .env; responds gracefully when missing.

const schema = z.object({
  leadId: z.string().min(1),
  kind: z.enum(["summary", "quote_draft"]),
});

const prompts = {
  summary: `You are an assistant for a solo digital agency (Skillora). Summarize this project lead for the owner in under 150 words. Include: what the client wants, key requirements, red flags (vague scope, low budget vs expectations, urgency), and 3 clarifying questions to ask on WhatsApp. Be direct and practical.`,
  quote_draft: `You are an assistant for a solo digital agency (Skillora). Draft a quotation for this lead. Include: 1) Scope — bullet list of what's included, 2) Explicitly NOT included, 3) Suggested price range in INR based on the stated budget and scope, 4) Timeline estimate, 5) Payment terms (40-50% advance, balance before delivery), 6) Revision count suggestion. Keep it under 250 words, ready to copy into a quotation.`,
};

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI not configured. Add ANTHROPIC_API_KEY to .env to enable AI features." },
      { status: 501 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const lead = await prisma.lead.findUnique({
    where: { id: parsed.data.leadId },
    include: { formAnswers: true, uploadedFiles: { select: { fileName: true } } },
  });
  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

  const leadContext = [
    `Client: ${lead.clientName}${lead.businessName ? ` (${lead.businessName})` : ""}`,
    `Location: ${lead.cityCountry ?? "not given"}`,
    `Service: ${lead.serviceCategory}${lead.serviceType ? ` — ${lead.serviceType}` : ""}`,
    `Description: ${lead.projectDescription}`,
    `Budget: ${lead.budgetRange} | Deadline: ${lead.deadline ?? "not given"}`,
    `Project status: ${lead.projectStatus ?? "not given"} | Ready in 7 days: ${lead.readyToStart ?? "?"} | Advance OK: ${lead.advancePaymentComfort ?? "?"}`,
    `Domain: ${lead.hasDomain ?? "?"} | Hosting: ${lead.hasHosting ?? "?"} | Maintenance: ${lead.needsMaintenance ?? "?"}`,
    lead.additionalNotes ? `Notes: ${lead.additionalNotes}` : "",
    lead.formAnswers.length
      ? `Requirement answers:\n${lead.formAnswers.map((a) => `- ${a.question}: ${a.answer}`).join("\n")}`
      : "",
    lead.uploadedFiles.length
      ? `Uploaded files: ${lead.uploadedFiles.map((f) => f.fileName).join(", ")}`
      : "No files uploaded.",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 1000,
        system: prompts[parsed.data.kind],
        messages: [{ role: "user", content: leadContext }],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[ai] Anthropic API error:", err);
      return NextResponse.json({ error: "AI request failed" }, { status: 502 });
    }

    const json = await res.json();
    const text: string =
      json.content?.map((b: { type: string; text?: string }) => b.text ?? "").join("") ?? "";

    // save as internal note so it's kept with the lead
    await prisma.note.create({
      data: {
        leadId: lead.id,
        userId: session.userId,
        note: `[AI ${parsed.data.kind === "summary" ? "Summary" : "Quote draft"}]\n${text}`,
      },
    });

    return NextResponse.json({ ok: true, text });
  } catch (err) {
    console.error("[ai] request failed:", err);
    return NextResponse.json({ error: "AI request failed" }, { status: 502 });
  }
}
