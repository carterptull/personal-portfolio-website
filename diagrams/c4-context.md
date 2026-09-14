# C4 — Level 1: System Context

Where the site sits relative to the people and systems around it. No backend, no database,
no third-party auth — the entire "system" is a statically-prerendered Next.js app.

> Drawn as a flowchart, not Mermaid's native `C4Context` type — that renderer is still
> experimental and inconsistent on GitHub. This follows standard C4 Level-1 conventions
> (person, system boundary, external systems) without relying on it.

```mermaid
flowchart TB
    visitor(["👤 Visitor<br/><small>Recruiter, engineer, or anyone with the link.<br/>May have JS disabled or reduced motion set.</small>"])

    subgraph boundary[" "]
        portfolio["🖥️ cartertull.com<br/><small>Next.js app, prerendered to static HTML,<br/>served from a CDN. Dual-layer: crawlable SSR<br/>content + an optional Win95 desktop shell.</small>"]
    end

    vercel[["☁️ Vercel<br/><small>Build, static hosting/CDN — the only deploy<br/>target. Supplies preview-vs-production URLs.</small>"]]
    youtube[["▶️ YouTube (nocookie)<br/><small>Iframe loads only on click —<br/>zero third-party bytes/cookies until then.</small>"]]
    blitzcast[["🏈 blitzcast.app<br/><small>Separate live Next.js app, embedded<br/>read-only via cross-origin iframe.</small>"]]

    visitor -->|"reads / clicks, HTTPS"| portfolio
    portfolio -->|"deployed to, served from"| vercel
    portfolio -->|"loads iframe on demand"| youtube
    portfolio -->|"embeds via iframe"| blitzcast

    style boundary fill:transparent,stroke:#BB0000,stroke-width:2px,stroke-dasharray: 4 3
```

**Why no database, auth, or API layer is on this diagram:** there isn't one. Every route is
prerendered at build time from `src/content/*.ts`; the only runtime state is client-side
(window positions, the CRT toggle, boot-once — all `sessionStorage`/`localStorage` or
in-memory). See [`deployment-security.md`](deployment-security.md) for how that shrinks the
attack surface, and `SECURITY.md` for the policy this maps to.

**Why Blitzcast and YouTube are external systems, not features:** both are genuinely
separate products this site links into, not data this site owns — see the "Blitzcast is a
desktop-only app" and "YouTube via facade pattern" entries in `DECISIONS.md`.

---
_Last updated: 2026-09-14 · reflects v1.1.2_
