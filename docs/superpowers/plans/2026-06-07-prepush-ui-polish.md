# Pre-push UI Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refined visual polish (footer, data/stat cards, menu, bigger logo) plus four link/reliability fixes, before pushing — visual-only, no content changes.

**Architecture:** Targeted edits to `Navigation.tsx` and `PageLayout.tsx`, a shared `.stat-card` CSS utility in `index.css` applied to existing stat cards on four pages, one SPA-nav fix in `DataCatalog.tsx`, and self-hosting the two header logos under `client/public/`. No layout, route, or copy changes.

**Tech Stack:** React 19, TypeScript, Tailwind v4, wouter routing, Vite. No test framework in use — verification is `pnpm check` + `pnpm build` + browser screenshots on the static server (`PORT=4173 pnpm start`).

**Note:** `client/src/components/Header.tsx` is unused (imported nowhere) — do NOT modify it.

**Verification convention (every task):** after edits run `pnpm check` (expect no TS errors) and `pnpm build` (expect "built in"). Visual confirmation happens in Task 6.

---

### Task 1: Self-host logos under client/public

**Files:**
- Create: `client/public/mewa-logo.jpg`, `client/public/vision2030.png`

- [ ] **Step 1: Download the current logos to local assets**

```bash
cd /home/emz/mega_disk/Seeds-MEWA
curl -L -o client/public/mewa-logo.jpg "https://files.manuscdn.com/user_upload_by_module/session_file/310519663143815567/GepFqmryaNTsXTiv.jpg"
curl -L -o client/public/vision2030.png "https://salogos.b-cdn.net/logos/png/1774895139386-ffizo9wl.png"
```

- [ ] **Step 2: Verify both files exist and are non-empty images**

Run: `file client/public/mewa-logo.jpg client/public/vision2030.png && ls -l client/public/mewa-logo.jpg client/public/vision2030.png`
Expected: both reported as JPEG/PNG image data, size > 1KB.

- [ ] **Step 3: Commit**

```bash
git add client/public/mewa-logo.jpg client/public/vision2030.png
git commit -m "chore: self-host MEWA + Vision 2030 logos (replace fragile CDN urls)"
```

---

### Task 2: Navigation — bigger logo, local/stable logo srcs, refined pills + bar

**Files:**
- Modify: `client/src/components/Navigation.tsx`

- [ ] **Step 1: Point the MEWA logo at the local asset and enlarge it**

Replace the logo `<img>` (currently `src="https://files.manuscdn.com/.../GepFqmryaNTsXTiv.jpg"` … `className="h-14 w-auto"`) with:

```tsx
<img
  src="/mewa-logo.jpg"
  alt="MEWA Logo"
  className="h-16 w-auto rounded-md"
/>
```

- [ ] **Step 2: Make Vision 2030 use the local asset with remote fallback**

Replace the desktop Vision 2030 `<img>` block with:

```tsx
<img
  src="/vision2030.png"
  alt="Vision 2030"
  className="h-9 w-auto"
  onError={(e) => { (e.target as HTMLImageElement).src = 'https://salogos.b-cdn.net/logos/png/1774895139386-ffizo9wl.png'; }}
/>
```

- [ ] **Step 3: Add a subtle elevation accent to the sticky bar**

Change the `<nav>` opening tag className from
`"bg-white border-b border-border sticky top-0 z-50 shadow-sm"` to:

```tsx
className="bg-white/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-sm"
```

- [ ] **Step 4: Refine the desktop nav pills**

In the desktop `navItems.map(...)` `<Link>`, change its className template's inactive/active branch and base so it reads:

```tsx
className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-[15px] font-medium transition-all duration-200 whitespace-nowrap ${
  isActive
    ? "bg-primary text-primary-foreground shadow-sm"
    : "text-foreground hover:bg-secondary hover:text-primary"
} ${isRTL ? "flex-row-reverse" : ""}`}
```

- [ ] **Step 5: Refine the mobile dropdown active/hover state**

In the mobile `navItems.map(...)` `<Link>`, change its className branch to match the desktop treatment:

```tsx
className={`flex items-center gap-2.5 px-4 py-3.5 rounded-lg text-base font-medium transition-all ${
  isActive
    ? "bg-primary text-primary-foreground shadow-sm"
    : "text-foreground hover:bg-secondary hover:text-primary"
} ${isRTL ? "flex-row-reverse" : ""}`}
```

- [ ] **Step 6: Verify + commit**

Run: `pnpm check && pnpm build 2>&1 | tail -2`
Expected: no TS errors; "built in".

```bash
git add client/src/components/Navigation.tsx
git commit -m "feat: bigger logo, stable logo srcs, refined nav pills + bar"
```

---

### Task 3: Footer — accent bar, hover polish, SPA links, About link, logo fix

**Files:**
- Modify: `client/src/components/PageLayout.tsx`

- [ ] **Step 1: Import wouter Link**

Add to the imports at the top:

```tsx
import { Link } from "wouter";
```

- [ ] **Step 2: Add a gold accent bar at the top of the footer**

Change the `<footer ...>` opening so its first child is an accent bar. Replace:

```tsx
<footer className="bg-primary text-primary-foreground mt-auto" dir={dir}>
  <div className="container py-8">
