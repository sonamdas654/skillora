import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { generateOtpCode, hashOtp, normalizeEmail } from "@/lib/clientAuth";
import { sendClientOtp } from "@/lib/notify";

const schema = z.object({ email: z.string().email() });

// Step 1 of client login: email in → one-time code out (if we know them).
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  const email = normalizeEmail(parsed.data.email);

  // Only emails with an existing project request can log in.
  const lead = await prisma.lead.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    select: { id: true },
  });
  if (!lead) {
    return NextResponse.json(
      { error: "No projects found for this email. Use the same email you submitted your project with." },
      { status: 404 }
    );
  }

  // Rate limit: one code per minute per email.
  const recent = await prisma.clientOtp.findFirst({
    where: { email, createdAt: { gt: new Date(Date.now() - 60_000) } },
  });
  if (recent) {
    return NextResponse.json(
      { error: "A code was just sent. Please wait a minute before requesting another." },
      { status: 429 }
    );
  }

  const code = generateOtpCode();
  await prisma.clientOtp.create({
    data: {
      email,
      codeHash: hashOtp(email, code),
      expiresAt: new Date(Date.now() + 10 * 60_000),
    },
  });

  // Serverless rule: must await or the email silently drops on Vercel.
  await sendClientOtp(email, code);

  return NextResponse.json({ ok: true });
}
