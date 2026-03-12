# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start Vite dev server (port 3000, network accessible)
pnpm build        # Build client (Vite) + server (ESBuild) → dist/
pnpm start        # Run production server (NODE_ENV=production node dist/index.js)
pnpm check        # TypeScript type checking (tsc --noEmit)
pnpm format       # Format code with Prettier
```

There are no automated tests configured despite Vitest being installed.

## Architecture

**Static data SPA** — React frontend + Express server that only serves static files. There is no backend database or API; all data comes from CSV files loaded client-side.

### Stack
- **Frontend**: React 19, TypeScript (strict), Vite 7, Tailwind CSS v4, Wouter (routing)
- **UI**: Radix UI primitives + shadcn/ui pattern, Framer Motion, Recharts, Sonner toasts
- **Forms**: React Hook Form + Zod validation
- **Server**: Express (SPA fallback only, no API routes)
- **Package manager**: pnpm

### Directory layout
```
client/src/
  pages/          # 12 route-level page components
  components/     # Reusable components
    ui/           # Shadcn/ui primitives (Button, Dialog, etc.)
  contexts/       # ThemeContext, LanguageContext (en/ar)
  hooks/          # Custom React hooks
  lib/            # dataLoader.ts (CSV parsing), htmlExport.ts
  data/           # Static seed center data (seedCenters.ts, inventoryData.ts)
  types/          # TypeScript interfaces
server/
  index.ts        # Express: static file serving + SPA fallback
shared/
  const.ts        # Shared constants (COOKIE_NAME, ONE_YEAR_MS)
```

### Path aliases
- `@/*` → `client/src/*`
- `@shared/*` → `shared/*`

### Data loading
`lib/dataLoader.ts` parses tab-separated CSV files (`wheatpassport.csv`, `coffeepassport.csv`) into `SeedPassport[]` objects entirely in the browser. There is no fetch to a backend API.

### Internationalization
Custom context-based i18n system in `contexts/LanguageContext.tsx` with 375+ English/Arabic translation keys. Language auto-sets `document.dir` (RTL for Arabic) and persists to localStorage. All user-facing strings must go through the translation hook.

### Theme system
MEWA institutional color palette defined as CSS variables in `client/src/index.css` (`--mewa-green`, `--mewa-gold`, etc.). Light theme is default; dark mode support exists via `<html class="dark">`. Theme stored in localStorage when `switchable: true` in ThemeContext.

### Key shared patterns
- **PageLayout**: Wrapper component for consistent page structure
- **DataTable**: Paginated table (20 items/page) with CSV export
- **FilterPanel**: Reusable filtering UI
- **StatsCard**: KPI display cards
- **SaudiMap**: Geographic visualization component
- **Error Boundary**: Class-based, wraps the app in `main.tsx`

### Formatting
Prettier config: 80-char line width, double quotes, semicolons, LF endings, trailing commas (es5). Run `pnpm format` before committing.
