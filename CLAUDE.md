# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start Vite dev server (port 3000, network accessible)
pnpm build        # Build client (Vite) + server (ESBuild) → dist/
pnpm start        # Run production server (NODE_ENV=production node dist/index.js)
pnpm preview      # Preview production build locally
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
client/
  public/         # Static assets served at site root (wheatpassport.csv, CoffeePassport(1).csv)
  src/
    pages/        # 11 route-level page components (10 routes + NotFound)
    components/   # Reusable components
      ui/         # Shadcn/ui primitives (Button, Dialog, etc.)
    contexts/     # ThemeContext, LanguageContext (en/ar)
    hooks/        # Custom React hooks
    lib/          # dataLoader.ts (CSV parsing), htmlExport.ts
    data/         # Static seed center data (passportData.ts, seedCenters.ts, inventoryData.ts)
    types/        # TypeScript interfaces
server/
  index.ts        # Express: static file serving + SPA fallback
shared/
  const.ts        # Shared constants (COOKIE_NAME, ONE_YEAR_MS)
docs/             # Planning/scratch notes (todo, progress, ideas, etc.) — not part of the app
data-sources/     # Raw provenance data the data/ TS files were derived from — NOT loaded at runtime
```

### Path aliases
- `@/*` → `client/src/*`
- `@shared/*` → `shared/*`
- `@assets/*` → `attached_assets/*`

### Data loading
`lib/dataLoader.ts` fetches CSV files (`wheatpassport.csv`, `CoffeePassport(1).csv`) served from `client/public/` at the site root and parses them into `SeedPassport[]` objects entirely in the browser. There is no fetch to a backend API. The `SeedPassport` type is in `client/src/types/data.ts` and includes `cropType: 'wheat' | 'coffee'`.

### Internationalization
Custom context-based i18n system in `contexts/LanguageContext.tsx` with 375+ English/Arabic translation keys. **Default language is Arabic** (RTL). Access translations via `const { t, language, dir } = useLanguage()`. `t('key')` falls back to English then the raw key. Language auto-sets `document.dir` and persists to localStorage. All user-facing strings must go through `t()`.

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
