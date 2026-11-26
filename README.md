# Portfolio

[![CI](https://github.com/mshirish/Portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/mshirish/Portfolio/actions/workflows/ci.yml)

My personal portfolio: a single-page site with a dark, minimal layout and small pixel-art space decorations that move with scroll.

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
| `npm run check:contrast` | Check every text color against the ghost-art colors (also runs in CI) |

## Editing content

All copy lives in `src/data/*.ts`. Components never hardcode text.

- `site.ts`: name, role, status, location, hero tagline and bio, contact headline, and the page description. The page `<title>` and meta description are generated from it at build time.
- `experience.ts`: one entry per company, with `company`, `location`, an optional `companyHref` (the company shows as plain text without it, as a link with it) and a `roles` list. Each role has `title`, `start`, `end` and `summary`; put a promotion as another role under the same company, newest first.
- `education.ts`: one entry per degree, with `degree`, `school`, `schoolHref`, `location` and `date`.
- `links.ts`: the contact links in the footer, in display order. `mailto:` links open in the same tab; the rest open in a new tab.
- `projects.ts`: one entry per project (see "To add a project" below for every field).
- `skills.ts`: the Skills section's groups of chips (see "To add a skill" below).
- `certifications.ts`: one entry per certification (see below).

Images used by data files live in `src/assets/` and are imported, not put in `public/`.

An empty array hides its section, its menu link and its pixel piece, so a section can be switched off by emptying its data.

### The menu

Navigation is a burger button in the sticky top bar that opens a full-screen menu, on every screen size. The menu's section links aren't a separate list: `App.tsx` builds them from the same `SECTIONS` list that renders the page (label and `#id`), plus "Contact". To rename a link, change its `label` in `SECTIONS`; to add one, add the section there. The row of links under them (Email, GitHub, LinkedIn) comes from `links.ts`, like the footer's.

To add a skill:

1. Find the icon on [react-icons](https://react-icons.github.io/react-icons/). Prefer Simple Icons (`Si…`, from `react-icons/si`). Simple Icons has no AWS or C# logo, so those use `FaAws` (`react-icons/fa`) and `TbBrandCSharp` (`react-icons/tb`).
2. Import it at the top of `src/data/skills.ts`.
3. Add one line to the right group's `items`:
   ```ts
   { name: "Kubernetes", icon: SiKubernetes, color: "#326CE5" },
   ```
   `color` is the icon's color on hover. It must have at least 3:1 contrast against the surface `#18181C`. If the brand color is darker than that, lighten it slightly (Terraform uses `#8651C1` instead of `#7B42BC`). For a black logo, use the text color `#F2F2EF`.

To add a group, add an entry to `skillGroups` with a `label` and its `items`. Groups show in array order, three columns from `md`. A group with no items is skipped.

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
3. Import them in `projects.ts` and add an entry, with `draft: true` until it's verified (see below). Every case-study claim must be checkable in the project's own repo.

Required fields:

| Field | What it is |
|---|---|
| `slug` | URL id: the modal opens at `/#project/<slug>` |
| `name`, `subtitle` | Card and modal title; the subtitle shows under the modal title |
| `summary` | One or two sentences for the card |
| `tech` | List shown as the mono tech line |
| `backdrop` | Hex color of the card's folder |
| `images` | Up to three imported screenshots; `images[0]` is the front sheet and the modal's media |
| `repoUrl` | Source code link ("Code ↗" on the card, "View source code ↗" in the modal) |

Optional fields (each section of the modal only appears when its field is set):

| Field | What it does |
|---|---|
| `demoUrl` | "Live demo ↗" on the card and the "Try it yourself" button. Without it the modal shows "Live demo · soon". Demos are only linked to, never embedded. |
| `demoNote` | Longer note under the demo button (how to sign in, quotas) |
| `wakeNote` | One short line for demos on free hosting that sleep ("the first load can take about a minute"), on the card and in the modal |
| `warmupUrl` | A cheap endpoint on the demo's backend. It's fetched once per page view, when the card scrolls into view or its modal opens, so the backend is awake by the time someone clicks. Skipped for visitors with Save-Data on. |
| `howItWorks` | Ordered steps, shown as a numbered list |
| `highlight` | One achievement line (e.g. "1st of 15 teams · Hack4Good 2026"), shown in the text color on the card under the tech line and under the modal subtitle |
| `credits` | `{ text, people: { name, href? }[], detail? }` for a project built with others. Names are joined "A, B and C" and are links only when they have an `href`. `detail` says what they built. Always credit collaborators. |
| `extraLinks` | `{ label, href }[]`: more links beside "View source code" |
| `gallery` | `{ title, items }`, each item `{ src, alt, caption, width, height }` (imported image and its intrinsic size) |
| `video` | `{ src, poster, description, aspect?, note? }`, shown in place of `images[0]` in the modal. Import the mp4 and a poster WebP (1600px wide) from `src/assets/projects/<slug>/`. `aspect` is `"16/9"` or `"16/10"` (default) so the video isn't cropped; `note` shows under it and must say so when the video uses sample data. Videos never autoplay and load nothing until played (`preload="none"`). Keep the file small (CartTweak's is 1.6 MB) |
| `caseStudy` | `{ overview, built, cloud?, limitations? }`. `cloud` is `{ views, decisions }`: one view renders as a single "Architecture" diagram, several get tabs. Diagram nodes sit on a `col`/`row` grid of up to 3 columns. |

If the site ever gets a Content-Security-Policy, add each `warmupUrl` origin to `connect-src`.

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

## Pixel art

The decorations are a small space scene drawn as inline SVG: a dim starfield behind the page, a moon, ringed planet, satellite and rocket in the hero, a piece beside each section, and a launch pad in the footer. Each part has a placement per screen size: on phones and tablets the hero art sits in a band above the text, section pieces sit in the gaps between sections and the launch pad sits under the footer's last line. The rules (colors, placement, motion) are in [CLAUDE.md](CLAUDE.md); this is the how-to.

Sprites are grids of **color roles**, not hex colors. Each cell is a role name such as `"rocket-body"` or `null` for transparent, and renders as `fill="var(--px-rocket-body)"`. The roles and their colors are in `src/index.css` (`--px-*`) and the list of names is `PIXEL_ROLES` in `src/components/pixel/pixelGrid.tsx`.

To add a space sprite:

1. Draw it as a grid in `src/components/pixel/` (sprites shared by several components go in `spaceSprites.ts`). Draw it for 4px per cell; smaller screens render the same grid at 2px or 3px. Small ones are easiest by hand, as rows of characters mapped to roles (see the astronaut in `spaceSprites.ts`):
   ```ts
   const KEY: Record<string, PixelRole | null> = { ".": null, B: "rocket-body", V: "rocket-window" }
   const helmet: PixelGrid = [".BB.", "BVVB", "BVVB", ".BB."].map((row) => [...row].map((ch) => KEY[ch]))
   ```
   Round or tilted shapes are easier from math: `rasterize`, `inDisc`, `trimGrid` and `rotatedShape` in `pixelShapes.ts`. Never rotate pixel art with CSS; draw it already rotated.
2. Need a new color? Add a role to `PIXEL_ROLES` and a `--px-<role>` value in `index.css`. Use one solid color, and keep the total around two dozen.
3. Render it with `<PixelSprite grid={helmet} />`. For a floating object, add the bob with its own timing so it doesn't move in step with the others:
   ```tsx
   <PixelSprite grid={helmet} className="px-bob" style={bobStyle(4.2, 1.3)} />
   ```
   Grounded art doesn't bob.

### Ghost art and the contrast check

Ghost art is the large, very dim layer behind the text: a giant planet arc, a big moon, a ringed planet and nebulae. It's the only art besides the starfield allowed behind text, so it may only use the ghost roles (`--px-ghost-*` in `src/index.css`), and every text color must keep at least 4.5:1 contrast against each of them.

To check, run:

```sh
npm run check:contrast
```

It reads the colors from `src/index.css`, finds every `text-<color>` class used in `src/`, prints each text color's contrast against each ghost role (and the starfield's against the background), and exits 1 if anything is under 4.5:1 (or the starfield is over 1.6:1). CI runs it on every push and pull request. If you add a text color that never sits over ghost art (for example, inside a dialog), add it to `EXEMPT` in `scripts/check-contrast.mjs` with the reason.

To add a ghost piece:

1. Draw it in `src/components/pixel/ghost/ghostShapes.ts` with the shape helpers, using only `ghost-*` roles. Keep it under about 400 merged rects (`renderPixelGrid` merges horizontal runs, so smooth shapes cost less than noisy ones).
2. In `GhostLayer.tsx`, add a component that renders it with `GhostPiece`, with one position for `lg` and up (6px per cell) and one below (4px per cell). Positions are offsets in % of the section; use `calc(50% - 50vw - …)` to anchor to the screen's left edge:
   ```tsx
   export function TalksGhost() {
     return <GhostPiece grid={nebulaTall} lg={{ left: "60%", top: "10%" }} sm={{ left: "30%", top: "20%" }} />
   }
   ```
3. Put it first inside its section (which must be `relative`). It's static: no bob, twinkle or drift.
4. Run `npm run check:contrast`, and look at it at 390, 768 and 1440px: visible, but quiet, with the text as clear as before. If you add or change a ghost color, the check tells you whether it's still dark enough.

To place a piece beside a section, give it two versions that share the same sprite grids from `spaceSprites.ts`:

- a **margin piece** for 1280px and up, in the empty gutter beside the column (`MarginSprite`)
- a **gap piece** for smaller screens, in the gap between this section and the one above it (`GapSprite`)

1. In `SpacePieces.tsx`, build the margin piece: a 64px-wide box (`PIECE_WIDTH`) at 4px per cell with the sprite and a few stars (`StarCluster`; mark about one in four `twinkle: true`).
2. Build the gap piece: the same sprite in a compact box with 1–2 stars beside it, rendered at the `px` it's given (2 or 3). It has to fit the gap: at most 24 rows tall (48px at 2px below `md`, 72px at 3px from `md`). Add its height in cells to `GAP_ROWS` in `spaceSprites.ts`.
3. Make the section `relative` and put both first inside it:
   ```tsx
   <section id="talks" className="section-y relative">
     <MarginSprite side="left" top={40} width={PIECE_WIDTH} speed={0.1}>
       <HelmetPiece />
     </MarginSprite>
     <GapSprite side="left" rows={GAP_ROWS.helmet}>
       {(px) => <HelmetGap px={px} />}
     </GapSprite>
   ```
   Use the same `side` for both. For `MarginSprite`, `top` is px below the section's top and `speed` is the parallax (0.05–0.15); it only renders from 1280px, and only when the gutter is at least the piece's width plus 24px. `GapSprite` hides itself from 1280px, centers the piece in the gap above the section and aligns it to the column edge; it has no parallax.
4. Check it: at 360, 390, 768, 1024, 1280, 1440 and 1920px, scroll through the page and make sure the piece's box never touches text, links or cards, and that section heights don't change. Check that it sits still with reduced motion on.

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
    pixel/            pixel-art space scene: sprites, starfield, ghost art, MarginSprite, GapSprite
  data/               all site copy
  hooks/              useParallax (page, element and footer parallax), useProjectRoute, useWarmup
scripts/                 check-contrast.mjs (npm run check:contrast)
media/                   local-only capture tooling (separate npm project)
Dockerfile, nginx.conf   container image
.github/workflows/       CI
```

Design rules (colors, type, motion, pixel-art roles and placement) are in [CLAUDE.md](CLAUDE.md).
