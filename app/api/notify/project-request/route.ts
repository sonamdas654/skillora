import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { notifyNewLead, confirmLeadToClient } from "@/lib/notify";
import { scoreLead } from "@/lib/leadScore";

// Called client-side right after a real (non-partial) project request submit.
// Re-reads the row from the DB (via the caller's own session + RLS) rather
// than trusting the POST body, so this can't be used to spam arbitrary
// emails — only the person who owns the request (or an admin) can trigger it.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const ref = body?.ref;
  if (!ref) return NextResponse.json({ error: "Missing ref" }, { status: 400 });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: pr } = await supabase
    .from("project_requests")
    .select("id, guest_name, guest_email, guest_phone, service_category, service_type, description, budget_range, deadline, form_answers, status")
    .eq("id", ref)
    .eq("status", "submitted")
    .maybeSingle();

  if (!pr) return NextResponse.json({ error: "Request not found" }, { status: 404 });

  const answers = Object.entries(pr.form_answers ?? {}).map(([question, answer]) => ({
    question,
    answer: Array.isArray(answer) ? answer.join(", ") : String(answer ?? ""),
  }));

  // lib/leadScore.ts existed with no callers, so notifyNewLead always fell
  // through to its `?? "—"` default: every lead email said "Lead score: —" and
  // every subject line read "[Lead]". The scorer works; nothing was calling it.
  //
  // The signals it wants live in the free-form answers, so they are read back
  // out by matching on the question text the form actually renders.
  const answerFor = (needle: string) =>
    answers.find((a) => a.question.toLowerCase().includes(needle))?.answer;

  const leadScore = scoreLead({
    budgetRange: pr.budget_range ?? undefined,
    deadline: pr.deadline ?? undefined,
    projectStatus: answerFor("status") ?? answerFor("when do you want"),
    readyToStart: answerFor("ready to start"),
    advancePaymentComfort: answerFor("advance"),
    hasFilesOrReferences: answers.some(
      (a) => /reference|file|upload|link/i.test(a.question) && a.answer.trim().length > 0
    ),
  });

  await Promise.all([
    notifyNewLead(
      {
        id: pr.id,
        clientName: pr.guest_name ?? "—",
        email: pr.guest_email ?? user.email ?? "—",
        phone: pr.guest_phone ?? "—",
        serviceCategory: pr.service_category ?? "—",
        serviceType: pr.service_type,
        projectDescription: pr.description ?? "",
        budgetRange: pr.budget_range ?? "—",
        deadline: pr.deadline,
        leadScore,
      },
      answers
    ),
    (pr.guest_email || user.email)
      ? confirmLeadToClient({ clientName: pr.guest_name ?? "there", email: pr.guest_email ?? user.email! })
      : Promise.resolve(),
  ]);

  return NextResponse.json({ ok: true });
}
