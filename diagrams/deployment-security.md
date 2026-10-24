# Deployment & security

Request path through Vercel, and where the CSP's load-bearing exceptions come from. Full
policy lives in `SECURITY.md`; this shows the *mechanism* behind it.

```mermaid
flowchart TB
    dev["Local dev / PR branch"] -->|git push| gh["GitHub"]
    gh -->|"CI: lint + test + build<br/>.github/workflows/ci.yml"| ci{{"Checks pass?"}}
    ci -->|"no"| blocked["Merge blocked<br/>main is protected, admins included"]
    ci -->|"yes, on main"| build["Vercel build<br/>next build — every route prerendered"]
    build --> cdn[("Vercel CDN / Edge")]

    visitor(["Visitor browser"]) -->|"GET /:path*"| cdn
    cdn -->|"static HTML + securityHeaders"| visitor

    subgraph headers["Response headers — next.config.ts, applied to /:path*"]
        csp["Content-Security-Policy"]
        other["X-Frame-Options: SAMEORIGIN<br/>X-Content-Type-Options: nosniff<br/>Referrer-Policy<br/>Permissions-Policy<br/>Strict-Transport-Security (preload)"]
    end

    cdn -.-> headers

    style headers fill:transparent,stroke:#BB0000,stroke-width:2px
```

## The CSP's three load-bearing exceptions

| Directive | Why it isn't the strict default |
| --- | --- |
| `frame-src 'self'` | Chrome renders the resume PDF `<object>` through an **internal viewer frame** — without this, the resume window fails silently (blank, no fallback), not loudly |
| `object-src 'self'` | Needed for that same `<object>` PDF embed |
| `frame-ancestors 'self'` (not `'none'`) | These headers ride on `/Carter-Tull-Resume.pdf` itself — `'none'` would forbid the resume window from framing its own PDF |

## Embedded sibling apps: `frame-src` plus the target's `frame-ancestors`

`frame-src` also names `https://www.blitzcast.app` and `https://ampline.js.org` (next to
`'self'` and `https://www.youtube-nocookie.com`) — the Blitzcast and Ampline windows iframe those
live sites. An embed needs both ends: this site's `frame-src`, and a `frame-ancestors` on the
target listing this site's origins (ampline.js.org allows `https://cartertull.com` and
`https://www.cartertull.com`). Either side missing renders a blank frame with no fallback, so
verify both against production. `src/lib/csp.test.ts` pins this site's side.

`script-src` also keeps `'unsafe-inline'` rather than a nonce: every one of the 31 routes
prerenders to static HTML, and a nonce must be unique per response, which would force
per-request rendering and trade away the site's entire static-delivery story (and the LCP
≤2.0s budget) for XSS defense on a site with no user input, auth, cookies, or database. See
"CSP keeps `'unsafe-inline'`..." in `DECISIONS.md` for the full trade-off, and revisit the
moment this site gains a form or a dynamic route.

**How these were actually verified — not just read on paper:** two of the exceptions above
were found by loading a production build in a real browser and watching the resume window
come up blank, not by reading the CSP spec. `CLAUDE.md` calls this out as a standing
requirement: verify any CSP edit against `npm run build && npx next start` in a real browser.

## Why the attack surface is this small

No backend, no database, no auth, no cookies, no user input anywhere in the app — every route
is prerendered at build time and served as static HTML from a CDN. `NEXT_PUBLIC_SITE_URL` is
the only environment variable, and it's a public value by design. Dependabot (grouped weekly
updates + security alerts; React 19.4+, TypeScript 7+, and ESLint 10+ ignored until upstream peers
support them) and secret-scanning push protection are enabled at the repo level.
See `SECURITY.md` for the reporting policy and scope.

---
_Last updated: 2026-10-23 · reflects v1.2.0_
