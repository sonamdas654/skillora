import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// ── Design-system drift guard ────────────────────────────────────────
// The reason the old site drifted into "every section invents its own
// card" is that nothing stopped a className from reaching for an
// arbitrary hex, a raw Tailwind palette colour, or a one-off type size.
// Tokens live in app/styles/theme.css; if a value is missing, the fix is
// to add a token there, not to inline it here.
//
// Starts as `warn` so the migration can land page by page, and is raised
// to `error` once the page migration is complete.
const designTokenSelectors = [
  {
      // bg-[#0e5257], shadow-[0_20px_40px_...], text-[13px], w-[420px]
      selector:
        "JSXAttribute[name.name='className'] > Literal[value=/\\[(#[0-9a-fA-F]{3,8}|[0-9.]+(px|rem)|[0-9]+_)/]",
      message:
        "Arbitrary value in className. Add a token in app/styles/theme.css and use the generated utility instead.",
    },
    {
      // bg-slate-900, text-blue-600, border-emerald-200 …
      selector:
        "JSXAttribute[name.name='className'] > Literal[value=/\\b(slate|gray|zinc|neutral|stone|blue|indigo|emerald|rose|amber|violet|fuchsia|sky|cyan|teal|purple|orange|pink|green|red|lime|yellow)-(50|[1-9]00|950)\\b/]",
      message:
        "Raw Tailwind palette colour. Use a semantic token (bg-canvas, text-ink-soft, border-line, bg-brand, text-signal …).",
    },
    {
      // text-3xl, text-sm … the type scale is display-1…micro
      selector:
        "JSXAttribute[name.name='className'] > Literal[value=/\\btext-(xs|sm|base|lg|xl|[2-9]xl)\\b/]",
    message:
      "Raw Tailwind type size. Use the type scale: text-display-1..3, text-title-1..3, text-body-lg/base/sm, text-label, text-micro.",
  },
];

// ── Motion budget guard ──────────────────────────────────────────────
// The previous build shipped a 50ms setInterval driving React state (20
// re-renders a second, forever, off-screen, with no reduced-motion check).
// A fast timer is almost always a per-frame value that belongs on a ref or
// a CSS custom property — see components/motion/CONTRACT.md and useRafLoop.
const motionSelector = {
  selector: "CallExpression[callee.name='setInterval'] > Literal[value<250]",
  message:
    "setInterval under 250ms. Per-frame work belongs in useRafLoop (IntersectionObserver-gated, tier-aware, writes to refs). See components/motion/CONTRACT.md.",
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    ".tmp_migrate/**",
    "next-env.d.ts",
  ]),
  {
    files: ["app/**/*.tsx", "components/**/*.tsx"],
    ignores: [
      // Concept demos deliberately imitate other people's client sites —
      // they must NOT inherit the Skilloura design system, or they stop
      // reading as separate products.
      "components/demos/**",
      "components/ConceptPreviews.tsx",
      "components/PortfolioMockup.tsx",
      // Private surfaces: not part of the public brand experience.
      "app/admin/**",
      "app/client/**",
    ],
    // ESLint merges by rule name, so a later block configuring
    // no-restricted-syntax REPLACES an earlier one. Both selector sets are
    // therefore listed together here rather than in two blocks.
    rules: {
      "no-restricted-syntax": ["warn", motionSelector, ...designTokenSelectors],
    },
  },
]);

export default eslintConfig;
