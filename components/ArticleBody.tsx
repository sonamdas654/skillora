import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Renders blog body copy.
 *
 * The previous renderer lived inline in app/blog/[slug]/page.tsx and handled
 * exactly three things: "## " headings, blocks where every line began with
 * "- ", and paragraphs. Everything else fell through as plain text.
 *
 * The consequence that matters: **it could not render a link**. A blog that
 * cannot link is useless for the internal link graph — the one thing that
 * makes a content cluster work — so every article was a dead end that could
 * only point outward through the hard-coded CTA at the bottom.
 *
 * This adds links, bold, inline code, ordered lists, sub-headings and
 * blockquotes. Headings get stable ids so sections can be linked directly.
 * Deliberately not a full Markdown implementation: this parses the small,
 * predictable subset the content in lib/blog.ts and the Supabase rows
 * actually use, and nothing more.
 */

/** Turn a heading into a stable, readable anchor id. */
function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/**
 * Inline formatting: [text](href), **bold**, `code`.
 * One pass, so the patterns cannot nest into each other unexpectedly.
 */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const pattern = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|`([^`]+)`/g;
  const out: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) out.push(text.slice(lastIndex, match.index));

    const [, linkText, href, bold, code] = match;
    const key = `${keyPrefix}-${i++}`;

    if (linkText && href) {
      const internal = href.startsWith("/");
      out.push(
        internal ? (
          <Link key={key} href={href} className="font-medium text-brand underline underline-offset-2 hover:text-brand-deep">
            {linkText}
          </Link>
        ) : (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand underline underline-offset-2 hover:text-brand-deep"
          >
            {linkText}
          </a>
        )
      );
    } else if (bold) {
      out.push(
        <strong key={key} className="font-semibold text-ink">
          {bold}
        </strong>
      );
    } else if (code) {
      out.push(
        <code key={key} className="rounded-chip bg-surface-sunken px-1.5 py-0.5 font-mono text-body-sm text-ink">
          {code}
        </code>
      );
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) out.push(text.slice(lastIndex));
  return out;
}

export default function ArticleBody({ content }: { content: string }) {
  const blocks = content.split("\n\n").filter((b) => b.trim().length > 0);

  return (
    <>
      {blocks.map((block, i) => {
        const lines = block.split("\n");

        if (block.startsWith("### ")) {
          const text = block.slice(4);
          return (
            <h3 key={i} id={slugify(text)} className="mt-8 text-title-2 text-ink">
              {renderInline(text, `h3-${i}`)}
            </h3>
          );
        }

        if (block.startsWith("## ")) {
          const text = block.slice(3);
          return (
            <h2 key={i} id={slugify(text)} className="mt-12 text-title-1 text-ink">
              {renderInline(text, `h2-${i}`)}
            </h2>
          );
        }

        if (lines.every((l) => l.startsWith("> "))) {
          return (
            <blockquote
              key={i}
              className="mt-6 border-l-2 border-brand pl-5 text-body-lg italic text-ink"
            >
              {renderInline(lines.map((l) => l.slice(2)).join(" "), `q-${i}`)}
            </blockquote>
          );
        }

        if (lines.every((l) => /^\d+\.\s/.test(l))) {
          return (
            <ol key={i} className="mt-5 border-t border-line-strong">
              {lines.map((line, j) => (
                <li key={j} className="flex items-baseline gap-4 border-b border-line py-3">
                  <span className="w-6 shrink-0 font-mono text-micro text-ink-muted">
                    {String(j + 1).padStart(2, "0")}
                  </span>
                  <span className="text-body-base text-ink-soft">
                    {renderInline(line.replace(/^\d+\.\s/, ""), `ol-${i}-${j}`)}
                  </span>
                </li>
              ))}
            </ol>
          );
        }

        if (lines.every((l) => l.startsWith("- "))) {
          return (
            <ul key={i} className="mt-5 space-y-2.5">
              {lines.map((line, j) => (
                <li key={j} className="flex items-start gap-3 text-body-base leading-relaxed text-ink-soft">
                  <span aria-hidden className="mt-2.5 block size-1.5 shrink-0 rounded-pill bg-brand" />
                  <span>{renderInline(line.slice(2), `ul-${i}-${j}`)}</span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={i} className="mt-5 text-body-lg leading-relaxed text-ink-soft">
            {renderInline(block, `p-${i}`)}
          </p>
        );
      })}
    </>
  );
}
