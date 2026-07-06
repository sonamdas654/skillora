import type { Metadata } from "next";
import PageShell, { PageHero } from "@/components/PageShell";
import ProjectRequestForm from "@/components/ProjectRequestForm";
import { Section } from "@/components/Section";
import Icon from "@/components/Icons";

export const metadata: Metadata = {
  title: "Submit Project Requirement — Get a Clear Plan & Quote",
  description:
    "Submit your website, app, AI automation, design or digital project requirement through a smart form. Upload files, set budget and deadline — reply within 24 hours.",
};

export default async function StartProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;

  return (
    <PageShell>
      <PageHero
        eyebrow="Start a project"
        title={
          <>
            Submit your{" "}
            <span className="font-accent font-normal text-accent">requirement</span>
          </>
        }
        subtitle="Takes about 3 minutes. Free, no obligation — you get a personal review and a clear reply within 24 hours."
      />
      <Section>
        <ProjectRequestForm initialService={service} />
        <div className="mx-auto mt-10 max-w-3xl grid gap-4 sm:grid-cols-3">
          {[
            { icon: "shield", text: "Your files stay private and secure" },
            { icon: "clock", text: "Personal reply within 24 hours" },
            { icon: "check", text: "Written quote before any payment" },
          ].map((t) => (
            <div key={t.text} className="flex items-center gap-3 rounded-xl border border-line bg-white px-4 py-3">
              <Icon name={t.icon} className="size-5 shrink-0 text-mint" />
              <p className="text-xs font-medium text-ink-soft">{t.text}</p>
            </div>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
