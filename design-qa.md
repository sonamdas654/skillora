# Hero design QA

- Source visual truth: `C:\Users\nigam\AppData\Local\Temp\codex-clipboard-2a4c78a9-1974-487e-a2a0-bdfba8ba888d.png`
- Implementation: `http://localhost:3101/`
- Browser evidence: Codex in-app Browser capture attached to the current task
- Viewport: 1673 × 942 CSS px, device scale factor 1
- Source pixels: 1673 × 942
- Implementation CSS size: 1674 × 942 (browser scrollbar accounts for the one-pixel difference)
- State: desktop homepage, hero at page top

**Full-view comparison evidence**

The reference and implementation were inspected at the same desktop viewport. Both use the same warm editorial canvas, left-aligned proposition, gradient script phrase, paired CTAs, trust row, large front project panel, layered rear project panels, handwritten annotations, floating project-category rail, and three proof metrics. The implementation uses the project's real interactive build carousel inside the front panel.

**Focused-region comparison evidence**

- Typography: the first pass created an orphaned “a” line in the headline. The left track and heading width were corrected; the final render now follows the reference's two-line display-heading rhythm followed by the script line.
- Stage: the first pass made the front panel too wide and pushed the rear panels off-screen. The grid ratio, stage offset, and panel width were corrected; the final render keeps the front panel prominent and exposes the layered screens.
- Mobile: checked at 390 × 844. The two CTAs remain full-width, trust points wrap cleanly, the stage follows the copy, and document width has no horizontal overflow (390 viewport / 375 document content width due to browser scrollbar).

**Required fidelity surfaces**

- Fonts and typography: passed. Existing Instrument Sans, Instrument Serif and JetBrains Mono preserve the reference hierarchy and editorial contrast.
- Spacing and layout rhythm: passed. Desktop composition, CTA spacing, trust row, proof rail, stage overlap and mobile stacking match the source structure.
- Colors and visual tokens: passed. Warm cream surfaces, petrol CTA, lime status, orange-to-pink script accent, and soft peach lighting match the source palette.
- Image quality and asset fidelity: passed. All project screens use the project's real WebP poster assets; the main screen retains the working video carousel.
- Copy and content: passed. Hero headline, scope promise, CTAs, trust claims, category labels and proof metrics match the selected target.

**Interaction checks**

- “Get my written scope” resolves to `/start-project`.
- Carousel next control changed the active build from Sales Dashboard to Booking App.
- WhatsApp CTA remains a real external link.
- TypeScript and focused ESLint checks passed.

**Comparison history**

1. P1: front panel too wide and rear project stack clipped. Fixed grid proportions and panel sizing.
2. P1: display heading wrapped with an orphaned final word. Fixed heading width and desktop type size.
3. P2: trust/value evidence missing from the earlier running server. Started the current project on port 3101 and verified the correct build.

**Follow-up polish**

- Existing site-wide motion bootstrap produces a development-only hydration warning because it adds reveal attributes before React hydrates. This predates the hero change and does not change the rendered hero.

final result: passed

## Cinematic composition revision 2

- Target: `C:\Users\nigam\AppData\Local\Temp\codex-clipboard-df517905-26f5-4857-8f93-ce9ee091410b.png`
- Live state: `http://localhost:3101/?cinematic=6#how-it-runs`
- New environment asset: `public/cinematic-process-office-v2.png`
- Desktop comparison viewport: 1440 × 900
- Mobile verification viewport: 390 × 844

The separate portrait layer and desktop white information panel were removed. The founder is now rendered within the same photographic office scene, sharing its light, chair, desk, reflections and depth. Desktop composition follows the target’s left narrative / central founder / right glass stack / bottom service rail proportions. Service content remains editable HTML and all links remain functional. Mobile switches to a readable stacked treatment without horizontal overflow (390 viewport, 375 document width after scrollbar).

final result: passed

---

# Cinematic “How this actually runs” design QA

- Source visual truth: `C:\Users\nigam\AppData\Local\Temp\codex-clipboard-f853d15d-fdd8-4718-ae80-1a5e207956c0.png`
- Implementation: `http://localhost:3101/?cinematic=5#how-it-runs`
- Implementation capture: Codex in-app browser live capture in the current task
- Checked viewports: 1200 × 800, 768 × 1024 and 390 × 844 CSS px

**Combined visual comparison**

The source and live implementation were reviewed together for composition, depth, lighting, material response and density. The implementation now has a full-width warm office/studio environment, a seated founder integrated at the visual center, editable delivery copy at left, four dimensional glass service cards at right, a physical-looking service rail across the desk plane, warm reflections, contact shadows, plants, shelves, skyline depth and handwritten accents. The source image itself is not used as a webpage asset.

**Required fidelity surfaces**

- Composition and spatial hierarchy: passed. Left narrative, central human subject, right service stack and bottom service rail follow the target structure.
- Cinematic richness: passed. A generated original environment plate supplies realistic materials and lighting while all copy, cards, icons and links remain native HTML/CSS components.
- Content: passed. “How this actually runs” and its four delivery stages are preserved; the old 20+ / 50+ / 24h / 100% impact row is removed.
- Interaction: passed. Service cards and rail items link to live service pages; hover depth, pointer parallax and scroll parallax are enabled for full-motion devices and disabled for reduced-motion users.
- Responsive behavior: passed. Desktop preserves the full cinematic composition; tablet uses a readable two-column card layout; mobile uses a single-column hierarchy. Document width remained within the viewport at all three checks.
- Header isolation: passed. The navbar was not modified.
- Browser console: passed after compact-browser WebGL fallback; no errors remained in the final responsive checks.
- Code quality: passed. TypeScript and ESLint completed with zero errors.

final result: passed
