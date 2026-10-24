# Ampline desktop app — design

Date: 2026-10-23. Spans two repos: `carterptull/personal-portfolio-website` (this repo) and
`carterptull/ampline-website` (the static site served at https://ampline.js.org).

## Intent

Ampline (the color-graded statusline for Claude Code, published to npm as `ampline-claude`) now
has a live site at https://ampline.js.org. The portfolio should present it the way it presents
Blitzcast: a desktop icon that opens the live site inside a window, plus a Start-menu row, plus an
updated project write-up that links every public surface of the project. Blitzcast's addition
(commits `35b66d6`, `395addb`, `c5d9113`; DECISIONS.md "Blitzcast is a desktop-only app…") is the
template — follow it unless this document says otherwise.

## Goals

1. **Desktop icon "Ampline"** directly below Blitzcast and directly above Resume. Icon order and
   Start-menu order both come from `DESKTOP_APP_IDS` in `src/components/desktop/apps.tsx`, so
   inserting `"ampline"` between `"blitzcast"` and `"resume"` covers both, desktop and mobile.
2. **Icon art:** a new 16×16 pixel-art `IconAmpline` in `src/components/desktop/icons.tsx`,
   drawn from the existing `C` palette (chrome / light / dark / ink / white; no new colors), in the
   same raised-bevel style as `footballPx`/`folderPx` (light top-left edge, dark bottom-right).
   Shape: **four** vertical bars in the real logo's silhouette — short, medium, tallest,
   slightly-shorter-than-tallest — standing on a common baseline (logo: heights 18/28/40/32 of 64).
   Carter chose four bars to match the logo. It must read as "one of the gray desktop icons", not
   as a color logo — Carter reviews this visually before merge.
3. **Window:** `AmplineContent` (new file `src/components/content/AmplineContent.tsx`), a copy of
   `BlitzcastContent`'s shape: an "Open in new tab ↗" link plus an `<iframe>` of
   `https://ampline.js.org/`, plus `allow="clipboard-write"` (Carter's call) so the site's copy
   buttons work one-click inside the window — the only difference from Blitzcast's shape; say why
   in the DECISIONS entry. App registry entry `ampline` with `title: "Ampline"`, `IconAmpline`,
   no `route`, content `dynamic()`-imported like every other window.
4. **CSP (portfolio):** add `https://ampline.js.org` to `frame-src` in `next.config.ts`, with the
   comment updated to say why (same reasoning as blitzcast.app).
5. **Framing permission (ampline-website):** ampline.js.org currently sends
   `frame-ancestors 'none'` (in `vercel.json`, also read by `scripts/serve.mjs`), so the iframe is
   blank today. Change it to `frame-ancestors https://cartertull.com https://www.cartertull.com`
   — every other directive unchanged. No `'self'` (nothing on ampline.js.org frames itself; least
   privilege). Update the tests that pin the CSP and every doc that states `'none'`
   (`SECURITY.md`, `diagrams/deployment-security.md`, plus anything a grep for `frame-ancestors`
   or "embed" turns up in README/CLAUDE/DECISIONS), and add a numbered DECISIONS.md entry
   explaining the narrowed allowance and pointing back at the portfolio.
6. **Project section:** in `src/content/projects.ts`, the existing `ampline-claude` entry (keep
   the slug — it's a live URL) gains `links.live: "https://ampline.js.org/"` and a new
   `links.siteRepo: "https://github.com/carterptull/ampline-website"`; keep `repo`
   (`ampline-claude`) and `npm`. Add `siteRepo?: string` to the `Project.links` type and render it
   in `ProjectContent`'s footer as **"Website source on GitHub"**, after "Source on GitHub" and
   before "Published on npm"; the footer's show-condition must include it. Freshen the copy like
   Blitzcast's launch update did: `status` → "Live at ampline.js.org, published on npm, actively
   developed" (or close), and `outcome` mentions the live site with its interactive playground
   running the real renderer. Keep the existing voice (plain, first person, no hype), no new
   claims that aren't true of the project.
7. **Versions & docs:**
   - Portfolio `1.1.5 → 1.2.0` (new desktop app, mirrors Blitzcast's minor bump). CHANGELOG
     `[1.2.0] — <merge date>` in the existing Keep-a-Changelog style; DECISIONS.md entry
     generalizing the Blitzcast decision to "live sibling apps embedded cross-origin" (or a short
     new entry that references it); `diagrams/c4-context.md` gains ampline.js.org as an external
     system like blitzcast.app; `diagrams/deployment-security.md` and any other diagram/CLAUDE.md
     text that enumerates frame-src or desktop apps updated. CLAUDE.md's "Adding a project later"
     gets one line noting that an *embedded* app additionally needs an icon, an `APPS` entry, a
     `frame-src` allowance, and a `frame-ancestors` change on the target site.
   - ampline-website `0.3.0 → 0.3.1` (header change plus the already-unreleased playground-link
     fix; no new features). CHANGELOG `[0.3.1]`. Its releases are marked pre-release; keep that.
8. **Releases:** after both merges, tag and publish a GitHub release in each repo (`v1.2.0`
   latest; `v0.3.1` pre-release), with notes in the style of the previous releases.

## Non-goals

- No SSR route for the embed (`/ampline` etc.); `appIdForPath` unchanged. `/projects/ampline-claude`
  remains the crawlable write-up.
- No change to Blitzcast, other icons, the window manager, or ampline's visible content.
- security.txt / Cloudflare toggles (pending from an older note) are **not** in this change unless
  Carter adds them.

## Anti-goals (fails even if it "works")

- Any commit, PR, merge, tag, or release in either repo not authored by Carter Tull
  (`carterptull@gmail.com` / GitHub `carterptull`). No `Co-Authored-By` trailers, no "Generated
  with Claude Code" lines, no bot authors. Carter must remain the sole contributor of both repos.
- Widening ampline.js.org's framing beyond cartertull.com/www.cartertull.com, or loosening any
  other directive on either site.
- An icon with color fills, a new palette entry, or a flat `#E23A3A`.
- The word "Paymon" anywhere in portfolio code/copy/assets (hard constraint). Note: the embedded
  ampline.js.org footer shows "© 2026 Paymon Software", exactly as the embedded blitzcast.app
  does today; that's the other site's content and is accepted precedent.
- Merging either PR before Carter has reviewed the work running locally in Chrome.

## Constraints

- All of the portfolio's CLAUDE.md hard constraints (one scarlet, `@layer components`, keyboard +
  touch paths, perf budget, minimal comments, pinned deps untouched).
- Next.js in this repo is newer than training data; read `node_modules/next/dist/docs/` before
  touching Next-specific APIs (this change shouldn't need any new ones).
- Branches: `ct/feature/ampline-addition` (portfolio) and `ct/feature/allow-portfolio-embed`
  (ampline-website). Merge-commit merges (`gh pr merge --merge`), matching history.
- Required check on portfolio main: "Lint & Build". ampline-website CI runs `npm run sync:check`
  and `npm test`.

## Sequencing (decided)

1. Implement both branches; `npm run lint`, `npm test`, `npm run build` (portfolio) and
   `npm test`, `npm run sync:check` (ampline-website) green locally.
2. Push both, open both PRs, wait for CI green.
3. **Local review in Chrome for Carter.** Production ampline.js.org still refuses framing and,
   even after the change, won't allow `localhost:3000`. So the review setup is throwaway and never
   committed: run ampline-website's `npm run dev` (serves the branch's real headers), put a
   scratchpad proxy in front of it that appends `http://localhost:3000` to `frame-ancestors`, and
   run the portfolio dev server with a temporary uncommitted edit pointing the iframe URL and
   `frame-src` at that proxy. Verify the icon, Start menu, desktop + mobile window, project page
   links, and console. Stop and hand to Carter. Revert the temporary edit afterward
   (`git status` clean).
4. After Carter approves: merge ampline-website first, wait for the Vercel deploy, confirm with
   `curl -sI https://ampline.js.org/` that the new `frame-ancestors` is live. Then merge the
   portfolio, confirm the production deploy at https://cartertull.com embeds ampline in a real
   browser.
5. Tag + release both repos. Verify authorship with `git log --format='%an <%ae> | %cn <%ce>'`
   over the new commits and the contributors API for both repos. Pass rule (builder's call,
   matching every existing merge in both repos): branch commits are author **and** committer
   `Carter Tull <carterptull@gmail.com>`; GitHub-made merge commits are author
   `Carter Tull <…+carterptull@users.noreply.github.com>` with committer `GitHub` — that is how
   GitHub records a merge Carter performs, and the contributors API must list only `carterptull`.

## Notes from the builder check

- ampline-website's `test/html-contract.test.mjs` asserts no CSP directive names a remote host;
  update it so `frame-ancestors` (only) may list exactly the two cartertull.com origins.

## Left to the builder

- Exact pixel coordinates of the icon (within the shape/palette rules above).
- Initial window size (start from Blitzcast's 720×640; adjust if ampline's layout reads poorly).
- Iframe `title` text (descriptive, e.g. "Ampline — Color-Graded Statusline for Claude Code").
- Exact doc wording, as long as it matches each file's existing style.
