import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { whatsappLink } from "@/lib/site";
import LeadActions from "@/components/admin/LeadActions";
import AiAssist from "@/components/admin/AiAssist";
import DeliveryManager from "@/components/admin/DeliveryManager";

export const metadata = { title: "Lead Detail", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      formAnswers: true,
      uploadedFiles: true,
      deliveryFiles: { orderBy: { createdAt: "desc" } },
      notes: { orderBy: { createdAt: "desc" }, include: { user: { select: { name: true } } } },
    },
  });
  if (!lead) notFound();

  const info: [string, string | null][] = [
    ["Email", lead.email],
    ["WhatsApp", lead.phone],
    ["Business", lead.businessName],
    ["Location", lead.cityCountry],
    ["Service", lead.serviceCategory],
    ["Project type", lead.serviceType],
    ["Budget", lead.budgetRange],
    ["Deadline", lead.deadline],
    ["Project status", lead.projectStatus],
    ["Preferred contact", lead.preferredContact],
    ["Best time", lead.bestTimeToContact],
    ["Ready in 7 days", lead.readyToStart],
    ["Advance comfort", lead.advancePaymentComfort],
    ["Has domain", lead.hasDomain],
    ["Has hosting", lead.hasHosting],
    ["Needs maintenance", lead.needsMaintenance],
  ];

  return (
    <div>
      <Link href="/admin/leads" className="text-sm font-semibold text-accent hover:underline">
        ← Back to leads
      </Link>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">{lead.clientName}</h1>
          <p className="text-sm text-ink-soft">
            Received{" "}
            {lead.createdAt.toLocaleString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <a
          href={whatsappLink(
            `Hi ${lead.clientName}, I received your ${lead.serviceCategory} project request on Skilloura. Let's discuss!`
          ).replace(/wa\.me\/\d+/, `wa.me/${lead.phone.replace(/\D/g, "")}`)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          Open WhatsApp chat
        </a>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          {/* Description */}
          <div className="rounded-2xl border border-line bg-white p-6">
            <h2 className="text-base font-bold text-ink">Project description</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-ink-soft">
              {lead.projectDescription}
            </p>
            {lead.additionalNotes && (
              <>
                <h3 className="mt-5 text-sm font-bold text-ink">Additional notes</h3>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-ink-soft">
                  {lead.additionalNotes}
                </p>
              </>
            )}
          </div>

          {/* Service-wise answers */}
          {lead.formAnswers.length > 0 && (
            <div className="rounded-2xl border border-line bg-white p-6">
              <h2 className="text-base font-bold text-ink">Requirement answers</h2>
              <dl className="mt-4 divide-y divide-line">
                {lead.formAnswers.map((a) => (
                  <div key={a.id} className="grid gap-1 py-3 sm:grid-cols-[1fr_1.2fr]">
                    <dt className="text-sm font-semibold text-ink-soft">{a.question}</dt>
                    <dd className="text-sm text-ink whitespace-pre-wrap">{a.answer}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Files */}
          <div className="rounded-2xl border border-line bg-white p-6">
            <h2 className="text-base font-bold text-ink">
              Uploaded files ({lead.uploadedFiles.length})
            </h2>
            {lead.uploadedFiles.length === 0 ? (
              <p className="mt-3 text-sm text-ink-soft">No files uploaded.</p>
            ) : (
              <ul className="mt-4 space-y-2">
                {lead.uploadedFiles.map((f) => (
                  <li key={f.id} className="flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-2.5">
                    <span className="truncate text-sm font-medium text-ink">{f.fileName}</span>
                    <span className="flex shrink-0 items-center gap-3">
                      <span className="text-xs text-ink-soft">
                        {(f.fileSize / 1024 / 1024).toFixed(1)} MB
                      </span>
                      <a
                        href={`/api/admin/files/${f.storedFileName}`}
                        className="text-sm font-semibold text-accent hover:underline"
                      >
                        Download
                      </a>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Deliverables → client portal */}
          <DeliveryManager
            leadId={lead.id}
            files={lead.deliveryFiles.map((f) => ({
              id: f.id,
              fileName: f.fileName,
              fileSize: f.fileSize,
              note: f.note,
              createdAt: f.createdAt.toISOString(),
            }))}
          />
        </div>

        <div className="space-y-6">
          <AiAssist leadId={lead.id} />

          {/* Status + score + notes (client component) */}
          <LeadActions
            leadId={lead.id}
            currentStatus={lead.leadStatus}
            currentScore={lead.leadScore}
            notes={lead.notes.map((n) => ({
              id: n.id,
              note: n.note,
              author: n.user?.name ?? "Admin",
              date: n.createdAt.toISOString(),
            }))}
          />

          {/* Contact info */}
          <div className="rounded-2xl border border-line bg-white p-6">
            <h2 className="text-base font-bold text-ink">Details</h2>
            <dl className="mt-3 space-y-2">
              {info
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3 text-sm">
                    <dt className="text-ink-soft">{k}</dt>
                    <dd className="text-right font-medium text-ink">{v}</dd>
                  </div>
                ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
