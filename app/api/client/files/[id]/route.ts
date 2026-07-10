import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getClientSession } from "@/lib/clientAuth";
import { readFile } from "fs/promises";
import path from "path";

// Ownership-checked download for delivered files: verifies the portal
// session owns the lead, then redirects to the unguessable blob URL
// (production) or streams from disk (dev).
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getClientSession();
  if (!session) return NextResponse.json({ error: "Please sign in." }, { status: 401 });

  const { id } = await params;
  const file = await prisma.deliveryFile.findUnique({
    where: { id },
    include: { lead: { select: { email: true } } },
  });
  if (!file || file.lead.email.toLowerCase() !== session.email.toLowerCase()) {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }

  if (file.blobUrl) {
    return NextResponse.redirect(file.blobUrl);
  }

  // Local-dev fallback: stream from disk
  try {
    const buffer = await readFile(
      path.join(process.cwd(), "uploads", "delivery", file.storedFileName)
    );
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Disposition": `attachment; filename="${file.fileName.replace(/"/g, "")}"`,
        "Content-Type": "application/octet-stream",
      },
    });
  } catch {
    return NextResponse.json({ error: "File not available." }, { status: 404 });
  }
}
