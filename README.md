# Portfolio

[![CI](https://github.com/mshirish/Portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/mshirish/Portfolio/actions/workflows/ci.yml)

My personal portfolio: a single-page site with a dark, minimal layout and small pixel-art decorations that move with scroll.

**Stack:** Vite, React, TypeScript, Tailwind CSS v4, Framer Motion, react-icons. Served as static files by nginx in a container.

## Running locally

Requires Node 24 (see `.nvmrc`).

```sh
npm ci
npm run dev
```

| Script | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run lint` | Run oxlint |

## Editing content

All copy lives in `src/data/*.ts`. Components never hardcode text.

- `site.ts`: name, role, status, hero tagline and bio, and the page description. The page `<title>` and meta description are generated from it at build time.
- `stack.ts`, `projects.ts`, `experience.ts`, `links.ts`: one file per section.

## Docker

The image serves the built site with unprivileged nginx on port 8080.

```sh
docker build -t portfolio .
docker run --rm -p 8080:8080 portfolio
# open http://localhost:8080
```

Or pull the published image:

```sh
docker run --rm -p 8080:8080 ghcr.io/mshirish/portfolio:latest
```

## CI

`.github/workflows/ci.yml` runs on every pull request and on pushes to `main`:

- **Pull requests:** lint, build, then build the image and smoke-test it (config check, page title, cache and security headers, health check, 404s). Nothing is published.
- **`main`:** the same checks, then a multi-arch (amd64, arm64) image is pushed to `ghcr.io/mshirish/portfolio`, tagged `latest` and with the commit SHA.

## Layout

```
src/
  components/         one file per page section
    pixel/            pixel-art SVG decorations
  data/               all site copy
  hooks/              useParallax, useTargetParallax
Dockerfile, nginx.conf   container image
.github/workflows/       CI
```

Design rules (colors, type, motion, pixel-art placement) are in [CLAUDE.md](CLAUDE.md).
