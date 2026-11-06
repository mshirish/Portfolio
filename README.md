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
- `projects.ts`: one entry per project, with card fields (`name`, `summary`, `tech`, `backdrop`, `images`), links (`repoUrl`, optional `demoUrl`, `demoNote`) and an optional `caseStudy` (overview, what I built, cloud diagram views and key decisions, known limitations). Diagram nodes sit on a `col`/`row` grid of up to 3 columns.
- `stack.ts`, `certifications.ts`: one file per section.

Images used by data files live in `src/assets/` and are imported, not put in `public/`.

To add a certification:

1. Save the badge in `src/assets/certifications/` (for example `my-cert.png`).
2. Convert it to a 192px WebP, then delete the PNG:
   ```sh
   npx --yes sharp-cli -i src/assets/certifications/my-cert.png -o src/assets/certifications/my-cert.webp resize 192 192
   ```
3. Import the WebP in `certifications.ts` and add an entry with `name`, `issuer`, `credentialUrl` and `badge`.

To add a project:

1. Capture screenshots (see below) or save your own PNGs.
2. Convert three of them to 800px-wide WebPs in `src/assets/projects/<slug>/`, named `1.webp`, `2.webp`, `3.webp`:
   ```sh
   npx --yes sharp-cli -i media/captures/<slug>/01-storefront.png -o src/assets/projects/<slug>/1.webp resize 800
   ```
3. Import them in `projects.ts` and add an entry. Every case-study claim must be checkable in the project's own repo.

### Draft projects

Set `draft: true` while a case study is unverified. A DRAFT tag shows on the card and in the modal, and CI fails on any `draft: true` in `src/data`, so a draft can't be merged. Remove the flag once every claim checks out.

### Screenshot capture (`media/`)

`media/` is a separate, local-only Node project. It is not part of the site build, lint or Docker image, and its captures are gitignored.

```sh
cd media
npm ci
npx playwright install chromium
npm run capture        # writes media/captures/levant-table/*.png and targets.json
```

`npm run capture` drives the live Levant Table demo in Chromium (1440×900 at 2×): it logs in, walks the order flow through Stripe test checkout and saves one PNG per screen. `targets.json` records, for each screen, the box of the element clicked next, for animating a cursor in the demo video. A failed step is reported and skipped; earlier captures are kept.

Credentials go in `media/.env.local` (gitignored):

| Variable | Needed for |
|---|---|
| `DEMO_EMAIL`, `DEMO_PASSWORD` | Customer login (steps 01–07) |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Optional: the admin order list (step 08) |
| `LEVANT_URL` | Optional: override the demo URL |

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
  assets/             images imported by data files (certification badges, project screenshots)
  components/         one file per page section
    pixel/            pixel-art SVG decorations
  data/               all site copy
  hooks/              useParallax, useTargetParallax
media/                   local-only capture tooling (separate npm project)
Dockerfile, nginx.conf   container image
.github/workflows/       CI
```

Design rules (colors, type, motion, pixel-art placement) are in [CLAUDE.md](CLAUDE.md).
