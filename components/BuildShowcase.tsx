import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/Icons";
import Reveal from "@/components/Reveal";
import { buildTiles } from "@/lib/buildShowcase";
import { serviceCategories } from "@/lib/services";

/**
 * "What we build" — one editorial column, then the work itself.
 *
 * What was here before: seven light cards, each a tinted icon square, a price
 * and two buttons. It was tidy and it was also the most template-shaped thing
 * on the page — the icon/heading/paragraph/button grid every agency site
 * ships — and a large part of why the site read as too white.
 *
 * The change is not a restyle. It is a change of evidence: instead of an icon
 * standing in for the work, each tile is a photograph of the work, taken from
 * a page the visitor can open. lib/buildShowcase.ts holds that mapping and
 * throws at build time rather than dropping a card if a picture goes missing.
 *
 * The shape follows the reference the owner approved: the heading is a left
 * column carrying the price entry point rather than a centred banner, and
 * each label sits *under* its picture on the warm ground rather than inside
 * a dark panel. That keeps the pictures unbroken and stops every tile from
 * being a small self-contained advert.
 *
 * Nothing here is a second copy: name, outcome and price all come from
 * lib/services.ts, the same source the service pages read.
 */
export default function BuildShowcase() {
  const websites = serviceCategories.find((s) => s.slug === "website-development");

  return (
    <div className="grid gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,17rem)_1fr]">
      <Reveal>
        <div className="lg:sticky lg:top-28">
          <p className="flex items-center gap-2.5 font-mono text-micro uppercase text-ink-soft">
            <span aria-hidden className="block h-2.5 w-px bg-brand" />
            What we build
          </p>
          <h2 className="mt-4 text-display-3 text-ink">
            One studio.
            <span className="mt-1 block font-accent font-normal italic text-accent">
              Your entire digital build.
            </span>
          </h2>

          {websites && (
            <>
              <hr className="mt-7 w-16 border-0 border-t border-line-strong" />
              <p className="mt-5 font-mono text-body-base text-ink">
                Websites from {websites.startingPrice}
              </p>
              <p className="mt-1 text-body-sm text-ink-soft">
                Final quote after scope review.
              </p>
            </>
          )}

          <Link
            href="/pricing"
            className="group mt-5 tap-safe inline-flex items-center gap-2 text-body-sm font-semibold text-brand"
          >
            View pricing
            <Icon
              name="arrow"
              className="size-4 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </Reveal>

      <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {buildTiles.map((tile, i) => (
          <Reveal key={tile.slug} variant="lift" delay={Math.min(i * 0.05, 0.25)}>
            <Link href={`/services/${tile.slug}`} className="group flex h-full flex-col">
              {/* The picture is matted, not just bordered. Most of these
                  demos are light-UI, and once the label moved out onto the
                  warm ground a hairline border left the whole band pale
                  again — which is the note this section exists to answer.
                  A few pixels of ink around each one gives seven mixed
                  screenshots a common frame and keeps the band weighted. */}
              <div className="overflow-hidden rounded-card border border-line-on-ink bg-surface-ink p-2 shadow-e2">
                <div className="relative aspect-[16/11] overflow-hidden rounded-chip">
                  <Image
                    src={tile.image.src}
                    alt={`${tile.name} — a build you can open and try`}
                    fill
                    // Four across at xl, three at lg, two at sm. Getting this
                    // wrong is the usual way a grid of screenshots quietly
                    // ships several times the bytes it needs.
                    sizes="(min-width: 1280px) 19vw, (min-width: 1024px) 25vw, (min-width: 640px) 44vw, 92vw"
                    placeholder={tile.blurDataURL ? "blur" : "empty"}
                    blurDataURL={tile.blurDataURL}
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-baseline gap-2.5">
                <h3 className="font-display text-title-2 text-ink">{tile.name}</h3>
                <span
                  aria-hidden
                  className="ml-auto mt-1 size-1.5 shrink-0 rounded-pill bg-signal-deep"
                />
              </div>
              <p className="mt-1.5 text-body-sm text-ink-soft">{tile.outcome}</p>
              {/* mt-auto so the prices line up across a row instead of
                  following each description's ragged bottom edge. */}
              <p className="mt-auto pt-3 font-mono text-micro uppercase text-ink-muted transition-colors group-hover:text-brand">
                From {tile.startingPrice}
              </p>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
