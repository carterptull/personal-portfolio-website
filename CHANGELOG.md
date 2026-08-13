# Changelog

All notable changes to this portfolio are documented in this file. Format
follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions
follow [SemVer](https://semver.org/).

## [Unreleased]

## [1.0.0] — 2026-08-13

First public release, on the `cartertull.com` domain. The version reflects a site that is
deployed and reviewed rather than any rewrite — the architecture is unchanged from 0.3.0.

### Added
- Security response headers on every route (`next.config.ts`): a Content-Security-Policy,
  `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and
  HSTS with `preload`. The CSP was derived from what this app actually does and verified
  against a production build in a real browser, which caught two policies that looked correct
  on paper and broke the site in practice:
  - Chrome renders a PDF `<object>` through its internal viewer **frame**, so the resume window
    needs `frame-src 'self'` in addition to `object-src 'self'`.
  - The same headers ride on `/Carter-Tull-Resume.pdf` itself, so `frame-ancestors 'none'` left
    the resume window unable to frame its own PDF. Scoped to `'self'` (with `X-Frame-Options:
    SAMEORIGIN` to match), which still refuses the cross-origin framing that clickjacking needs.
  `script-src` keeps `'unsafe-inline'` — see `DECISIONS.md` for why a nonce is the wrong trade
  here — and `'unsafe-eval'` is added in development only, since React's dev build needs it and
  its production build never does.
- `poweredByHeader: false`, dropping the `X-Powered-By: Next.js` version disclosure.
- `.github/dependabot.yml`: weekly grouped npm and github-actions version updates, on top of the
  repo-level security alerts that were already enabled.
- `generateStaticParams` on the per-project OG image route, so all nine cards are rasterized at
  build time instead of on every social-crawler fetch.
- `NEXT_PUBLIC_SITE_URL` now falls back to Vercel's system environment variables before
  `localhost` (`src/lib/site.ts`), so a forgotten variable can't ship localhost canonicals and
  preview deploys self-canonicalize instead of claiming to be production.

### Fixed
- The 404 and error documents were rendered `display: none` and were unreachable whenever
  JavaScript was enabled. Both live inside `.ssr-layer`, which the desktop hides on mount
  (`globals.css`), so a render error hid its own "Try again" button and a bad URL showed a
  normal desktop. They now opt out via an `.ssr-escape` class, and the URL-sync effect in
  `DesktopChrome` no longer rewrites an unrecognised path to `/` — a broken link stays visible
  in the address bar instead of being silently swallowed.
- A cancelled pointer (interrupting system gesture, pen leaving range) left a window stuck in
  drag/resize: the state ref was cleared only on `pointerup`, so the next `pointermove` moved
  the window with no button held. `onLostPointerCapture` now covers both paths.
- `sessionStorage`/`localStorage` access in `DesktopChrome` was unguarded. These throw in Safari
  private mode, with site data blocked, and in partitioned third-party frames — and an exception
  in a `useState` initializer took the entire desktop layer down with it. Now guarded, with the
  preference simply not persisting.
- Closing a window that had been restored from its taskbar button dropped focus to `<body>`:
  closing unmounts that button, and the `isConnected` check ran before React committed. The
  check now happens inside the animation frame, falling back to the desktop container.
- The skip link pointed at `#desktop-main`, which only existed in the desktop branch — it was a
  dead anchor for every mobile visitor. `MobileShell`'s root now carries that id.
- A full-screen mobile app is genuinely modal, but the icon grid behind it stayed focusable, so
  Tab walked straight out of the dialog into invisible controls. The grid is now `inert` while an
  app is open, and the dialog declares `aria-modal`.
- Project titles on the projects index were `<h3>` directly under an `<h1>`, skipping a level in
  both the page and the desktop window. Now `<h2>`.
- The per-project OG image route rendered a PNG for any slug, falling back to "Project" instead
  of 404ing — an unbounded set of uncached Satori renders, each embedding attacker-chosen text on
  this domain. It now mirrors the page route's `notFound()` guard.
- JSON-LD is escaped for `<` and U+2028/2029 before being written into the `<script>` block. Not
  exploitable today (every value is a compile-time constant), but it stops that from being
  load-bearing.
- A manual screensaver launch under `prefers-reduced-motion` or Save-Data could not be exited:
  the effect that attached the dismissal listeners also armed the idle timer, and bailed out
  early for those users — so a deliberate click (which intentionally bypasses those preferences)
  left a full-screen overlay only a reload could clear. Dismissal now lives in its own effect,
  gated on the screensaver being active rather than on the user's motion/data preferences. The
  idle timer itself is still never armed for them.
- A manual launch no longer dismisses itself on the first stray `pointermove`: the pointer is
  still resting on the icon that was just clicked, so incidental drift is ignored for 800 ms.
  Deliberate input (`pointerdown`/`keydown`/`wheel`/`touchstart`) still exits immediately, and
  idle-triggered launches keep dismissing on any activity with no grace at all.
- Activity during the three/R3F chunk download now cancels the launch instead of dropping the
  screensaver onto a desktop the user has gone back to using: `launch()`/`exit()` share a
  generation token, so an import that resolves after a newer exit or launch can no longer
  activate. The loaded module is still cached, so a later launch stays instant.
- `openApp()` honours an `AppDef.launch`, so screen-takeover apps can never be opened as a
  window. Previously only matching `appId === "screensaver"` checks in `IconGrid` and the Start
  Menu kept the screensaver from becoming a 0x0 floating window with a blank taskbar button.

### Changed
- The 3D Pipes desktop icon drops the chrome joint that was painted over the end of the pipe;
  the monitor now shows a bare scarlet elbow.
- `SECURITY.md` replaced its placeholder text — which said the site had no production domain and
  no review — with a real policy: supported versions, scope, response expectations, and the
  CSP trade-off stated explicitly rather than left to be discovered.
- CI runs with an explicit read-only `GITHUB_TOKEN` (`permissions: contents: read`).
- The `#E23A3A` rule in `CLAUDE.md` now reads "gradient end" rather than "title-bar gradient
  end", matching where it is actually used (title bar, boot progress bar, Start menu sidebar).
  The code was consistent; the rule was narrower than the design.

### Removed
- `Carter_Tull_Resume.pdf` at the repo root — a byte-identical duplicate of
  `public/Carter-Tull-Resume.pdf`, which is the only copy ever served. Nothing referenced the
  root filename.

### Security
- Resolved every open Dependabot alert (20 → 0): `next` 16.2.10 → 16.3.0 (7 advisories, including
  two high-severity SSRF issues and a Turbopack middleware bypass), `postcss` bumped to `8.5.26`
  directly and via a re-pinned `overrides.next.postcss` (2 advisories the pinned `next` copy would
  otherwise have kept vulnerable at 8.5.16), `sharp` pulled up transitively with the `next` bump
  (libvips CVEs), `js-yaml` 4.3.0 → 4.3.1 (quadratic CPU consumption in `!!omap` resolution), and
  `nanoid` 3.3.15 → 3.3.18 (infinite loop on zero/negative size). Applied by hand on this branch
  rather than merging Dependabot's PRs #7–#10, which were closed with a comment pointing here.
  `brace-expansion` (dev-only, via `eslint`/`eslint-config-next`'s dependency tree) also cleared,
  swept up by `npm audit fix` alongside the rest — not part of any of the four PRs.
- Full code and security review ahead of the first public deploy (`npm audit`: 0 vulnerabilities
  across 457 dependencies). Findings are the Added/Fixed entries above; the review also confirmed
  no secrets have ever been committed, no server-side attack surface exists (no route handlers,
  middleware, or server actions), and the dynamic `[slug]` param is exact-matched against a
  static array rather than interpolated into any lookup.

## [0.3.0] — 2026-08-10

### Added
- CI: a GitHub Actions workflow (`.github/workflows/ci.yml`) running `npm run lint` and
  `npm run build` on every push/PR to `main`.
- Branch protection on `main`: the CI check must pass and be up to date, changes must go
  through a pull request (enforced for admins too), force-pushes and branch deletion are
  blocked, and merged branches delete themselves automatically.
- Dependabot vulnerability alerts and automated security update PRs, turned on at the repo
  level.
- `SECURITY.md` — a baseline placeholder policy (private vulnerability reporting via GitHub
  advisories), since the site hasn't had a full security review yet and isn't deployed
  publicly. Linked from the README.
- A "3D Pipes" desktop icon (between Skills and Resume) and matching Start Menu row that play
  the idle-gated 3D Pipes screensaver on demand, bypassing `prefers-reduced-motion` since a
  deliberate click is explicit opt-in (the idle timer still fully respects it). Screensaver
  trigger state moved from `ScreensaverGate`'s local closure into a new `useScreensaverStore`
  so the idle timer and the new manual triggers share one code path.

### Fixed
- `.gitignore` had been a generic Python-project template since the very first commit,
  including a bare `lib/` rule that also matched `src/lib/` — so `src/lib/site.ts` and
  `src/lib/og.tsx` had never actually been committed to this repo, on any branch, in its
  entire history. Every local build succeeded only because the files existed on disk; a real
  fresh clone (what CI, and eventually a deploy, actually builds from) was broken the whole
  time. Replaced the gitignore with one scoped to what this repo actually is, and committed
  the two files. Caught by the CI workflow above on its very first run.

### Changed
- CI now runs on Node 24 (current Active LTS, up from 22), and `actions/checkout`/
  `actions/setup-node` bumped from v4 to v7 — v4 of both ran on the deprecated Node 20
  Actions runtime.

## [0.2.0] — 2026-08-09

### Added
- Version and copyright display in the taskbar and Start menu
  (`SITE_VERSION`/`COPYRIGHT` in `src/lib/site.ts`, sourced from
  `package.json`), plus this changelog.
- Certifications & training section on the About page listing all 11
  completed Anthropic Academy courses as a chip list, plus the
  ConstructConnect AI Enablement Program and Microsoft Python Programming
  Fundamentals.
- Three new project write-ups — **Ampline** (color-graded Claude Code
  statusline, published to npm), **Claude Code Workbench** (open-source
  agentic developer tooling framework), and **Blitzcast** (NFL/CFB
  win-probability predictor) — each linking out to its public GitHub repo
  (and npm for Ampline).
- `LICENSE` file (MIT).

### Changed
- `package.json` version bumped to `0.1.0-beta` ahead of a `1.0.0` tag,
  then to `0.2.0` for this release, tagged `v0.2.0` on GitHub.
- Updated title from Automation Developer to Software Engineer sitewide
  (profile, page metadata, JSON-LD, manifest, OG images) to match the
  current resume.
- Rewrote the About bio and homepage summary to match the current role and
  read less like a resume; later shortened further to a plainer, more
  casual two-paragraph bio.
- Overhauled the Skills page from 4 groups to 7, adding roughly 40 missing
  entries (Terraform, the GCP service list, FastAPI/Spring Boot/Next.js,
  PostgreSQL/pgvector, Anthropic Claude/MCP, OAuth 2.0/OIDC, and more).
- Renamed the Blitzcast project slug from `blitzcast-nfl-predictor` to
  `blitzcast` and retitled it to cover NFL & CFB, matching the renamed
  GitHub repo.
- Removed the Redis and Anthropic Claude API tags from the Universal Web
  Scraper tech stack (not actually used) and updated its approach bullet
  to match.
- Simplified the "Skills - System Properties" window title to "Skills".
- Removed the redundant intro line from the top of the Projects window.
- Capitalized "i-Dotter" (previously "i-dotter") throughout — video
  playlist titles and About page prose.
- Rewrote sitewide prose to read less AI-generated: dropped em dashes
  (kept only in project titles, matching LinkedIn), semicolons, and
  repeated "X rather than Y" / rule-of-three sentence patterns from every
  project write-up and the About bio.
- Swapped the served resume PDF (`public/Carter-Tull-Resume.pdf`) for the
  current version.

### Fixed
- **Taskbar reordering glitch** — clicking between windows or restoring a
  minimized one reshuffled the taskbar buttons, because `windowStore`'s
  single `order` array did double duty as both z-index stacking order and
  taskbar render order, and `focus()` spliced the active window to the end
  of it on every click. Split into `order` (z-index, unchanged) and a new
  append-only `openOrder` (taskbar), so taskbar buttons now stay in
  first-opened-left to most-recent-right order regardless of focus.
- **Window-open position glitch** — the `.win-anim` keyframe animated the
  `transform` property (`scale(0.96) → scale(1)`) on the same element
  whose position is also set via an inline `transform: translate3d(...)`.
  Since a CSS animation replaces the animated property's value for its
  duration, the window's position was wiped for ~120ms, snapping it to the
  top-left corner of its container before jumping back. Fixed by animating
  the standalone `scale` property instead, which composes independently of
  `transform`.

### Removed
- `VERSION.md` and `.env.local.example` — versioning is now tracked via
  git tags/GitHub releases per repo convention; the site's one env var is
  documented directly in the README instead.

## [0.1.0] — 2026-07-06 to 2026-07-09

### Added
- Initial release (2026-07-06): dual-layer SSR/desktop architecture — a
  fully server-rendered, crawlable content layer with a Windows 95–style
  desktop shell on top (floating windows, taskbar/Start menu, boot
  sequence, CRT toggle, idle-gated 3D Pipes screensaver) and a full-screen
  mobile shell. First three project write-ups: Quandary Interpreter,
  E-Commission Card, Class-Schedule Web Scraper.
- Blitzcast — AI/ML NFL Matchup Predictor, Personal Portfolio Website,
  Universal Web Scraper — AI Discovery & Crawling Platform (ConstructConnect
  hackfest), and Maze Explorer (Unity/C#, Ohio State University course
  project) project write-ups (2026-07-09).

### Changed
- Named The Ohio State University explicitly in the Quandary Interpreter
  and E-Commission Card write-ups, matching the other OSU-affiliated
  entries.
- Added Git to the E-Commission Card tech stack.
- Removed the hold-back note in `CLAUDE.md` that kept the NFL predictor and
  Universal Web Scraper write-ups unpublished.
