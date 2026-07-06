import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { readFile } from "fs/promises";
import path from "path";

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  zip: "application/zip",
  mp4: "video/mp4",
  txt: "text/plain",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name } = await params;
  // prevent path traversal — stored names are hex + extension only
  if (!/^[\w-]+\.[a-z0-9]+$/i.test(name)) {
    return NextResponse.json({ error: "Invalid file" }, { status: 400 });
  }

  const record = await prisma.uploadedFile.findFirst({ where: { storedFileName: name } });
  if (!record) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const ext = name.split(".").pop()!.toLowerCase();
  const headers = {
    "Content-Type": MIME[ext] ?? "application/octet-stream",
    "Content-Disposition": `attachment; filename="${record.fileName.replace(/"/g, "")}"`,
  };

  // Cloud storage (Vercel Blob) — proxy the blob so its URL stays private.
  if (record.blobUrl) {
    const res = await fetch(record.blobUrl);
    if (!res.ok || !res.body) {
      return NextResponse.json({ error: "File missing in storage" }, { status: 404 });
    }
    return new NextResponse(res.body, { headers });
  }

  try {
    const buffer = await readFile(path.join(process.cwd(), "uploads", name));
    return new NextResponse(new Uint8Array(buffer), { headers });
  } catch {
    return NextResponse.json({ error: "File missing on disk" }, { status: 404 });
  }
}
