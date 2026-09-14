# Overview — the whole site in one diagram

Start here. Every idea below is expanded in its own diagram — follow the links at the bottom
for the detail behind any one piece.

```mermaid
flowchart TB
    visitor(["👤 Visitor<br/><small>JS on or off · any motion preference</small>"])

    visitor --> cdn[("☁️ Vercel CDN<br/><small>static HTML, prerendered at build time</small>")]

    cdn --> split{"Same page,<br/>two layers"}

    split --> ssr["📄 <b>SSR content layer</b><br/><small>real routes: / /about /projects<br/>/projects/[slug] /contact<br/>readable with JS off</small>"]
    split -.->|"hydrates on top,<br/>client-only"| desktop["🖥️ <b>Desktop chrome layer</b><br/><small>Win95 shell: boot, icons,<br/>windows, taskbar</small>"]

    ssr --> shared["🧩 <b>Shared content components</b><br/><small>src/components/content/*<br/>pure — rendered by BOTH layers above</small>"]
    desktop --> shared

    desktop --> store[("🗂️ Zustand stores<br/><small>window positions, focus,<br/>screensaver state</small>")]

    ssr --> headers["🔒 <b>Security headers</b><br/><small>CSP, HSTS, frame policy<br/>— every route, next.config.ts</small>"]

    style ssr fill:transparent,stroke:#BB0000,stroke-width:2px
    style desktop fill:transparent,stroke:#555,stroke-width:2px
    style shared fill:transparent,stroke:#888,stroke-width:1px,stroke-dasharray: 3 3
```

**The one thing to take away:** this is a normal, boring, fully-crawlable content site that
happens to *also* present itself as a desktop, not a desktop app with a content site bolted
on for SEO. If you disable JavaScript right now, every page still works.

## Go deeper

| Question | Diagram |
| --- | --- |
| Who talks to this system, and what does it talk to? | [`c4-context.md`](c4-context.md) |
| What are the internal pieces and how do they depend on each other? | [`c4-container.md`](c4-container.md) |
| How exactly do the two layers share content? | [`dual-layer-architecture.md`](dual-layer-architecture.md) |
| What are the actual types behind the store and app registry? | [`class-diagram.md`](class-diagram.md) |
| What states does a window move through? | [`window-lifecycle-state.md`](window-lifecycle-state.md) |
| What happens between first paint and an interactive desktop? | [`boot-sequence.md`](boot-sequence.md) |
| What happens when an icon is clicked? | [`open-app-flow.md`](open-app-flow.md) |
| How is this deployed and secured? | [`deployment-security.md`](deployment-security.md) |

---
_Last updated: 2026-09-14 · reflects v1.1.2_
