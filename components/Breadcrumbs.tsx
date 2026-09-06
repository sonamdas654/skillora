import Link from "next/link";
import JsonLd from "./JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export interface Crumb {
  name: string;
  /** Site-relative path, e.g. "/services/website-development". */
  path: string;
}

/**
 * Visible breadcrumb trail, plus the matching BreadcrumbList JSON-LD.
 *
 * Three routes already emitted breadcrumb structured data and not one of them
 * rendered a trail a person could see or click — Google was being told about a
 * hierarchy the site never showed. Both come from this single list now, so
 * they cannot drift apart.
 *
 * Every crumb carries a path, because the schema wants the full trail
 * including the current page. Only the rendering differs: the last crumb is
 * marked with aria-current instead of being a link to itself.
 */
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  if (items.length < 2) return null;

  return (
    <>
      <JsonLd data={breadcrumbSchema(items)} />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-micro font-mono uppercase text-ink-muted">
          {items.map((item, i) => {
            const last = i === items.length - 1;
            return (
              <li key={item.path} className="flex items-center gap-2">
                {i > 0 && (
                  <span aria-hidden className="text-line-strong">
                    /
                  </span>
                )}
                {last ? (
                  <span aria-current="page" className="text-ink-soft">
                    {item.name}
                  </span>
                ) : (
                  <Link href={item.path} className="transition-colors hover:text-brand">
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
