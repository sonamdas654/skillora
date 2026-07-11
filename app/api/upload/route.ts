import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

// File upload rules — plan section 31.
const ALLOWED_EXT = ["jpg", "jpeg", "png", "pdf", "docx", "xlsx", "zip", "mp4", "txt"];
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB
const MAX_FILES = 10;

// Storage: Vercel Blob in production (BLOB_READ_WRITE_TOKEN set), local disk
// outside /public otherwise. Either way files are served only via the
// admin download API — blob URLs are never exposed to the client.
const blobEnabled = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);
const UPLOAD_DIR = path.join(process.cwd(), "uploads");

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const leadId = formData.get("leadId");
  if (typeof leadId !== "string" || !leadId) {
    return NextResponse.json({ error: "leadId required" }, { status: 400 });
  }

  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  const files = formData.getAll("files").filter((f): f is File => f instanceof File);
  if (files.length === 0) {
    return NextResponse.json({ error: "No files" }, { status: 400 });
  }
  if (files.length > MAX_FILES) {
    return NextResponse.json({ error: `Max ${MAX_FILES} files` }, { status: 400 });
  }

  if (!blobEnabled()) await mkdir(UPLOAD_DIR, { recursive: true });

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
      return NextResponse.json(
        { error: `"${file.name}" is too large (max 25 MB)` },
        { status: 400 }
      );
    }
    const storedName = `${leadId}_${crypto.randomBytes(8).toString("hex")}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    let blobUrl: string | null = null;
    if (blobEnabled()) {
      const { put } = await import("@vercel/blob");
      const blob = await put(`uploads/${storedName}`, buffer, {
        access: "public", // pathname is unguessable; download still goes through admin auth
        contentType: file.type || undefined,
      });
      blobUrl = blob.url;
    } else {
      await writeFile(path.join(UPLOAD_DIR, storedName), buffer);
    }

    const rec = await prisma.uploadedFile.create({
      data: {
        leadId,
        fileName: file.name,
        storedFileName: storedName,
        fileType: ext,
        fileSize: file.size,
        fileUrl: `/api/admin/files/${storedName}`,
        blobUrl,
      },
    });
    saved.push({ id: rec.id, fileName: rec.fileName });
  }

  return NextResponse.json({ ok: true, files: saved });
}
