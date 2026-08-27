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

## Screensaver state lives in its own store, not `ScreensaverGate`'s closure
`useScreensaverStore` (Zustand) owns `active`/`Saver`/`launch()`/`exit()`; `ScreensaverGate`
only owns the idle-timer `useEffect` and calls into the store. **Why:** a desktop icon and a
Start Menu row both need to trigger the same screensaver the idle timer does, and the trigger
logic was previously a closure trapped inside that timer's effect, unreachable from anywhere
else. **Alternative:** prop-drill a callback down from a common ancestor — there isn't one;
`ScreensaverGate` and `IconGrid`/`Taskbar` are siblings under `DesktopChrome`, so this would
mean lifting state into `DesktopChrome` itself and threading props through multiple layers for
a concern that has nothing to do with window management.

## Screen-takeover apps opt out of windowing through `AppDef.launch`
`AppDef` is a union: either `w`/`h`/`render` (opens a `FloatingWindow`) or `launch()` (takes over
the screen). `openApp()` delegates to `launch()` and returns. **Why:** "the screensaver never
becomes a window" was previously enforced by an `appId === "screensaver"` check duplicated in
`IconGrid` and the Start Menu — a convention that only held while every future call site
remembered it; one that didn't would have produced a 0x0 window and a blank taskbar button. The
union makes the two shapes mutually exclusive at the type level.

## Screensaver dismissal is never gated on reduced-motion or Save-Data
`ScreensaverGate` splits idle *arming* (skipped for reduced-motion/Save-Data) from *dismissal*
(attached whenever the screensaver is active or its chunk is loading). **Why:** `launch()`
deliberately bypasses those preferences for a manual click, so gating the exit listeners on them
too left reduced-motion users in a full-screen trap that only a reload could clear. A manual
launch also gets an 800 ms grace in which an incidental `pointermove` is ignored — the hand is
still on the mouse over the icon — while deliberate input (`pointerdown`/`keydown`/`wheel`/
`touchstart`) exits instantly, and the idle path keeps its instant-dismiss-on-anything behaviour.

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

## npm override: postcss under next
Next originally bundled postcss 8.4.31 (GHSA-qx2v-qp2m-jg93, moderate XSS in stringify output);
no fixed Next release existed at the time, so a targeted `overrides` entry forced the nested
copy to a patched version. Next 16.3.0 now bundles postcss 8.5.23 natively, but the override
stayed — bumped to `^8.5.26` alongside the direct `postcss` devDependency — to close two more
postcss CVEs (GHSA-r28c-9q8g-f849, GHSA-fxqj-rqcc-2cmp; both fixed at 8.5.18/8.5.23) that
surfaced after the original override was written. **Why:** clears `npm audit` without
`--force`. Re-check whether the override is still load-bearing next time Next is upgraded —
it may have become redundant now that Next ships a sufficiently patched postcss itself.

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

## CI: one lint-and-build job, not a matrix
`.github/workflows/ci.yml` runs `npm run lint` + `npm run build` on a single `ubuntu-latest` /
Node 24 job. **Why:** this is a single-target Next.js site deployed to one place, not a
published package other people's tooling needs to run on — there's no cross-OS/cross-Node
consumer to protect against, unlike `ampline-claude`'s npm-package matrix (3 OS × 3 Node).
**Alternative:** copy that matrix anyway for consistency across repos — rejected as pure
overhead; a matrix answers a question this repo doesn't have.

## GitHub Actions pinned to majors on the current Node runtime, not just "latest"
`actions/checkout`/`actions/setup-node` are bumped only when their pinned major still runs on
a deprecated Actions Node runtime (confirmed via each action's `action.yml` `runs.using`
field, not assumed from version numbers), and bumped to the latest major on the current
runtime rather than the minimum viable one, after checking each action's changelog for
breaking changes against this repo's actual usage (default `checkout`, explicit
`cache: npm` on `setup-node`). **Why:** GitHub deprecates old Actions Node runtimes on a
schedule; a workflow silently keeps working right up until the runtime is removed, then fails
with no warning tied to anything in this repo's own history. **Alternative:** blanket-upgrade
every action to its latest release on a schedule (e.g. via Dependabot Actions updates) —
worth doing too, but doesn't substitute for actually checking `runs.using`, since an action
can ship patch/minor releases on an old runtime for a long time before its next major moves it.

## Canonical URL via NEXT_PUBLIC_SITE_URL
All metadata/sitemap/JSON-LD derive from one env var with a localhost fallback. **Why:**
originally because the domain wasn't purchased yet; kept after `cartertull.com` was acquired
(2026-08-13) because the fallback is what makes a fresh clone build and run with no setup, and
because preview deployments need a different origin than production — a hardcoded domain would
make every Vercel preview emit canonical/OG URLs pointing at production. **Alternative:**
hardcode `https://cartertull.com` now that it exists — rejected; it trades zero-config local
dev and correct preview metadata for saving one environment variable.

