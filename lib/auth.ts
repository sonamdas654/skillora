import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./db";
import bcrypt from "bcryptjs";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "skillora-dev-secret-change-in-production"
);

export const AUTH_COOKIE = "skillora_admin";

export interface AdminSession {
  userId: string;
  email: string;
  role: string;
  name: string;
}

export async function createSessionToken(session: AdminSession) {
  return new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifySessionToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as string,
      name: payload.name as string,
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/** Ensure the default admin user exists (created from env on first login attempt). */
export async function ensureAdminUser() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    await prisma.user.create({
      data: {
        name: "Admin",
        email,
        passwordHash: await bcrypt.hash(password, 10),
        role: "super_admin",
      },
    });
  }
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}
