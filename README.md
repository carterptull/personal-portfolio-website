# Carter Tull — Portfolio

[![CI](https://github.com/carterptull/personal-portfolio-website/actions/workflows/ci.yml/badge.svg)](https://github.com/carterptull/personal-portfolio-website/actions/workflows/ci.yml)

**[cartertull.com](https://cartertull.com)**

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

### Configuration

`NEXT_PUBLIC_SITE_URL` is the one environment variable, and it sets the origin used by every
canonical tag, OG image URL, `sitemap.xml` entry, and the JSON-LD `Person`. Resolution order:

1. `NEXT_PUBLIC_SITE_URL`, if set — put it in `.env.local` for local overrides, or in the
   hosting provider's environment settings for a deploy.
2. Vercel's system variables (production domain on production, per-deploy URL on previews), so
   preview deployments self-canonicalize rather than claiming to be production.
3. `http://localhost:3000`, so a fresh clone builds and runs with no setup.

Nothing else is configurable and there are no secrets — see [SECURITY.md](SECURITY.md).

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
