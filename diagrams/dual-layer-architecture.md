# Component diagram — dual-layer architecture

`CLAUDE.md` calls this "the one rule that matters": content and desktop chrome are separate
layers, and content must never exist only inside a window. This is the project's most
distinctive engineering decision, so it gets its own diagram rather than living only inside
the C4 container view.

```mermaid
flowchart LR
    subgraph server["Rendered on the server (prerendered at build time)"]
        direction TB
        page["src/app/about/page.tsx<br/>(and /projects, /contact, …)"]
        ssrWrap["src/components/ssr/*<br/><small>header/footer, static window-frame chrome</small>"]
        page --> ssrWrap
    end

    subgraph shared["Shared — pure, presentational, no window knowledge"]
        AboutContent["AboutContent"]
        ProjectContent["ProjectContent"]
        SkillsContent["SkillsContent"]
        ContactContent["…etc, src/components/content/*"]
    end

    subgraph client["Hydrated in the browser (client-only, dynamic ssr:false)"]
        direction TB
        db2["DesktopBoundary"]
        chrome2["DesktopChrome<br/><small>boot · icon grid · taskbar</small>"]
        fw["FloatingWindow<br/>(≥768px) or<br/>MobileShell (<768px)"]
        windowOnly["Window-only apps<br/><small>BlitzcastContent · AmplineContent (cross-origin iframes),<br/>ResumeContent, MediaPlayerContent — no SSR route</small>"]
        db2 --> chrome2 --> fw
        fw --> windowOnly
    end

    ssrWrap --> AboutContent
    ssrWrap --> ProjectContent
    ssrWrap --> SkillsContent
    ssrWrap --> ContactContent
    fw --> AboutContent
    fw --> ProjectContent
    fw --> SkillsContent
    fw --> ContactContent

    style server fill:transparent,stroke:#BB0000,stroke-width:2px
    style client fill:transparent,stroke:#555,stroke-width:2px
    style shared fill:transparent,stroke:#888,stroke-width:1px,stroke-dasharray: 3 3
```

**Why it's built this way:** a crawler, a link-preview bot, a no-JS browser, and a
`prefers-reduced-motion` visitor all get the *exact same content* the server rendered — not a
stripped-down fallback. The desktop shell is presentation layered on top, never the only
place the content exists. The rejected alternative — render content only inside windows after
a click, the common "Win95 portfolio" approach — is invisible to crawlers and blocks LCP on a
JS boot. See the "Dual-layer architecture" entry in `DECISIONS.md`.

**How a page gets read twice:** `src/app/about/page.tsx` renders `<AboutContent>` directly
into server HTML. Separately, `apps.tsx`'s `about` entry in the app registry renders that same
`<AboutContent>` inside a `FloatingWindow` once the desktop hydrates. Same component, same
props shape, two call sites — nothing in `AboutContent` itself knows or cares which one is
rendering it.

**The window-only apps hold none of this site's own content:** Blitzcast and Ampline embed
separate live products cross-origin, and each one's crawlable write-up is its `/projects/[slug]`
page; Resume wraps a directly linkable PDF, and the Media Player plays YouTube videos. See
"Blitzcast is a desktop-only app with no SSR route" in `DECISIONS.md`.

**Enforcement, not just convention:** `DesktopBoundary` dynamically imports `DesktopChrome`
with `ssr: false`, so the whole client layer (store, windows, taskbar) is structurally
incapable of shipping content the server didn't already render — there's no code path where
the desktop layer is the *first* place a visitor's content appears.

---
_Last updated: 2026-10-23 · reflects v1.2.1_
