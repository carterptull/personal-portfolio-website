# DECISIONS.md

Concise log of significant technical decisions — what / why / alternative considered.
Kept for the owner's reference (interview prep, future maintenance).

## Dual-layer architecture (SSR content + client desktop chrome)
All content lives at real server-rendered routes (`/`, `/about`, `/projects/[slug]`, …) as
semantic HTML; the Win95 desktop is a client layer that hydrates on top and shows the same
content components inside windows. **Why:** crawlers, link previews, and no-JS/reduced-motion
users get full content; LCP is plain HTML, not a JS boot. **Alternative:** render content only
inside windows after click (the common Win95-portfolio approach) — invisible to crawlers and
hostile to LCP; rejected.

## Zustand for the window manager
Single store with `windows: Record<id, Win>`, `order: id[]` (index = z), `focusedId`.
**Why:** selector subscriptions mean each window re-renders only on its own slice; the store
is readable outside React (`getState()`) for imperative open/close from icons and routes.
**Alternative:** Context + reducer — any state change re-renders every window; rejected.

## Hand-rolled Pointer Events drag/resize, transform-to-ref during move
On title-bar pointerdown → `setPointerCapture`; during pointermove write
`translate3d` directly to the DOM node; commit coordinates to the store only on pointerup.
**Why:** committing every move to the store re-renders the tree on every mouse move — the #1
faux-desktop perf mistake. Pointer Events unify mouse + touch. **Alternative:** `react-rnd` —
extra dependency and uncontrolled/controlled sync friction; kept only as fallback, not needed.

## Window id === appId (singleton windows)
Opening an already-open app re-focuses/restores it rather than spawning a duplicate.
**Why:** matches how visitors actually use a portfolio, simplifies taskbar tabs and
route↔window mapping. **Alternative:** multi-instance windows — complexity with no payoff.

## Content/shell split for mobile
Pure content components wrapped by `<FloatingWindow>` (≥768px) or a full-screen mobile shell
with Back control + bottom bar (<768px), chosen via SSR-safe `matchMedia`. **Why:** drag/resize
windows are hostile to touch; recruiters scan on phones. **Alternative:** CSS-only responsive
shrinking of floating windows — rejected as a fallback pretending to be a design.

## Boot sequence as overlay, never a loader
BIOS/splash renders on top of already-present content, ≤3s, skippable, `sessionStorage`
once-per-session, skipped under reduced-motion. **Why:** a boot *loader* would delay LCP and
gate content behind JS. **Alternative:** splash-then-mount — fails the perf budget; rejected.

## 3D Pipes screensaver: idle-gated dynamic import
The three/R3F chunk isn't even requested until ~60s of inactivity; unmounts + disposes on any
input; skipped for reduced-motion, missing WebGL, or Save-Data; paused when tab hidden;
`dpr` clamped [1, 1.5]. **Why:** the signature moment costs 0 bytes on the critical path.
**Alternative:** always-on WebGL wallpaper — permanent perf tax; rejected.

## CRT effect in CSS/SVG, not WebGL
Scanlines/vignette via `repeating-linear-gradient` with a taskbar toggle. **Why:** ~0 KB,
works everywhere, easily disabled. **Alternative:** WebGL post-processing over the DOM —
massive cost for the same vibe; rejected.

## YouTube via facade pattern on youtube-nocookie.com
Media Player renders thumbnail + play button; the iframe loads only on click, from
`youtube-nocookie.com`. Playlist is a config array in `src/content/videos.ts`. **Why:** zero
YouTube bytes/cookies on load — preserves the perf budget and the no-consent-banner stance.
**Alternative:** direct iframe embeds — ~1 MB+ of third-party JS per video on load; rejected.

## 98.css as reference only; Tailwind v4 tokens
Bevel recipes (inset box-shadows) and palette are theme tokens in `globals.css`; the 98.css
stylesheet itself is not imported. **Why:** its global resets and class names fight Tailwind.
**Alternative:** import 98.css or React95 — styling conflicts / styled-components dependency;
rejected.

## Single scarlet #BB0000 (OSU)
One accent token used for title-bar gradient (to `#E23A3A`), wallpaper, selection, LED, logo.
The old `pixel-computer-logo-final.svg` (`#d0201f`) is a discarded test asset. **Why:** owner
decision; one source of truth prevents drift.

## Analytics gated on the VERCEL env var
`@vercel/analytics` + Speed Insights render only when deployed on Vercel. **Why:** local-first
build; avoids dev-console noise and pointless requests. Cookieless, so no consent banner.

## three pinned to ~0.182
`@react-three/fiber` (9.6.1) still instantiates `THREE.Clock` internally, which three r183
deprecated in favor of `THREE.Timer` — every screensaver mount logged a deprecation warning.
**Why:** pinning three to the last pre-deprecation release silences it without touching R3F
internals. Unpin once R3F migrates to Timer. **Alternative:** stay on 0.185 and accept the
console warning — rejected; a visible warning on a portfolio is a bad look.

## npm override: postcss ≥8.5.10 under next
Next bundles postcss 8.4.31 (GHSA-qx2v-qp2m-jg93, moderate XSS in stringify output); no fixed
Next release existed, so a targeted `overrides` entry forces the nested copy to ^8.5.16.
**Why:** clears `npm audit` without `--force` (which wanted to downgrade to next@9).
Remove the override once Next ships with patched postcss.

## Resume as a desktop app, not a route
Word-style desktop icon opens a window with the PDF in an `<object>` viewer plus
open-in-new-tab/download links (the fallback path for browsers that can't inline PDFs,
notably iOS Safari). The PDF is served from `public/`. **Why:** keeps the desktop metaphor;
the file is still directly linkable at `/Carter-Tull-Resume.pdf`.

## Separate z-order and taskbar-order arrays in the window store
`windowStore` keeps `order: id[]` (z-index, index = z, reordered on every focus) and a second
`openOrder: id[]` (append-only, taskbar render order, only changes on open/close). **Why:** a
single shared array meant `focus()` splicing a window to the end for z-index also reshuffled
the taskbar buttons on every click — a real Win95 taskbar never reorders tabs by recency.
**Alternative:** derive taskbar order by sorting on a per-window `openedAt` timestamp —
equivalent but an extra field and a sort on every render instead of an already-ordered array.

## `.win-anim` animates `scale`, not `transform`
The window-open keyframe (`opacity` + scale-in) targets the standalone `scale` CSS property.
**Why:** window position is set via inline `transform: translate3d(x, y, 0)`; a keyframe that
also animates `transform` replaces its value for the animation's duration, wiping the position
and snapping the window to the top-left corner of its containing block until the animation
finished. `scale`/`rotate`/`translate` are independent from `transform` per the CSS Transforms
Level 2 spec, so they compose without conflict. **Alternative:** encode position as CSS custom
properties and reference them in the animated `transform` — works, but needs `@property`
registration for smooth interpolation and is more machinery for the same result.

## Canonical URL via NEXT_PUBLIC_SITE_URL
All metadata/sitemap/JSON-LD derive from one env var with a localhost fallback. **Why:** the
domain isn't purchased yet; nothing hardcodes it.
