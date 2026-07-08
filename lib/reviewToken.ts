import { SignJWT, jwtVerify } from "jose";

// Review-invite links: after delivering a project the owner generates a
// personal link for the client. The link carries a signed token; one
// testimonial per token (enforced by Testimonial.inviteToken unique).
const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "skillora-dev-secret-change-in-production"
);

export interface ReviewInvite {
  jti: string;
  clientName: string;
  clientBusiness?: string;
}

export async function createReviewToken(invite: {
  clientName: string;
  clientBusiness?: string;
}) {
  const jti = crypto.randomUUID();
  const token = await new SignJWT({
    kind: "review-invite",
    clientName: invite.clientName,
    clientBusiness: invite.clientBusiness || undefined,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setJti(jti)
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
  return token;
}

export async function verifyReviewToken(token: string): Promise<ReviewInvite | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    if (payload.kind !== "review-invite" || !payload.jti || !payload.clientName) return null;
    return {
      jti: payload.jti,
      clientName: payload.clientName as string,
      clientBusiness: (payload.clientBusiness as string | undefined) || undefined,
    };
  } catch {
    return null;
  }
}
