# Manual 3D Pipes screensaver trigger — design

## Problem

The idle-gated 3D Pipes screensaver only fires after 60s of inactivity. There's no way for a
visitor to see it on demand, even though it's a signature visual moment of the site.

## Goal

Add a desktop icon (and matching Start Menu entry) that plays the same screensaver immediately
on click, without duplicating the screensaver's logic or turning it into a floating window.

## Placement

Insert `"screensaver"` into `DESKTOP_APP_IDS` between `"skills"` and `"resume"`:

```
["about", "media", "projects", "skills", "screensaver", "resume", "contact"]
```

Both `IconGrid` and the Start Menu already render off this array, so placement is free once the
entry exists in the right position. Resume and Contact intentionally stay last — the owner's
preference is that recruiter-relevant items (résumé, contact info) sit lowest, least likely to
be the first thing scanned.

## Icon

New `screensaverPx` pixel-rect array in `icons.tsx`, following the existing 16x16 crispEdges
style used by every other icon (`computerPx`, `mediaPx`, etc.): a monitor frame (reusing the
chrome/light/dark bevel already established) with a scarlet-and-chrome pipe run crossing the
dark screen — a deliberate nod to the real Windows 95 "3D Pipes" control panel icon. Exported as
`IconScreensaver`.

## Label

"3D Pipes" — both the Start Menu row and (since it contains no ` - `/`–`/`—` delimiter) the full
icon-grid label, matching `IconGrid`'s existing `title.split(/\s[-–—]\s/)[0]` truncation logic
with no change needed there.

## Not a floating window

Every other desktop icon opens a `FloatingWindow` via `openApp()`. The screensaver is a
full-screen overlay, not a window — no title bar, no taskbar entry, matching how it already
behaves when triggered by the idle timer. So this is the one deliberate special case: clicking
the icon or Start Menu row must skip `openApp()` and call a screensaver-specific trigger
instead.

## Shared trigger: lift state out of `ScreensaverGate`

Today, "launch it" (`fire()`) is a closure trapped inside `ScreensaverGate`'s `useEffect`, only
reachable by the idle timer. Both the idle timer and the new manual trigger need to call the
same code path, so:

- New `src/store/screensaverStore.ts` — a small Zustand store (matching the existing
  `windowStore` pattern): `{ active: boolean; Saver: ComponentType<SaverProps> | null; launch: () => void; exit: () => void }`.
- `launch()` re-implements `fire()`'s existing guards (WebGL support, `document.visibilityState`)
  and the lazy `import("./PipesScreensaver")`, then sets `active`/`Saver` in the store.
- `ScreensaverGate` keeps owning the idle-timer `useEffect` (activity listeners, `IDLE_MS` arm/
  disarm, visibility handling) but calls the shared store's `launch()`/`exit()` instead of local
  `useState`, and renders `<Saver onExit={exit} />` when the store says `active`.
- `IconGrid` and the Start Menu's click handler call `useScreensaverStore.getState().launch()`
  directly when `appId === "screensaver"`, instead of `openApp()`.

## Reduced motion

The idle path's `reducedMotion` check gates the *entire* idle-arming effect in `ScreensaverGate`
— a visitor with `prefers-reduced-motion` never gets the idle timer armed at all. `launch()` is a
separate function and does not check `reducedMotion`, so a manual click plays it regardless.
Per the owner's call: reduced-motion settings suppress motion the user didn't ask for; a
deliberate click on a "3D Pipes" icon is explicit opt-in.

## WebGL fallback

If `webglOk()` is false, `launch()` simply returns without setting `active` — same silent no-op
the idle path already has. No error state, no toast; a visitor without WebGL just doesn't see
the icon do anything, which is consistent with how the rest of the site degrades.

## Out of scope

- No changes to the screensaver's visuals, exit behavior (any activity dismisses it — reused
  as-is), or the idle timer's 60s duration.
- No taskbar button for the screensaver, active or otherwise.
