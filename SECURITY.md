# Security Policy

This repository is the source for [cartertull.com](https://cartertull.com) — a static personal
portfolio. It has no backend, no authentication, no database, no cookies, and no user input:
every route is prerendered to static HTML at build time and served from a CDN. The practical
attack surface is the dependency tree, the build/deploy pipeline, and the response headers.

## Supported versions

Only the latest release and the current `main` are supported. There are no maintained release
branches; fixes ship forward.

| Version | Supported |
| ------- | --------- |
| 1.0.x   | Yes       |
| < 1.0   | No        |

## Reporting a vulnerability

Please **do not** open a public GitHub issue for a security vulnerability. Use GitHub's private
vulnerability reporting:
[github.com/carterptull/personal-portfolio-website/security/advisories/new](https://github.com/carterptull/personal-portfolio-website/security/advisories/new).

Expect an acknowledgement within 7 days. This is a personal project maintained in spare time —
there is no bug bounty, and no SLA beyond a good-faith effort to fix real issues promptly.

Useful things to include: affected URL or file, the version or commit, reproduction steps, and
what an attacker gains.

### In scope

- `cartertull.com` and its subdomains
- This repository's source, CI workflow, and dependency manifests

### Out of scope

- Findings against third-party services the site merely links to or embeds (GitHub, LinkedIn,
  YouTube, Vercel)
- Missing headers that are deliberate documented trade-offs — see below
- Automated scanner output with no demonstrated impact, volumetric/DoS testing, social
  engineering, and physical attacks

## Current posture

- **Response headers** (`next.config.ts`): CSP, `X-Frame-Options: DENY`, `X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy`, and HSTS with `preload`.
- **Known CSP trade-off:** `script-src` includes `'unsafe-inline'`. A nonce-based policy requires
  per-request rendering, which would defeat the fully-static delivery this site's performance
  budget depends on. With no user input, auth, or persistence anywhere in the app, the injection
  surface is compile-time constants only, and `frame-ancestors 'none'` closes the realistic
  (clickjacking) threat. Revisit if the site ever gains a dynamic route or a form.
- **Dependencies:** Dependabot alerts, automated security updates, and grouped weekly version
  updates (`.github/dependabot.yml`) are enabled.
- **Secrets:** none in source. The only environment variable, `NEXT_PUBLIC_SITE_URL`, is a public
  value by design. Secret scanning with push protection is enabled on the repository.
- **CI:** every push and pull request to `main` must pass lint and build; the workflow runs with
  a read-only `GITHUB_TOKEN` and consumes no secrets. `main` is protected — changes go through a
  pull request, force-pushes and deletions are blocked, and the rules apply to admins.
