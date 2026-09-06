// Hero footage manifest.
//
// The hero video is not stock and not a canvas fake — it is Skilloura's own
// work, filmed. Every scene below points at a real, prerendered route in this
// repo that a visitor can open for themselves. That is the whole argument of
// the hero: "these are not screenshots, open them."
//
// Re-run `npm run video:build` whenever a demo changes and the footage
// follows automatically.

/** Ease a scroll rather than jumping — a hard scroll reads as a glitch on film. */
async function glide(page, toY, ms) {
  await page.evaluate(
    async ([target, duration]) => {
      const startY = window.scrollY;
      const delta = target - startY;
      const start = performance.now();
      // easeInOutCubic
      const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
      await new Promise((resolve) => {
        const step = (now) => {
          const t = Math.min((now - start) / duration, 1);
          window.scrollTo(0, startY + delta * ease(t));
          if (t < 1) requestAnimationFrame(step);
          else resolve();
        };
        requestAnimationFrame(step);
      });
    },
    [toY, ms]
  );
}

/** Hover the first match, if it exists. Never throws — demos differ. */
async function touch(page, selector, holdMs = 700) {
  const el = page.locator(selector).first();
  if ((await el.count()) === 0) return;
  try {
    await el.scrollIntoViewIfNeeded({ timeout: 1500 });
    await el.hover({ timeout: 1500 });
    await page.waitForTimeout(holdMs);
  } catch {
    /* the shot still works without the hover beat */
  }
}

const settle = (page, ms) => page.waitForTimeout(ms);

export const SCENES = [
  {
    id: "local",
    route: "/demo/web-local",
    label: "Local business website",
    caption: "Local business site — menu, ordering and enquiries in one place.",
    serviceSlug: "website-development",
    posterAtMs: 1200,
    async choreograph(page) {
      await settle(page, 1100);
      await glide(page, 700, 2600);
      await touch(page, "a, button");
      await glide(page, 1500, 2400);
      await settle(page, 900);
    },
  },
  {
    id: "commerce",
    route: "/demo/web-ecommerce",
    label: "Ecommerce store",
    caption: "Ecommerce — catalogue, cart and checkout, commission-free.",
    serviceSlug: "website-development",
    posterAtMs: 1400,
    async choreograph(page) {
      await settle(page, 1000);
      await glide(page, 600, 2400);
      await touch(page, "[class*='grid'] a, [class*='grid'] button");
      await glide(page, 1400, 2400);
      await settle(page, 900);
    },
  },
  {
    id: "ai",
    route: "/demo/ai-support",
    label: "AI support agent",
    caption: "AI support agent answering customer questions around the clock.",
    serviceSlug: "ai-automation",
    posterAtMs: 1600,
    async choreograph(page) {
      // The chatbot demo animates its own conversation, so hold and let it run.
      await settle(page, 3400);
      await glide(page, 520, 2200);
      await settle(page, 1600);
    },
  },
  {
    id: "dashboard",
    route: "/demo/dash-sales",
    label: "Sales dashboard",
    caption: "Live sales dashboard built from the spreadsheets a business already keeps.",
    serviceSlug: "data-dashboard",
    posterAtMs: 1300,
    async choreograph(page) {
      await settle(page, 1100);
      await glide(page, 560, 2400);
      await touch(page, "table tr, [class*='card']");
      await glide(page, 1200, 2200);
      await settle(page, 900);
    },
  },
  {
    id: "app",
    route: "/demo/app-booking",
    label: "Booking app",
    caption: "Booking app — slots, reminders and repeat customers.",
    serviceSlug: "mobile-app-development",
    posterAtMs: 1500,
    async choreograph(page) {
      await settle(page, 1200);
      await glide(page, 640, 2600);
      await touch(page, "button, a");
      await glide(page, 1300, 2200);
      await settle(page, 900);
    },
  },
];

/**
 * Site chrome is not product footage. The concept banner and the closing CTA
 * belong to Skilloura, not to the demo being filmed, so they are hidden for
 * the take. The honesty they carry is preserved: every hero scene ships with
 * a visible "concept build" caption of its own.
 */
export const HIDE_CHROME_CSS = `
  /* Targeted by intent, not by class. The first version matched utility
     classes on DemoChrome and silently stopped working the moment that
     component was restyled — which would have put Skilloura's own banner
     back into the product footage with no error anywhere. */
  [data-demo-chrome] { display: none !important; }
  * { scrollbar-width: none !important; }
  *::-webkit-scrollbar { display: none !important; }
  /* Stop caret blink and focus rings appearing mid-take. */
  * { caret-color: transparent !important; }
  *:focus-visible { outline: none !important; }
`;

export const RECORD_SIZE = { width: 1440, height: 810 };
