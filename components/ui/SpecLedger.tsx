import type { ReactNode } from "react";

export interface SpecRow {
  label: string;
  value: ReactNode;
}

/**
 * A specification ledger: mono labels, hairline rules, values right-aligned.
 *
 * This is the composition the brand actually owns. Skilloura's one real
 * differentiator is that you get the scope in writing before you pay, so the
 * site says that in the shape of a document rather than in another row of
 * icon cards. It is the natural home for prices, timelines, deliverables and
 * package specifics, and it is deliberately unlike a card grid so that
 * sections stop looking the same.
 */
export default function SpecLedger({
  rows,
  caption,
  className = "",
}: {
  rows: SpecRow[];
  /** Small mono heading above the ledger. */
  caption?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {caption && (
        <p className="mb-3 text-micro font-mono uppercase text-ink-muted">{caption}</p>
      )}
      <dl className="border-t border-line-strong">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-baseline justify-between gap-6 border-b border-line py-3"
          >
            <dt className="text-body-sm text-ink-soft">{row.label}</dt>
            <dd className="text-right font-mono text-body-sm font-medium text-ink">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