```

with:

```tsx
<footer className="bg-primary text-primary-foreground mt-auto" dir={dir}>
  <div className="h-1 w-full bg-gradient-to-r from-[var(--mewa-gold)] via-[var(--mewa-gold)]/60 to-transparent" />
  <div className="container py-8">
```

- [ ] **Step 3: Convert the four Quick-Links and the Contact-Form link to wouter `<Link>`, add hover translate, and add an About link**

Replace the Quick links `<ul>` block with:

```tsx
<ul className="space-y-2 text-sm text-primary-foreground/80">
  <li><Link href="/catalog" className="inline-block hover:text-primary-foreground hover:translate-x-0.5 rtl:hover:-translate-x-0.5 transition-all">{t("nav.catalog")}</Link></li>
  <li><Link href="/genomics" className="inline-block hover:text-primary-foreground hover:translate-x-0.5 rtl:hover:-translate-x-0.5 transition-all">{t("nav.genomics")}</Link></li>
  <li><Link href="/centers" className="inline-block hover:text-primary-foreground hover:translate-x-0.5 rtl:hover:-translate-x-0.5 transition-all">{t("nav.centers")}</Link></li>
  <li><Link href="/research" className="inline-block hover:text-primary-foreground hover:translate-x-0.5 rtl:hover:-translate-x-0.5 transition-all">{t("nav.research")}</Link></li>
  <li><Link href="/about" className="inline-block hover:text-primary-foreground hover:translate-x-0.5 rtl:hover:-translate-x-0.5 transition-all">{t("nav.about")}</Link></li>
</ul>
```

And replace the Contact `<a href="/contact" ...>` with:

```tsx
<Link href="/contact" className="inline-block hover:text-primary-foreground hover:translate-x-0.5 rtl:hover:-translate-x-0.5 transition-all">{t("footer.contactForm")}</Link>
```

- [ ] **Step 4: Point the footer Vision 2030 logo at the local asset**

Replace the footer brand `<img ...>` with:

```tsx
<img
  src="/vision2030.png"
  alt="Vision 2030"
  className="h-10 w-auto mt-4"
  style={{ filter: 'brightness(0) invert(1)' }}
  onError={(e) => { (e.target as HTMLImageElement).src = 'https://salogos.b-cdn.net/logos/png/1774895139386-ffizo9wl.png'; }}
