import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * One social card renderer, used by every route segment's
 * opengraph-image.tsx.
 *
 * Before this, the site had a single card at app/opengraph-image.tsx and
 * every page inherited it, so a link to the pricing page, a service page, a
 * case study and a blog post all previewed as the same picture in WhatsApp,
 * LinkedIn and search. The card also still used the pre-redesign palette —
 * #2857ff on a cool white — which no longer appears anywhere on the site.
 *
 * Both are fixed here: each page passes its own title, and the card is drawn
 * in the Measured Light palette the site actually uses. Nothing is removed;
 * the root card stays as the fallback for anything without its own.
 *
 * Deliberately no custom font. ImageResponse has to fetch and parse any font
 * it is given at request time, and a failure there returns a broken image
 * rather than a plain one. The system sans is what the existing card has
 * always used and it renders everywhere.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/* Read straight from app/styles/palette.css so the card cannot drift from
   the site the way the old one did. */
const BONE = "#f7f3ea";
const BONE_DEEP = "#ece6da";
const PETROL = "#0e5257";
const INK = "#15191b";
const INK_SOFT = "#3b4247";
const AURA = "#e0913f";
const SIGNAL = "#a8dc1e";

export async function renderOgImage({
  eyebrow,
  title,
  note,
}: {
  /** Mono micro-label: the section this page belongs to. */
  eyebrow: string;
  /** The page's own title. This is the whole point of the card. */
  title: string;
  /** Optional single line under the rule — a price, a count, a promise. */
  note?: string;
}) {
  const markBuffer = await readFile(join(process.cwd(), "public", "logo-mark.png"));
  const markSrc = `data:image/png;base64,${markBuffer.toString("base64")}`;

  // Long service and blog titles are common; step the size down rather than
  // letting a heading wrap to four lines and collide with the footer row.
  const size = title.length > 68 ? 54 : title.length > 42 ? 66 : 78;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "68px 72px",
          background: `linear-gradient(135deg, ${BONE} 0%, ${BONE_DEEP} 100%)`,
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* The aura: one warm light from the upper left, the same direction
            every shadow on the site falls. */}
        <div
          style={{
            position: "absolute",
            top: -220,
            left: -160,
            width: 760,
            height: 640,
            borderRadius: 9999,
            background: `radial-gradient(circle, ${AURA}3d, ${AURA}00 70%)`,
            display: "flex",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ display: "flex", width: 3, height: 26, background: PETROL }} />
            <div
              style={{
                display: "flex",
                fontSize: 21,
                fontWeight: 700,
                letterSpacing: 5,
                textTransform: "uppercase",
                color: PETROL,
              }}
            >
              {eyebrow}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 30,
              fontSize: size,
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: -2,
              color: INK,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>

          {note && (
            <div
              style={{
                display: "flex",
                marginTop: 26,
                fontSize: 28,
                color: INK_SOFT,
                maxWidth: 900,
              }}
            >
              {note}
            </div>
          )}
        </div>

        {/* The scope line: a measured rule with a tick, the site's own motif. */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", height: 2, width: 64, background: SIGNAL }} />
            <div style={{ display: "flex", height: 1, flex: 1, background: `${INK}24` }} />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 26,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {/* next/image cannot run inside ImageResponse — a plain img is required */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={markSrc} alt="" width={54} height={54} style={{ display: "flex" }} />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{ display: "flex", fontSize: 34, fontWeight: 800, color: INK, letterSpacing: -1 }}
                >
                  Skilloura
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: 15,
                    fontWeight: 700,
                    letterSpacing: 4,
                    color: INK_SOFT,
                  }}
                >
                  SMART DIGITAL SERVICES
                </div>
              </div>
            </div>

            <div style={{ display: "flex", fontSize: 22, fontWeight: 600, color: PETROL }}>
              skilloura.com
            </div>
          </div>
        </div>
      </div>
    ),
    OG_SIZE
  );
}
