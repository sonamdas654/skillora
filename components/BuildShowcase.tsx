import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/Icons";
import Reveal from "@/components/Reveal";
import { buildTiles } from "@/lib/buildShowcase";

/**
 * "What we build" — one dark band, seven real screenshots.
 *
 * What was here before: seven light cards, each a rounded panel with a small
 * tinted icon square, a price and two buttons. It was tidy and it was also
 * the single most template-looking thing on the homepage — the exact "icon +
 * heading + paragraph + button" grid every agency site ships, and a large
 * part of why the owner said the site read as too white.
 *
 * The change is not a restyle of those cards. It is a change of evidence:
 * instead of an icon standing in for the work, each tile is a photograph of
 * the work, taken from a page the visitor can open. lib/buildShowcase.ts is
 * where that mapping lives, and it throws at build time rather than dropping
 * a card if a picture ever goes missing.
 *
 * The tiles are ink, not warm — that is what carries the brand's petrol into
 * a section that used to be a field of white, and it also gives seven
 * light-UI screenshots a frame to sit in so they read as products rather
 * than as washed-out rectangles.
 *
 * Nothing here is a second copy of anything: the name, outcome and price all
 * come from lib/services.ts, the same source the service pages read.
 */
export default function BuildShowcase() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {buildTiles.map((tile, i) => (
        <Reveal
          key={tile.slug}
          variant="lift"
          delay={Math.min(i * 0.05, 0.25)}
          // The flagship build leads and takes two columns; the rest follow.
          className={i === 0 ? "lg:col-span-2" : undefined}
        >
          <Link
            href={`/services/${tile.slug}`}
            className="card-lift group flex h-full flex-col overflow-hidden rounded-panel border border-line-on-ink bg-surface-ink"
          >
            {/* The lead tile is twice as wide from lg up, so it needs twice
                the aspect ratio or its picture stands a head taller than the
                two beside it and the row stops reading as a row. */}
            <div
              className={`relative overflow-hidden bg-surface-ink-raised ${
                i === 0 ? "aspect-[16/10] lg:aspect-[32/10]" : "aspect-[16/10]"
              }`}
            >
              <Image
                src={tile.image.src}
                alt={`${tile.name} — a build you can open and try`}
                fill
                // The first tile is double width from lg up; the rest are a
                // quarter of the container. Getting this wrong is the usual
                // way a grid of screenshots quietly ships 4x the bytes.
                sizes={
                  i === 0
                    ? "(min-width: 1024px) 42vw, (min-width: 640px) 50vw, 100vw"
                    : "(min-width: 1024px) 21vw, (min-width: 640px) 50vw, 100vw"
                }
                placeholder={tile.blurDataURL ? "blur" : "empty"}
                blurDataURL={tile.blurDataURL}
                className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
              />
              {/* Warms the top edge so a cool screenshot still belongs to
                  this palette. Decoration only — never over the label. */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface-ink/45 to-transparent" />
            </div>

            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-title-2 text-on-ink">{tile.name}</h3>
                <span className="shrink-0 font-mono text-body-sm text-signal">
                  {tile.startingPrice}
                </span>
              </div>
              <p className="mt-2 text-body-sm text-on-ink-soft">{tile.outcome}</p>
              <span className="mt-auto inline-flex items-center gap-2 pt-5 font-mono text-micro uppercase tracking-wide text-on-ink-muted transition-colors group-hover:text-signal">
                See what is included
                <Icon name="arrow" className="size-3.5" />
              </span>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
