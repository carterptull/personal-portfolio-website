# Architecture diagrams

Visual counterparts to [`CLAUDE.md`](../CLAUDE.md) (architecture map) and
[`DECISIONS.md`](../DECISIONS.md) (why each choice was made) — these diagrams show the
shape of the decisions, that log explains the reasoning behind them.

| Diagram | Shows |
| --- | --- |
| [`overview.md`](overview.md) | Start here — the whole site in one diagram, linking out to the rest |
| [`c4-context.md`](c4-context.md) | Where this site sits relative to its visitors and its two external dependencies |
| [`c4-container.md`](c4-container.md) | The high-level pieces inside the app and how they depend on each other |
| [`dual-layer-architecture.md`](dual-layer-architecture.md) | The one rule that matters: SSR content and desktop chrome rendering the same components |
| [`class-diagram.md`](class-diagram.md) | The actual TypeScript shapes behind the store and app registry, and how they relate |
| [`window-lifecycle-state.md`](window-lifecycle-state.md) | The states a window moves through, and what triggers each transition |
| [`boot-sequence.md`](boot-sequence.md) | What happens between first paint and an interactive desktop |
| [`open-app-flow.md`](open-app-flow.md) | What happens when an icon (or a direct URL) opens a window |
| [`deployment-security.md`](deployment-security.md) | Request path through Vercel, and where the CSP's load-bearing exceptions come from |

## Keeping these current

These are hand-maintained, not generated — each file carries a footer stamp
(`Last updated: <date> · reflects v<version>`) so staleness is visible rather than silent.
Re-check them after a change that alters one of these shapes specifically: the dual-layer
split, the window store's fields/transitions, the app registry, the boot/screensaver gating,
or the CSP. A routine content or styling change doesn't need a diagram update.

This repo has a `mermaid-architect` skill (scans the actual code and rewrites diagrams to
match) that can do that re-check — ask for it by name when one of those shapes changes,
rather than editing these by hand from memory.
