import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import {
  CLIENT_COOKIE,
  createClientSessionToken,
  hashOtp,
  normalizeEmail,
} from "@/lib/clientAuth";

const schema = z.object({
  email: z.string().email(),
  code: z.string().regex(/^\d{6}$/, "Code must be 6 digits"),
});

// Step 2 of client login: verify the emailed code, set the session cookie.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Enter the 6-digit code from your email." }, { status: 400 });
  const email = normalizeEmail(parsed.data.email);

  const otp = await prisma.clientOtp.findFirst({
    where: { email, usedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });
  if (!otp) {
    return NextResponse.json(
      { error: "Code expired or not found. Request a new one." },
      { status: 400 }
    );
  }
  if (otp.attempts >= 5) {
    return NextResponse.json(
      { error: "Too many wrong attempts. Request a new code." },
      { status: 429 }
    );
  }

  if (otp.codeHash !== hashOtp(email, parsed.data.code)) {
    await prisma.clientOtp.update({ where: { id: otp.id }, data: { attempts: { increment: 1 } } });
    return NextResponse.json({ error: "Wrong code. Please check and try again." }, { status: 400 });
  }

  await prisma.clientOtp.update({ where: { id: otp.id }, data: { usedAt: new Date() } });

  const token = await createClientSessionToken(email);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(CLIENT_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  });
  return res;
}
