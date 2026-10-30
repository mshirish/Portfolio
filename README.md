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

- `site.ts`: name, role, status, location, hero tagline and bio, contact headline, and the page description. The page `<title>` and meta description are generated from it at build time.
- `experience.ts`: one entry per company, with `company`, `location`, an optional `companyHref` (the company shows as plain text without it, as a link with it) and a `roles` list. Each role has `title`, `start`, `end` and `summary`; put a promotion as another role under the same company, newest first.
- `education.ts`: one entry per degree, with `degree`, `school`, `schoolHref`, `location` and `date`.
- `links.ts`: the contact links in the footer, in display order. `mailto:` links open in the same tab; the rest open in a new tab.
- `stack.ts`, `certifications.ts`, `projects.ts`: one file per section.

Images used by data files live in `src/assets/` and are imported, not put in `public/`.

To add a certification:

1. Save the badge in `src/assets/certifications/` (for example `my-cert.png`).
2. Convert it to a 192px WebP, then delete the PNG:
   ```sh
   npx --yes sharp-cli -i src/assets/certifications/my-cert.png -o src/assets/certifications/my-cert.webp resize 192 192
   ```
3. Import the WebP in `certifications.ts` and add an entry with `name`, `issuer`, `credentialUrl` and `badge`.

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
  assets/             images imported by data files (e.g. certification badges)
  components/         one file per page section
    pixel/            pixel-art SVG decorations
  data/               all site copy
  hooks/              useParallax, useTargetParallax
Dockerfile, nginx.conf   container image
.github/workflows/       CI
```

Design rules (colors, type, motion, pixel-art placement) are in [CLAUDE.md](CLAUDE.md).
