# C4 — Level 2: Containers

The high-level pieces inside the app (`src/`) and how they depend on each other. "Container"
here means a deployable/runnable unit in the C4 sense, not a Docker container — this whole
diagram is one Next.js app, but its internal seams are exactly the ones `CLAUDE.md` calls out.

```mermaid
flowchart TB
    visitor(["👤 Visitor"])

    subgraph app["cartertull.com (Next.js app)"]
        direction TB

        subgraph ssr["SSR content layer — src/app/**, src/components/ssr/*"]
            routes["Routes: /, /about, /projects,<br/>/projects/[slug], /contact<br/><small>Server-rendered, crawlable, works with JS off</small>"]
        end

        content["Content components<br/>src/components/content/*<br/><small>Pure/presentational — rendered by BOTH layers below</small>"]

        subgraph desktop["Desktop chrome layer — src/components/desktop/*"]
            boundary["DesktopBoundary<br/><small>dynamic ssr:false — keeps the whole layer<br/>out of server HTML and the critical script set</small>"]
            chrome["DesktopChrome<br/><small>boot overlay, icon grid, taskbar/Start menu</small>"]
            windows["FloatingWindow / MobileShell<br/><small>drag/resize via Pointer Events, or<br/>full-screen apps under 768px</small>"]
        end

        store[("Zustand stores<br/>windowStore · screensaverStore<br/><small>order/openOrder = z-order vs. taskbar order</small>")]

        registry["App registry<br/>src/components/desktop/apps.tsx<br/><small>getAppDef · openApp/closeApp · route↔app mapping</small>"]

        dataFile[("Content data<br/>src/content/*.ts<br/><small>profile, projects, skills, videos</small>")]

        screensaver["3D Pipes screensaver<br/><small>three/R3F — its own async chunk,<br/>idle-gated or manually launched</small>"]
    end

    vercel[["☁️ Vercel<br/>build + static hosting"]]

    visitor -->|HTTPS| routes
    visitor -.->|"hydrates on top"| boundary

    routes --> content
    windows --> content
    content --> dataFile

    boundary --> chrome
    chrome --> windows
    chrome --> store
    windows --> store
    chrome --> registry
    registry --> windows
    registry -->|"AppDef.launch()"| screensaver

    app -->|"deployed to"| vercel

    style ssr fill:transparent,stroke:#BB0000,stroke-width:2px
    style desktop fill:transparent,stroke:#555,stroke-width:2px
```

**The seam that matters:** `content` (pure, presentational, knows nothing about windows) is
rendered by both `routes` (server-side) and `windows` (client-side, inside a floating window
or the mobile full-screen shell). Neither the SSR layer nor the desktop layer owns its own
copy of what a page says — see [`dual-layer-architecture.md`](dual-layer-architecture.md) for
the full picture of that rule, which is this project's central architectural decision.

**Why the store is drawn separate from `DesktopChrome`:** `windowStore` is readable outside
React via `getState()`, so `apps.tsx` (`openApp`/`closeApp`) can imperatively open/close
windows from icon clicks or route changes without those call sites being React components
themselves — see the "Zustand for the window manager" entry in `DECISIONS.md`.

---
_Last updated: 2026-09-14 · reflects v1.1.2_
