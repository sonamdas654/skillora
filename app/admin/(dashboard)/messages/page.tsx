import { prisma } from "@/lib/db";

export const metadata = { title: "Messages", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Contact messages</h1>
      <div className="mt-6 space-y-4">
        {messages.length === 0 && (
          <p className="rounded-2xl border border-line bg-white p-8 text-center text-sm text-ink-soft">
            No messages yet.
          </p>
        )}
        {messages.map((m) => (
          <div key={m.id} className="rounded-2xl border border-line bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-bold text-ink">
                {m.name} <span className="font-normal text-ink-soft">· {m.email}</span>
                {m.phone && <span className="font-normal text-ink-soft"> · {m.phone}</span>}
              </p>
              <p className="text-xs text-ink-soft">
                {m.createdAt.toLocaleString("en-IN", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-ink-soft">{m.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
