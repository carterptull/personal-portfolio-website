# Sequence diagram — opening an app

What happens when an icon is clicked, contrasted with a direct URL visit landing on the
desktop layer already hydrated. Both paths converge on the same `openApp()`.

```mermaid
sequenceDiagram
    actor V as Visitor
    participant IG as IconGrid / Taskbar
    participant A as apps.tsx (registry)
    participant WS as windowStore
    participant FW as FloatingWindow

    V->>IG: click "About Me" icon
    IG->>A: openApp("about", trigger=iconEl)
    A->>A: getAppDef("about")

    alt def.launch is set (screen-takeover app, e.g. screensaver)
        A->>A: def.launch() — bypasses windowing entirely
        Note over A: never becomes a window or<br/>a taskbar button
    else def.w/h/render is set (normal app)
        A->>A: remember trigger element (triggers map)
        A->>WS: getState() — check for existing window at this id
        alt window already open
            A->>WS: open() → restore from minimized + focus
        else first open
            A->>A: compute cascade position<br/>(clamped to viewport, offset by open count % 6)
            A->>WS: open({id, appId, title, rect})
        end
        WS-->>FW: order/windows/focusedId update (selector subscriptions)
        FW->>V: window mounts, dynamic-imported content lazy-loads
    end
```

```mermaid
sequenceDiagram
    actor V as Visitor
    participant B as Browser
    participant DC as DesktopChrome (on mount)
    participant A as apps.tsx

    Note over V,B: Direct URL visit, e.g. GET /projects/blitzcast
    B->>DC: hydrate, read window.location.pathname
    DC->>A: appIdForPath("/projects/blitzcast")
    A-->>DC: "project:blitzcast"
    DC->>A: openApp("projects") — parent window first
    DC->>A: openApp("project:blitzcast")
    Note over DC: Focused window drives the URL too —<br/>a focus change replaceState()s the path,<br/>so views stay shareable both directions
```

**Mobile takes a different last step, not a different flow:** below 768px, `apps.tsx` and
`windowStore` behave identically — the branch is purely in what renders the window's content:
`FloatingWindow` (draggable/resizable, desktop) vs. `MobileShell` (full-screen, titlebar with
an X, bottom bar) via `useIsMobile()`. Neither forks the app registry or the store.

**Why singleton windows (id === appId):** re-opening an already-open app restores and focuses
it rather than spawning a duplicate — matches how a visitor actually uses a portfolio, and
keeps the taskbar/route mapping one-to-one. See "Window id === appId" in `DECISIONS.md`.

**Why content is dynamically imported per-app:** each `Content` component (`AboutContent`,
`ProjectContent`, …) is `dynamic()`-imported in `apps.tsx`, so a visitor who only ever opens
"About" never downloads the Skills or Contact bundles — part of the critical-JS-under-150KB
budget in `CLAUDE.md`.

---
_Last updated: 2026-09-14 · reflects v1.1.2_