/>
```

- [ ] **Step 5: Add the `nav.about` translation key (en + ar) if missing**

In `client/src/contexts/LanguageContext.tsx`, in the English block near the other `nav.*` keys add:
```ts
'nav.about': 'About',
```
and in the Arabic block:
```ts
'nav.about': 'عن المركز',
```
(Skip if a `nav.about` key already exists — check first with `grep -n "nav.about" client/src/contexts/LanguageContext.tsx`.)

- [ ] **Step 6: Verify + commit**

Run: `pnpm check && pnpm build 2>&1 | tail -2`
Expected: no TS errors; "built in".

```bash
git add client/src/components/PageLayout.tsx client/src/contexts/LanguageContext.tsx
git commit -m "feat: footer accent bar, SPA links, About link, hover polish, local logo"
```

---

### Task 4: DataCatalog — fingerprints button uses SPA navigation

**Files:**
- Modify: `client/src/pages/DataCatalog.tsx`

- [ ] **Step 1: Import useLocation from wouter**

Add to imports:

```tsx
import { useLocation } from "wouter";
```

- [ ] **Step 2: Get the navigation setter inside the component**

Just after `const { t, dir } = useLanguage();`, add:

```tsx
const [, navigate] = useLocation();
```

- [ ] **Step 3: Replace the full-reload onClick**

Change `onClick={() => window.location.href = '/fingerprints'}` to:

```tsx
onClick={() => navigate('/fingerprints')}
```

- [ ] **Step 4: Verify + commit**

Run: `pnpm check && pnpm build 2>&1 | tail -2`
Expected: no TS errors; "built in".

```bash
git add client/src/pages/DataCatalog.tsx
git commit -m "fix: catalog fingerprints button uses client-side navigation"
```

---

### Task 5: Shared `.stat-card` utility + apply to stat cards

**Files:**
- Modify: `client/src/index.css`, `client/src/pages/DataCatalog.tsx`, `client/src/pages/Home.tsx`, `client/src/pages/Centers.tsx`, `client/src/pages/InventoryTracking.tsx`

- [ ] **Step 1: Add the `.stat-card` utility**

Append to the end of `client/src/index.css`:

```css
/* Refined stat/KPI card: soft shadow + hover lift (visual-only) */
.stat-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 1px 3px rgba(11, 95, 58, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
}
.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 24px -8px rgba(11, 95, 58, 0.18), 0 4px 8px rgba(0, 0, 0, 0.05);
}
```

- [ ] **Step 2: Apply to DataCatalog crop cards**

In `client/src/pages/DataCatalog.tsx`, change the crop card `<Card key={crop} className="border-primary/20">` to:

```tsx
<Card key={crop} className="stat-card border-primary/20 border-t-2" style={{ borderTopColor: CROP_META[crop].color }}>
```

- [ ] **Step 3: Apply to Home KPI cards**

In `client/src/pages/Home.tsx` inside `KpiCard`, change the card className
`"relative overflow-hidden group hover:shadow-lg transition-shadow duration-300"` to:

```tsx
className="stat-card relative overflow-hidden group"
```

- [ ] **Step 4: Apply to Centers KPI cards**

In `client/src/pages/Centers.tsx` inside `KpiCard`, change
`<Card className="relative border-primary/15 bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">` to:

```tsx
<Card className="stat-card relative border-primary/15 bg-card/80 backdrop-blur-sm">
```

- [ ] **Step 5: Apply to the four Inventory stat cards**

In `client/src/pages/InventoryTracking.tsx`, add `stat-card ` to the front of the className on each of the four KPI cards at the top of the page:
- `<Card className="p-6 border-2 border-green-200 bg-white">` → `<Card className="stat-card p-6 border-2 border-green-200 bg-white">`
- `<Card className="p-6 border-2 border-amber-200 bg-white">` → `<Card className="stat-card p-6 border-2 border-amber-200 bg-white">`
- `<Card className="p-6 border-2 border-red-200 bg-white">` → `<Card className="stat-card p-6 border-2 border-red-200 bg-white">`
- `<Card className="p-6 border-2 border-blue-200 bg-white">` → `<Card className="stat-card p-6 border-2 border-blue-200 bg-white">`

(These are the four summary cards in the `grid ... lg:grid-cols-4` block near line 238; do NOT add it to the larger analytics/critical-items cards below.)

- [ ] **Step 6: Verify + commit**

Run: `pnpm check && pnpm build 2>&1 | tail -2`
Expected: no TS errors; "built in".

```bash
git add client/src/index.css client/src/pages/DataCatalog.tsx client/src/pages/Home.tsx client/src/pages/Centers.tsx client/src/pages/InventoryTracking.tsx
git commit -m "feat: refined stat-card treatment (shadow + hover-lift) across pages"
```

---

### Task 6: Visual + link verification

**Files:** none (verification only)

- [ ] **Step 1: Build and serve**

```bash
cd /home/emz/mega_disk/Seeds-MEWA
pnpm build 2>&1 | tail -2
fuser -k 4173/tcp 2>/dev/null; sleep 1
PORT=4173 pnpm start > /tmp/mewa-4173.log 2>&1 &
sleep 4
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4173/
```
Expected: `200`. Also confirm `curl -s -o /dev/null -w "%{http_code}" http://localhost:4173/mewa-logo.jpg` returns `200`.

- [ ] **Step 2: Screenshot nav, a cards page, and footer at desktop (1280) and mobile (390) widths**

Use the Playwright MCP browser: resize to 1280×900, navigate to `http://localhost:4173/catalog`, screenshot top (nav + cards) and scrolled-to-bottom (footer). Then resize to 390×800 and repeat. Read each screenshot and confirm: logo is larger, cards have shadow/hover affordance + colored top border on catalog, footer has gold accent bar and a non-boxed Vision 2030 logo, About link present.

- [ ] **Step 3: Verify every nav + footer link routes client-side**

In the browser, click each footer Quick Link (Catalog, Genomics, Centers, Research, About) and the Contact-Form link; confirm the URL changes and the page swaps WITHOUT a full reload (no white flash / network document request). Click the Catalog→Fingerprints button; confirm it lands on `/fingerprints` client-side. Confirm `/about` renders.

- [ ] **Step 4: Confirm zero console errors**

Use the Playwright MCP console-messages (only errors); expect 0.

- [ ] **Step 5: Final confirmation note**

No code change; the prior task commits constitute the work. If any screenshot reveals a regression, fix in the relevant file and amend that task's commit.

---

## Self-Review

**Spec coverage:**
- Vision 2030 dead URL → Task 1 (local asset) + Task 2 Step 2 / Task 3 Step 4. ✓
- manuscdn temporary logos → Task 1 + Task 2 Step 1. ✓
- Orphaned `/about` → Task 3 Step 3 (footer About link) + Step 5 (key). ✓
- Full-page reloads (footer + fingerprints) → Task 3 Step 3, Task 4. ✓
- Bigger logo → Task 2 Step 1. ✓
- Menu/pill style → Task 2 Steps 3–5. ✓
- Data/stat cards (Catalog, Home, Centers, Inventory) → Task 5. ✓
- Footer accent/hover/logo → Task 3. ✓
- Verification (build + screenshots desktop/mobile + link click-through + 0 console errors) → Task 6. ✓
- Header.tsx correctly excluded (dead code). ✓

**Placeholder scan:** none — every step has concrete code/commands.

**Type consistency:** `CROP_META` already imported in DataCatalog (used by existing cards); `useLocation`'s `[, navigate]` tuple matches wouter's API; `Link` from wouter matches existing nav usage.
