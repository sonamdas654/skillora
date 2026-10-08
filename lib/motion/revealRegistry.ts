"use client";

import { REVEAL_FAILSAFE_MS } from "./tokens";

/**
 * One IntersectionObserver for every reveal on the page.
 *
 * The old implementation gave each <Reveal> its own observer via
 * framer-motion's whileInView — 83 call sites meant up to 83 observers. This
 * is one, shared, with a registry.
 *
 * Safety model, in order of importance:
 *
 *  1. No JS at all -> the inline script never sets data-motion, so nothing is
 *     ever hidden and the page reads perfectly.
 *  2. JS runs but hydration fails -> the inline script's own failsafe clears
 *     data-motion after REVEAL_FAILSAFE_MS and everything becomes visible.
 *  3. Observer runs but never fires for an element (odd layouts, print,
 *     reader mode) -> the same failsafe catches it.
 *
 * Content is never permanently invisible. That was a real defect in the
 * previous setup: a full-page screenshot showed every below-the-fold section
 * as blank, and print/reader mode would have done the same to real visitors.
 */

const REVEAL_ATTR = "data-reveal";
const DONE_ATTR = "data-reveal-done";

let observer: IntersectionObserver | null = null;
let mutationObserver: MutationObserver | null = null;
let failsafeTimer: ReturnType<typeof setTimeout> | null = null;
let refCount = 0;

function markDone(el: Element) {
  el.setAttribute(DONE_ATTR, "");
  observer?.unobserve(el);
}

function scan(root: ParentNode = document) {
  root.querySelectorAll(`[${REVEAL_ATTR}]:not([${DONE_ATTR}])`).forEach((el) => {
    observer?.observe(el);
  });
}

function revealEverything() {
  document
    .querySelectorAll(`[${REVEAL_ATTR}]:not([${DONE_ATTR}])`)
    .forEach((el) => el.setAttribute(DONE_ATTR, ""));
}

/**
 * Starts the shared observer. Returns a teardown function.
 * Safe to call more than once; the registry is reference-counted.
 */
export function startRevealRegistry(): () => void {
  refCount += 1;

  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) markDone(entry.target);
        }
      },
      // A little earlier than the viewport edge, so the animation is already
      // underway by the time the section is properly on screen.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.01 }
    );

    // App Router swaps content without a page load, so watch for reveals that
    // appear after the initial scan.
    mutationObserver = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node.nodeType !== 1) continue;
          const el = node as Element;
          if (el.hasAttribute(REVEAL_ATTR)) observer?.observe(el);
          scan(el);
        }
      }
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    scan();

    // Belt and braces: whatever happens, nothing stays invisible.
    failsafeTimer = setTimeout(revealEverything, REVEAL_FAILSAFE_MS);
  }

  return () => {
    refCount -= 1;
    if (refCount > 0) return;

    observer?.disconnect();
    mutationObserver?.disconnect();
    if (failsafeTimer) clearTimeout(failsafeTimer);
    observer = null;
    mutationObserver = null;
    failsafeTimer = null;
  };
}

/** Used when the motion tier drops to `off`/`reduced` mid-session. */
export function disableReveals() {
  revealEverything();
  document.documentElement.removeAttribute("data-motion");
}
