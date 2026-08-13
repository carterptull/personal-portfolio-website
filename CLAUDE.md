# CLAUDE.md

Personal portfolio for **Carter Tull**, built as a retro Windows 95/98 desktop.
Authoritative spec: `portfolio-implementation-plan.md`. Decision log: `DECISIONS.md`.

## Commands

```bash
npm run dev      # dev server (http://localhost:3000)
npm run build    # production build (Turbopack)
npm run start    # serve the production build
npm run lint     # eslint
```

`NEXT_PUBLIC_SITE_URL` sets the canonical URL (falls back to `http://localhost:3000`);
set it in `.env.local` when deploying. Vercel Analytics/Speed Insights only render when `VERCEL` is set.

## Architecture — dual layer (the one rule that matters)

Content and desktop chrome are separate layers. Content must never exist only inside a window.

1. **SSR content layer** — real, crawlable routes rendered server-side:
   `/`, `/about`, `/projects`, `/projects/[slug]`, `/contact` (`src/app/**`), wrapped in
   `src/components/ssr/*` (header/footer/static window frame). Fully readable with JS disabled.
2. **Desktop chrome layer** — `DesktopBoundary` in the root layout hydrates the Win95 desktop
   (boot overlay, icon grid, floating windows, taskbar/Start menu) on top of the SSR layer.

Both layers render the **same** content components from `src/components/content/*`
(pure presentational, know nothing about windows).

Key modules:

- `src/store/windowStore.ts` — Zustand window manager. `order: id[]` is z-order
  (index = z); `focus()` splices to end. Window id === appId (singleton windows).
- `src/components/desktop/apps.tsx` — app registry (`getAppDef`), route↔app mapping,
  `openApp`/`closeApp` incl. focus-return-to-trigger. Window content is `dynamic()`-imported.
- `src/components/desktop/FloatingWindow.tsx` — drag/resize via Pointer Events +
  `setPointerCapture`; writes `transform` to the DOM ref during move, commits to the
  store only on pointerup. Never commit per-move.
- `src/components/desktop/MobileShell.tsx` + `src/hooks/useIsMobile.ts` — <768px renders
  full-screen apps (Back control, bottom bar) instead of floating windows.
- `src/store/screensaverStore.ts` + `src/components/screensaver/ScreensaverGate.tsx` — 3D Pipes
  mounts after ~60s idle (or on demand via the "3D Pipes" icon/Start Menu row, which is an
  `AppDef.launch` that `openApp` delegates to) via dynamic import; disposes on input. Idle
  *arming* is skipped for reduced-motion / no WebGL / Save-Data; *dismissal* never is, since a
  manual launch deliberately bypasses those preferences. `three` must stay in its own async
  chunk — never import it from eagerly-loaded modules.
- `src/content/*.ts` — all copy/data (profile, projects, skills, videos). Edit content here,
  not in components.
- `src/lib/site.ts` — site URL/name/contact constants. `SITE_URL` resolves
  `NEXT_PUBLIC_SITE_URL` → Vercel system vars → `localhost:3000`, in that order.
- `next.config.ts` — security response headers (CSP, framing, HSTS, etc.) for every route.
  The CSP is derived from what this app actually does; three allowances are load-bearing and
  each has a comment saying why: `frame-src 'self'` and `object-src 'self'` (Chrome renders the
  resume PDF `<object>` through an internal viewer frame), and `frame-ancestors 'self'` rather
  than `'none'` (the same headers ride on the PDF asset). Verify any CSP edit against a
  production build in a real browser — `npm run build && npx next start` — not by reading it.

## Hard constraints (acceptance criteria, not suggestions)

- Name is **Carter Tull** everywhere. Zero mention of "Paymon" in site, code, or assets.
- **No job-search signaling** ("open to work", "available for hire", etc.); JSON-LD Person
  has no `seeks`/availability fields.
- One scarlet: **#BB0000**. `#E23A3A` is allowed only as a *gradient end* — currently the
  title bar, the boot progress bar, and the Start menu sidebar. Never a flat fill, and
  never `#d0201f`.
- Content must render in server HTML; never fetch/inject page content client-side only.
- Every desktop interaction needs a keyboard + touch path; respect `prefers-reduced-motion`
  (skip boot, screensaver, animations).
- Boot sequence is an overlay over already-rendered content, skippable, once per session.
- Perf budget: LCP ≤2.0s, INP ≤200ms, CLS ≤0.1, critical JS <~150 KB gzip.
- Keep comments minimal; only explain what the code can't say itself.

## Adding a project later

Add an entry to `src/content/projects.ts` — routes, sitemap, OG image, desktop icon, and
window all derive from it. No layout changes needed.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
