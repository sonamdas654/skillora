import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { createHash, randomInt } from "node:crypto";

// Client-portal auth — completely separate from the admin session.
// Clients log in with a one-time emailed code; the session cookie only
// carries their email, and every query filters by that email.
const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "skillora-dev-secret-change-in-production"
);

export const CLIENT_COOKIE = "skilloura_client";

export interface ClientSession {
  email: string;
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function generateOtpCode() {
  return String(randomInt(100000, 1000000)); // 6 digits, crypto-secure
}

export function hashOtp(email: string, code: string) {
  return createHash("sha256")
    .update(`${process.env.JWT_SECRET || "dev"}:${normalizeEmail(email)}:${code}`)
    .digest("hex");
}

export async function createClientSessionToken(email: string) {
  return new SignJWT({ kind: "client", email: normalizeEmail(email) })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

export async function getClientSession(): Promise<ClientSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CLIENT_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    if (payload.kind !== "client" || typeof payload.email !== "string") return null;
    return { email: payload.email };
  } catch {
    return null;
  }
}
