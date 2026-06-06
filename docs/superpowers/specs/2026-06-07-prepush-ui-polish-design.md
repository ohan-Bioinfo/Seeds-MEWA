# Spec: Pre-push UI polish (footer, cards, menu, logo) + link fixes

**Date:** 2026-06-07
**Status:** Approved (design)

## Context

Before pushing, the dashboard needs a polish pass and a link audit. The link check
surfaced four real issues; alongside fixing them, the user wants a *refined* visual
upgrade (not a redesign) to the footer, the data/stat cards, the menu, and the logo.

**Hard constraint:** visual-only. No layout restructuring, no copy/data/content changes,
no route or feature changes. Numbers, labels, and text stay exactly as they are.

**Style direction:** "Refined polish" within the existing MEWA institutional identity —
soft shadows, hover-lift, subtle accents — not a bold/glass restyle.

## Link-check findings (must fix)

1. **Vision 2030 logo primary URL is dead** — `upload.wikimedia.org/.../Vision2030_logo.svg/...png`
   returns HTTP 400; it only renders via the `onError` fallback to `salogos.b-cdn.net`.
2. **MEWA logos load from `files.manuscdn.com` session-upload URLs** — temporary CDN links
   that can expire (used in `Navigation.tsx` and `Header.tsx`). Reliability risk on push.
3. **`/about` route is orphaned** — defined in `App.tsx` but linked from neither nav nor footer.
4. **Full-page reloads** — footer quick-links use `<a href>` and the Catalog→Fingerprints
   button uses `window.location.href`, instead of client-side (wouter `<Link>`) navigation.

## Design

### 1. Link & reliability fixes
- **`Navigation.tsx` / `PageLayout.tsx`:** make the working `salogos.b-cdn.net` PNG the
  primary Vision 2030 `src` (remove the dead wikimedia URL). Footer keeps the
  `brightness(0) invert(1)` filter so the mark reads white on the green footer.
- **MEWA logo:** download the current `files.manuscdn.com` image once into
  `client/public/mewa-logo.jpg`; reference `/mewa-logo.jpg` in `Navigation.tsx` (and the
  matching asset for `Header.tsx`). Same image, now self-hosted and stable.
- **`PageLayout.tsx` footer:** add an **About** link to Quick Links (→ `/about`).
- **SPA navigation:** convert footer `<a href="/...">` to wouter `<Link href="/...">`; change
  the Catalog→Fingerprints `onClick={() => window.location.href = '/fingerprints'}` to wouter
  navigation (`<Link>` or `useLocation` setter). No full reloads.

### 2. Logo + menu — `client/src/components/Navigation.tsx`
- Logo size `h-14` → `h-16`.
- Nav pills: same 8 items and positions; refine padding + hover transition; active pill keeps
  the green fill with a subtle shadow. Add a faint elevation/accent to the sticky bar.
- Mobile dropdown grid: tighter active/hover states. No items added or removed.

### 3. Data/stat cards — shared treatment
- Add a `.stat-card` utility class in `client/src/index.css`: soft shadow, hover-lift
  (small `translate-y` up + shadow grow on hover), refined border-radius/border, optional thin
  top accent bar driven by the card's existing crop/KPI color.
- Apply the class to the existing stat cards on: **DataCatalog** (crop cards),
  **Home** (KPI cards/tiles), **Centers** (KPI cards), **Inventory** (stat cards).
- Content, counts, and grid layouts unchanged — purely the card chrome.

### 4. Footer — `client/src/components/PageLayout.tsx`
- Slim **mewa-gold accent bar** across the footer top.
- Heading icons + smoother link hover (subtle underline/translate) on the three columns.
- Fix the Vision 2030 logo presentation (no white box; consistent with the fixed src/filter).
- Includes the About link from §1. All footer text unchanged.

## Files touched
- `client/src/components/Navigation.tsx` — logo size, pill/menu refinement, Vision2030 src, local logo.
- `client/src/components/PageLayout.tsx` — footer accent/hover/logo, About link, `<Link>` conversion.
- `client/src/components/Header.tsx` — local logo (if rendered anywhere).
- `client/src/index.css` — `.stat-card` utility.
- `client/src/pages/DataCatalog.tsx`, `Home.tsx`, `Centers.tsx`, `InventoryTracking.tsx` — apply `.stat-card`; fix fingerprints link.
- `client/public/mewa-logo.jpg` (new asset).

## Verification
1. `pnpm check` + `pnpm build` pass.
2. Serve build on `:4173`; before/after screenshots at desktop (1280) and mobile widths for
   nav, a cards page, and the footer.
3. Click-through every nav + footer link and the Catalog→Fingerprints button: all resolve and
   navigate client-side (no full reload); `/about` reachable from the footer.
4. Confirm logos render from the stable sources (local MEWA logo, salogos Vision 2030).
5. 0 console errors.

## Out of scope
- Adding/removing nav items or routes; any text/data/content edits; bold restyle (gradients/glass);
  changes to dialogs, forms, or non-stat cards.
