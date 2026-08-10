# Carter Tull — Portfolio

Personal portfolio built as a retro **Windows 95/98 desktop**: draggable windows, a taskbar
and Start menu, a boot sequence, a CRT toggle, and an idle-triggered 3D Pipes screensaver —
on top of a fully server-rendered, crawlable content layer.

## Tech stack

- **Next.js (App Router) + TypeScript**, Tailwind CSS v4
- **Zustand** window manager; hand-rolled Pointer Events drag/resize
- **@react-three/fiber + three** for the idle-gated screensaver (lazy, off the critical path)
- `next/font` self-hosted pixel UI font; `next/og` dynamic OG images

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

Production build:

```bash
npm run build
npm run start
```

Optional: set `NEXT_PUBLIC_SITE_URL` in a local `.env.local` file (defaults to
`http://localhost:3000`; set to the real domain when deploying).

## How it's put together

Two layers, same content:

- **SSR layer** — `/`, `/about`, `/projects`, `/projects/[slug]`, `/contact` are real
  server-rendered routes. The whole site is readable with JavaScript disabled.
- **Desktop layer** — a client-side Win95 shell hydrates on top and presents the same
  content components inside floating windows (full-screen apps with a Back button on mobile).

More detail in [CLAUDE.md](CLAUDE.md) (architecture map),
[DECISIONS.md](DECISIONS.md) (why each choice was made),
[CHANGELOG.md](CHANGELOG.md) (release history), and
[SECURITY.md](SECURITY.md) (how to report a vulnerability).

## Project structure

```
src/
  app/                  # routes, metadata, OG images, sitemap/robots/manifest
  components/
    content/            # pure content components (shared by both layers)
    desktop/            # window manager UI, taskbar, boot, icons
    screensaver/        # idle-gated 3D pipes
    ssr/                # server-rendered page chrome
  content/              # all copy/data: profile, projects, skills, videos
  store/                # Zustand window store
public/                 # brand mark, manifest icons
```

## License

MIT — see [LICENSE](LICENSE). Copyright (c) 2026 Carter Tull.
