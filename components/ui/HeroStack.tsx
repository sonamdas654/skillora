import Link from "next/link";
import Icon from "@/components/Icons";
import "./HeroStack.css";

export interface HeroStackCard {
  /** A name from components/Icons.tsx. */
  icon: string;
  title: string;
  body: string;
  /** Internal route. A card with one becomes a link; without, it is a panel. */
  href?: string;
  /** Call to action, shown on the front card only. Defaults per page. */
  cta?: string;
}

/**
 * The angled card stack on the right of an inner-page hero.
 *
 * Three cards fanned back and to the right: the front one square to the page
 * and carrying the call to action, the other two rotated and dropped behind it.
 *
 * The shape is shared across every inner page; the contents never are. Each
 * page passes cards built from its own real data — service categories, industry
 * solutions, published posts — so the heroes read as one family without any two
 * of them saying the same thing. Nothing here invents content: if a page has no
 * three things worth showing, it passes fewer, or no stack at all.
 *
 * Server component on purpose. It holds no state, and a hero that ships
 * JavaScript to render three static cards is a hero that costs more than it is
 * worth. The lift on hover is CSS.
 */
export default function HeroStack({
  cards,
  spark = true,
}: {
  cards: HeroStackCard[];
  spark?: boolean;
}) {
  if (cards.length === 0) return null;

  return (
    <div className="hstack">
      {spark && (
        <svg
          className="hstack__spark"
          width="34"
          height="30"
          viewBox="0 0 34 30"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden
        >
          <path d="M17 2v7M28 6l-4.5 5.5M6 6l4.5 5.5" />
        </svg>
      )}

      <div className="hstack__row">
        {cards.slice(0, 3).map((card, i) => {
          const inner = (
            <>
              <span className="hstack__icon" aria-hidden>
                <Icon name={card.icon} className={i === 0 ? "size-6" : "size-5"} />
              </span>
              <p className="hstack__title">{card.title}</p>
              <p className="hstack__body">{card.body}</p>
              {i === 0 && card.href && (
                <span className="hstack__foot">
                  {card.cta ?? "Explore this service"}
                  <Icon name="arrow" className="size-4" />
                </span>
              )}
              {i > 0 && card.href && (
                <span className="hstack__foot" aria-hidden>
                  <Icon name="arrow" className="size-4" />
                </span>
              )}
            </>
          );

          return card.href ? (
            <Link key={card.title} href={card.href} className="hstack__card">
              {inner}
            </Link>
          ) : (
            <div key={card.title} className="hstack__card">
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
}
