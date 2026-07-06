import { prisma } from "./db";

/** Sequential document numbers like QUO-2026-0007 / INV-2026-0007. */
export async function nextNumber(kind: "quotation" | "invoice") {
  const year = new Date().getFullYear();
  const prefix = kind === "quotation" ? `QUO-${year}-` : `INV-${year}-`;
  const last =
    kind === "quotation"
      ? await prisma.quotation.findFirst({
          where: { quoteNumber: { startsWith: prefix } },
          orderBy: { quoteNumber: "desc" },
          select: { quoteNumber: true },
        })
      : await prisma.invoice.findFirst({
          where: { invoiceNumber: { startsWith: prefix } },
          orderBy: { invoiceNumber: "desc" },
          select: { invoiceNumber: true },
        });
  const lastNum = last
    ? parseInt(("quoteNumber" in last ? last.quoteNumber : last.invoiceNumber).slice(prefix.length), 10)
    : 0;
  return `${prefix}${String(lastNum + 1).padStart(4, "0")}`;
}
