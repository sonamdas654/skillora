import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { notifyFilesDelivered } from "@/lib/notify";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

// Owner uploads final deliverables for a lead. Same storage rules as
// client uploads: Vercel Blob in production, local disk in dev.
const ALLOWED_EXT = ["jpg", "jpeg", "png", "pdf", "docx", "xlsx", "zip", "mp4", "txt"];
const MAX_FILE_SIZE = 25 * 1024 * 1024;
const MAX_FILES = 10;

const blobEnabled = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);
const DELIVERY_DIR = path.join(process.cwd(), "uploads", "delivery");

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

  const formData = await req.formData();
  const note = typeof formData.get("note") === "string" ? (formData.get("note") as string) : "";
  const files = formData.getAll("files").filter((f): f is File => f instanceof File);
  if (files.length === 0) return NextResponse.json({ error: "No files" }, { status: 400 });
  if (files.length > MAX_FILES) return NextResponse.json({ error: `Max ${MAX_FILES} files` }, { status: 400 });

  if (!blobEnabled()) await mkdir(DELIVERY_DIR, { recursive: true });

  const saved = [];
  for (const file of files) {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!ALLOWED_EXT.includes(ext)) {
      return NextResponse.json(
        { error: `File type .${ext} not allowed. Allowed: ${ALLOWED_EXT.join(", ")}` },
        { status: 400 }
      );
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: `"${file.name}" is too large (max 25 MB)` }, { status: 400 });
    }
    const storedName = `${id}_${crypto.randomBytes(8).toString("hex")}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    let blobUrl: string | null = null;
    if (blobEnabled()) {
      const { put } = await import("@vercel/blob");
      const blob = await put(`delivery/${storedName}`, buffer, {
        access: "public", // unguessable pathname; download goes through client-auth proxy
        contentType: file.type || undefined,
      });
      blobUrl = blob.url;
    } else {
      await writeFile(path.join(DELIVERY_DIR, storedName), buffer);
    }

    const rec = await prisma.deliveryFile.create({
      data: {
        leadId: id,
        fileName: file.name,
        storedFileName: storedName,
        fileType: ext,
        fileSize: file.size,
        blobUrl,
        note: note || null,
      },
    });
    saved.push({ id: rec.id, fileName: rec.fileName });
  }

  // Serverless rule: must await or the email silently drops on Vercel.
  await notifyFilesDelivered({
    clientName: lead.clientName,
    email: lead.email,
    fileCount: saved.length,
  });

  return NextResponse.json({ ok: true, files: saved });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { fileId } = await req.json().catch(() => ({}));
  if (!fileId) return NextResponse.json({ error: "fileId required" }, { status: 400 });

  const file = await prisma.deliveryFile.findUnique({ where: { id: fileId } });
  if (!file || file.leadId !== id) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (file.blobUrl) {
    try {
      const { del } = await import("@vercel/blob");
      await del(file.blobUrl);
    } catch {
      // blob cleanup is best-effort; the DB row removal is what matters
    }
  }
  await prisma.deliveryFile.delete({ where: { id: fileId } });
  return NextResponse.json({ ok: true });
}
