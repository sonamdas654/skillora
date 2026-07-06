import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createSessionToken, ensureAdminUser, verifyPassword, AUTH_COOKIE } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const attempts = new Map<string, { count: number; ts: number }>();

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  const rec = attempts.get(ip);
  const now = Date.now();
  if (rec && now - rec.ts < 15 * 60_000 && rec.count >= 8) {
    return NextResponse.json({ error: "Too many attempts. Try later." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }

  await ensureAdminUser();

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  const ok = user && (await verifyPassword(parsed.data.password, user.passwordHash));
  if (!ok || user.status !== "active") {
    const cur = attempts.get(ip);
    attempts.set(ip, cur && now - cur.ts < 15 * 60_000 ? { count: cur.count + 1, ts: cur.ts } : { count: 1, ts: now });
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });

  const token = await createSessionToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  const res = NextResponse.json({ ok: true, name: user.name, role: user.role });
  res.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 3600,
    path: "/",
  });
  return res;
}
