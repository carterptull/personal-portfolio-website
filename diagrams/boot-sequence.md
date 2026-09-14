# Sequence diagram — boot sequence

What happens between first paint and an interactive desktop. The boot screen is an *overlay*
over already-rendered content, never a loader gating that content — see the "Boot sequence as
overlay, never a loader" entry in `DECISIONS.md`.

```mermaid
sequenceDiagram
    actor V as Visitor
    participant S as Next.js server
    participant B as Browser (paint)
    participant DB as DesktopBoundary
    participant DC as DesktopChrome
    participant BS as BootScreen
    participant SS as sessionStorage

    V->>S: GET /about (or any route)
    S-->>B: Full server-rendered HTML (.ssr-layer)
    Note over B: LCP happens here — real content,<br/>no JS required yet

    B->>DB: Hydrate — dynamic import, ssr:false
    DB->>DC: mount DesktopChrome
    DC->>SS: read "booted", read prefers-reduced-motion

    alt already booted this session, OR reduced motion
        DC->>DC: showBoot = false
        Note over DC: Desktop renders immediately,<br/>no overlay at all
    else first visit this session, motion OK
        DC->>BS: render BootScreen overlay (z-50, on top of .ssr-layer)
        loop 5 BIOS lines, 220ms apart
            BS->>V: print next line
        end
        BS->>V: show splash (logo + progress bar), ~1.3s
        alt visitor clicks "Skip"
            V->>BS: click Skip
        else timer completes (DONE_AT ≈ 2.4s total)
            BS->>BS: onDone timer fires
        end
        BS->>SS: write "booted" = "1"
        BS->>DC: onDone() → setBooted(true)
        DC->>DC: unmount BootScreen
    end

    DC->>DC: document.body.classList.add("desktop-active")
    Note over DC: .ssr-layer is now hidden via CSS —<br/>only once the desktop actually exists
```

**Why LCP isn't affected by any of this:** the server-rendered content is already painted
before the desktop layer even starts hydrating (`DesktopBoundary` is `dynamic(..., { ssr:
false })`). The boot overlay, when it runs, sits on top of content that was already there —
it delays nothing perceptible to a search crawler or a no-JS visitor, and the perf budget
(`CLAUDE.md`: LCP ≤2.0s) is measured against that first server paint, not against the desktop
becoming interactive.

**Why `.ssr-layer` is hidden only after mount, not via a server-side flag:** hiding it earlier
would mean a hydration mismatch or a flash of hidden content for the no-JS/JS-disabled case
this architecture exists to serve. It only disappears once `DesktopChrome` has actually
mounted client-side and has somewhere else to put the same content.

---
_Last updated: 2026-09-14 · reflects v1.1.2_
