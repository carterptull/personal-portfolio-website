# Class diagram — core data model

The actual TypeScript shapes behind the diagrams above, and how they relate. Nothing here is
a class in the OOP sense (this is a functional/hooks codebase) — Mermaid's class-diagram
notation is used because it's the right tool for typed shapes and their relationships, not
because these are instantiated as classes.

```mermaid
classDiagram
    class Win {
        +string id
        +string appId
        +string title
        +WinRect rect
        +"normal"|"minimized"|"maximized" state
        +WinRect? prevRect
    }

    class WinRect {
        +number x
        +number y
        +number w
        +number h
    }

    class WindowStore {
        +Record~string,Win~ windows
        +string[] order
        +string[] openOrder
        +string? focusedId
        +open(win) void
        +close(id) void
        +focus(id) void
        +minimize(id) void
        +toggleMax(id) void
        +move(id,x,y) void
        +resize(id,rect) void
    }

    class AppDef {
        <<discriminated union>>
        +string title
        +Icon
        +string? route
    }
    class WindowedApp {
        +number w
        +number h
        +render() ReactNode
    }
    class LaunchApp {
        +launch() void
    }

    class ScreensaverStore {
        +boolean active
        +boolean pending
        +number pointerGraceUntil
        +Saver?
        +launch(opts) void
        +exit() void
    }

    class Project {
        +string slug
        +string title
        +string role
        +string[] stack
        +string timeframe
        +string summary
        +string problem
        +string[] approach
        +string outcome
        +Links links
        +string status
    }
    class Links {
        +string? repo
        +string? live
        +string? npm
    }

    Win "1" *-- "1" WinRect : rect
    Win "0..1" o-- "1" WinRect : prevRect
    WindowStore "1" o-- "*" Win : windows
    AppDef <|-- WindowedApp
    AppDef <|-- LaunchApp
    LaunchApp ..> ScreensaverStore : launch()\ndelegates to
    Project "1" *-- "1" Links : links
    WindowedApp ..> Project : project: apps used\nfor getAppDef("project:<slug>")
```

**Why `AppDef` is a discriminated union, not one shape with optional fields:** a window-opening
app (`w`/`h`/`render`) and a screen-takeover app (`launch`) are mutually exclusive at the type
level, so `openApp()` can't forget to check which kind it has — the TypeScript compiler
enforces it. Before this, "the screensaver never becomes a window" was an `appId ===
"screensaver"` string check duplicated in `IconGrid` and the Start Menu, which only held while
every future call site remembered to copy it. See "Screen-takeover apps opt out of windowing
through `AppDef.launch`" in `DECISIONS.md`.

**Why `order` and `openOrder` are both plain `string[]` of ids, not richer objects:** the
`Win` each id maps to already lives in `windows`; keeping the ordering arrays as bare ids
means reordering (`focus()` splicing one to the end) never touches window data itself, and
the two arrays can diverge in order without ever duplicating a `Win`.

**`Project` isn't in the window store at all:** it's static content (`src/content/projects.ts`),
looked up by `getAppDef("project:<slug>")` and handed to `ProjectContent` as a prop — the
window store only ever holds the `Win` shell around it (id `"project:<slug>"`), never a copy
of the project data itself.

---
_Last updated: 2026-09-14 · reflects v1.1.2_