## One Start menu implementation, rendered by both shells
`StartMenu.tsx` exports `StartButton` — the button, its popup, open/close state, outside-click
dismissal, and focus-return bundled together — and `Taskbar`/`MobileShell` each just place it.
**Why:** the menu needs the button's ref to know a click on the button isn't "outside" and to
restore focus on Escape, so that state can't be split from the markup without duplicating it.
Exporting only the menu would have each taskbar re-implement the wiring, which is exactly where
a mobile/desktop behavior fork creeps in. **Alternative:** a mobile-specific bottom-sheet menu —
rejected; the desktop menu already fits a 390px viewport, and two implementations means two
things to keep in sync for no gain.

## Component CSS lives in `@layer components`
**Why:** Tailwind v4's `@import "tailwindcss"` puts utilities in `@layer utilities`, and
unlayered CSS beats *every* layered rule regardless of specificity. With `.btn95` and friends
unlayered, any utility set alongside them was silently dead — which is how the mobile close
button, the only touch way out of a full-screen app, shipped at 18×16px while its markup
asked for something larger. Wrapping them restores the cascade authors expect.
**Consequence:** utilities now win over these classes, which is the intent — reach for a
utility to adjust one instance, and edit the class only to change every instance.

## Touch sizing via `pointer-coarse:`, not a breakpoint
**Why:** viewport width doesn't tell you the input device — a small window on a desktop isn't
a finger, and a large tablet is. Gating the 44px minimums on `pointer-coarse:` keeps Win95's
compact proportions for mouse users while giving touch users real targets, without either
choice leaking into the other. **Alternative:** bump sizes at the `md:` breakpoint — rejected;
it would inflate desktop rows for anyone with a narrow window.

## CSP keeps `'unsafe-inline'` on `script-src` instead of adopting nonces
`next.config.ts` ships a Content-Security-Policy whose `script-src` allows `'unsafe-inline'`.
**Why:** all 31 routes prerender to static HTML, and nonces must be unique per response — so a
nonce-based policy requires `middleware.ts` and forces every route to render dynamically,
trading the site's entire static-delivery story (and the LCP ≤2.0s budget) for XSS defense on a
site with no user input, no auth, no cookies, and no database. The only inline scripts are
Next's own RSC flight payload and a JSON-LD block built from compile-time constants. The
realistic threat to an interactive fake desktop is clickjacking, not injection, and
`frame-ancestors` answers that. **Alternative:** nonce + `strict-dynamic` — correct for an app
with real user input; revisit the moment this site gains a form or a dynamic route.
**Consequence:** `'unsafe-eval'` is added in development only, because React's dev build uses
`eval()` for callstack reconstruction and its production build never does.

## Blitzcast is a desktop-only app with no SSR route, embedded cross-origin

The Blitzcast icon opens a window (`BlitzcastContent`) that iframes `https://www.blitzcast.app`
directly — unlike every other window, which either renders `src/content/*` data or a same-origin
asset. It has no entry in `DESKTOP_APP_IDS`'s route mapping (`appIdForPath`) and no `/blitzcast`
page, so it's reachable only from the desktop icon, never crawlable. **Why:** Blitzcast is a
separate, fully-formed Next.js app on its own domain — duplicating its UI as `src/content/*` data
would mean maintaining two copies of the same product, and this site's own dual-layer rule is
about *this site's* content staying server-rendered, not about every third-party link needing an
SSR mirror. **Alternative:** a plain external link (no window at all) — simpler and avoids the
cross-origin framing question below entirely, but the resume icon already sets the "open it right
here, with an escape hatch to a new tab" pattern, and that's what was asked for.
**Consequence:** `frame-src` on this site's CSP had to allowlist `https://www.blitzcast.app`
(next to the existing `'self'` and YouTube allowances), and blitzcast.app's own deploy needed a
`frame-ancestors` header scoped back to this domain — see that repo's DECISIONS.md. Unlike the
resume PDF, a blocked iframe here fails silent (blank, no fallback content), so both ends were
verified against real production builds, not just read on paper.

## Framing headers are `'self'`/`SAMEORIGIN`, not `'none'`/`DENY`
**Why:** the header block applies to `/:path*`, which includes `/Carter-Tull-Resume.pdf`. Chrome
renders a PDF `<object>` through an internal viewer frame, so `'none'`/`DENY` left the resume
window unable to frame its own PDF — and `frame-src` had to allow `'self'` for the same reason,
not just `object-src`. `'self'` still refuses cross-origin framing, which is the only thing
clickjacking needs. **Alternative:** keep `'none'` globally and carve out the PDF path with a
second `headers()` entry — more moving parts for no additional protection, since a same-origin
frame of your own page is not a clickjacking vector. **How this was found:** not by reading the
spec — by loading a production build in a real browser and watching the resume window come up
blank. Both CSP bugs looked correct on paper.
