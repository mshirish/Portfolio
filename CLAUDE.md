# CLAUDE.md — Portfolio Design System

Single-page portfolio for a software developer. Aesthetic: **modern minimal dark portfolio with subtle pixel-art accents**. The pixel art is seasoning, not the meal — content typography is clean and contemporary; pixel elements live at edges and corners and move gently with scroll (parallax).

## Stack
- Vite + React + Tailwind CSS (v4)
- Framer Motion for scroll parallax and reveals (`useScroll` + `useTransform`)
- No UI component libraries. No NES.css/RPGUI. No canvas.

## Design tokens

### Color (dark only, no theme toggle)
| Token | Hex | Use |
|---|---|---|
| `bg` | `#0E0E10` | Page background |
| `surface` | `#18181C` | Cards, stack tiles, footer strip |
| `border` | `#26262C` | 1px hairlines, tile borders |
| `text` | `#F2F2EF` | Headlines, primary text |
| `muted` | `#8B8B94` | Body copy, metadata |
| `accent` | `#7C8CF8` | Name, links, hover states (periwinkle) |
| `status` | `#34D399` | "Open to work" dot only |

Pixel-art palette (decorations only): soft sky blues `#BFD9F2 #8FBCE6`, cloud white `#EDF4FB`, foliage greens `#4E9A51 #2F6B39`, trunk brown `#8A5A32`, moon grey `#D9D9E3`. Max ~8 colors per pixel element. The moon's body is cloud white `#EDF4FB` with moon grey `#D9D9E3` craters.

### Typography
- **Display:** "Clash Display" (Fontshare) or "Space Grotesk" (Google Fonts), weight 600–700, tracking `-0.03em`, for hero name and section headlines. Hero name sized ~`clamp(3rem, 9vw, 6.5rem)`.
- **Body:** "Inter", 400/500, `muted` color, max-width ~60ch.
- **Utility/mono:** "JetBrains Mono", uppercase, `letter-spacing: 0.2em`, 12–13px — for eyebrow labels (`STACK`, `PROJECTS`, `EXPERIENCE`), dates, and metadata. Every section opens with a mono eyebrow label.

### Spacing & layout
- Single column, max-width `~1080px`, generous vertical rhythm: `py-28 md:py-40` between sections.
- Left-aligned content. Pixel decorations anchored to right/corners so they never overlap text at any viewport.
- Cards: `rounded-2xl`, `surface` bg, 1px `border`, no shadows except subtle on hover.

## Pixel-art rules (important)
- Build pixel elements as **inline SVG rect grids** (each "pixel" = one `<rect>` on an integer grid), with `shape-rendering: crispEdges`. No external image assets, no blur, no gradients inside pixel art.
- If a raster sprite is ever used: `image-rendering: pixelated`.
- These rules are for our own SVG art only. Third-party badges (e.g. certification badges) are shown exactly as issued — never pixelated, filtered, recolored, cropped or rounded.
- Placement: clouds + moon top-right of hero; small nest/plant near STACK label; two trees bottom-right of footer, drawn at 2× (`pixelSize` 8), with the bird perched on the larger tree's crown. Corners and margins only.
- Scale pixel art in whole multiples so pixels stay square.

## Motion rules
- Parallax via Framer Motion scroll progress: clouds drift slowly horizontally and translate at ~0.3× scroll speed; moon at ~0.15× (page-relative, via `useParallax(speed)`); footer trees rise a bounded 48px as the footer enters the viewport and are at rest when the page is scrolled to the bottom (via `useTargetParallax(footerRef, 48)`, never page-relative); the perched bird rises with the trees (same parallax wrapper) and gently bobs on its own (2–3px, 3s ease-in-out loop).
- Content: single gentle fade + 12px slide-up reveal per section, once, `viewport={{ once: true }}`. No staggered letter animations, no scroll-jacking.
- Wrap all motion in `useReducedMotion()` — render static when reduced motion is preferred.

## Sections (in order)
1. **Intro/Hero** — mono eyebrow (`SOFTWARE DEVELOPER · OPEN TO WORK` with green dot), huge display name in `accent`, one bold tagline sentence in `text`, 2–3 line bio in `muted`. Pixel clouds + moon top-right.
2. **Stack** — mono `STACK` label, row of rounded `surface` tiles with tech logos (react-icons/simple-icons), subtle hover lift.
3. **Certifications** — mono `CERTIFICATIONS` h2 label, `<ul>` of cards (1-col → `lg:grid-cols-2`, gap-4). Each card is one link to the Credly credential (new tab, visually hidden "(opens in a new tab)"): `rounded-2xl` `surface` card, 1px `border`; issuer badge stacked above the text below `sm`, beside it from `sm`; badge 80px → 96px at `md`, `alt=""`, lazy; mono issuer line, cert name as display h3, "Verify on Credly ↗" in mono `accent`. Hover/focus: border to `accent`, badge lifts 2px (off under reduced motion), subtle shadow. No pixel decoration.
4. **Projects** — mono `PROJECTS` h2 label, `<ul>` grid (1 col → `md:2` → `lg:3`, gap-6). Each card is one `<button aria-haspopup="dialog">` (it opens a dialog, so it's not a link): a solid-color folder preview (backdrop back panel with a black/15 overlay and a top-left tab; up to 3 white screenshot sheets at −3°, +2°, 0°, front one showing `images[0]`; a backdrop "pocket" over the lower ~45% with a 1px white/20 top line), then the name as display h3, summary, mono tech line and "View case study →". Hover/focus: sheets slide up 8px and fan 2° more (`motion-safe:` only). A mono DRAFT tag shows while `draft: true`.
   - **Modal** (`ProjectModal`): native `<dialog>` via `showModal()` (focus trap, inert page), `aria-labelledby` the project name (h2; section labels inside are h3). Fade + scale from 0.96/12px over 250ms, instant under reduced motion. Closes on Esc, ×, backdrop click and the back button; focus returns to the card. Opening pushes `#project/{slug}`; closing from the UI goes `history.back()` if the modal pushed that entry, else replaces the hash with `#projects`; loading `/#project/{slug}` opens it. Page scroll locks with `html:has(dialog[open])` and a stable scrollbar gutter. Panel max-w 960px, scrolls inside; full-height sheet below `md`.
   - **Content order:** name + subtitle; 16:10 media slot (`video` when set, else `images[0]`); "Try it yourself ↗" accent pill (new tab) or a muted "Live demo · soon", "View source code ↗", mono `demoNote`; Overview; What I built; Cloud & operations; Known limitations; Tech.
   - **Cloud & operations** (`CloudTabs`): a segmented pill control (surface track, raised active pill) built as an ARIA tablist (arrow keys, Home/End, `aria-selected`, labelled tabpanels). Each panel: view title, diagram, caption, optional `note`. "Key decisions" sits below the tabs, shared by all views.
   - **Diagram** (`ArchitectureDiagram`): renders any `CloudView` as inline SVG from data only: nodes on a `col`/`row` grid (max 3 columns), rounded surface rects with display-font labels and mono sublabels; 1.5px muted edges with arrowheads (`dashed`, `twoWay` optional) and mono labels on bg chips. Never scales above 1:1. Below `sm` it switches to a single column with long edges in side lanes. `role="img"` with `<title>` and a `<desc>` generated from the edges. No gradients, glows or cloud-provider brand icons.
5. **Experience** — mono `EXPERIENCE` h2 label, `<ul>` of companies with hairline `divide-y` dividers. Each company: name as display h3 (plain text, or an accent link opening in a new tab when `companyHref` is set) and a mono uppercase location; roles nested under it, so a promotion stays under one employer. Each role: title (Inter, medium, `text`), mono date range ("APR 2024 — DEC 2024", right-aligned on the title row from `md`, stacked below `md`), and a `muted` summary at max 60ch. No timeline graphics, connecting lines or cards.
6. **Education** — mono `EDUCATION` h2 label, same divided-list pattern as Experience: degree as display h3, school as an accent link (new tab, ↗), mono location, mono date right-aligned from `md`.
7. **Footer/Contact** — status line with green dot ("Open to work · Worcester, MA"), oversized display h2 headline from `site.contactHeadline`, row of mono links (Email · GitHub · LinkedIn; Email stays in the same tab, the others open new tabs), and a mono `© {year} {name}` line. 2× pixel trees bottom-right, rising on scroll, with the bird perched on the larger tree; hidden below `md`.

## Content
- Real content lives in `src/data/*.ts` (site, stack, certifications, projects, experience, education, links) — components never hardcode copy.
- Images referenced from data files live in `src/assets/` and are imported, so Vite emits them to `/assets/` with hashed names (served with immutable caching). `public/` is only for files that need fixed URLs (favicon, OG image).
- `site.ts` holds the name, role, status, location, hero tagline/bio, contact headline and page description. It must stay plain strings with no imports, because `vite.config.ts` imports it to generate the `<title>` and meta description.
- `projects.ts` shape: `Project { slug, name, subtitle, summary, tech, backdrop, images, repoUrl, demoUrl?, demoNote?, draft?, video?, caseStudy? }`; `caseStudy { overview, built, cloud?: { views: CloudView[], decisions }, limitations? }`; `CloudView { id, tabLabel, title, caption, note?, nodes, edges }`; `DiagramNode { id, label, sublabel?, col, row }`; `DiagramEdge { from, to, label?, dashed?, twoWay? }`.
- **Case-study claims must be verifiable in the project's own repo** (README, docs or code). Label live, lab and planned work honestly; never present a design or a plan as running.
- **Draft rule:** a project with `draft: true` carries copy that isn't verified yet. CI fails on any `draft: true` in `src/data`, so drafts can't merge. Remove the flag only after every claim checks out against the repo.
- Copy register: plain, specific, first person, no buzzwords. Links say where they go ("View project", "GitHub").

## Quality floor
- Responsive to 360px; hero name uses clamp; pixel decorations hide or shrink below `md` if they'd crowd content.
- Visible keyboard focus states (accent outline), semantic landmarks (`header/main/section/footer`), alt text or `aria-hidden` on decorative SVGs.
- Heading outline: the hero name is the only h1; section labels are h2 via `<EyebrowLabel as="h2">`; item titles inside sections are h3. The hero eyebrow stays a `p`. Contact is the exception: its h2 is the headline (`site.contactHeadline`), not a "Contact" label, and its status eyebrow is a `p`.
- Lighthouse-friendly: fonts via `<link>` with `display=swap`, lazy-load project screenshots.

## Build & container
- Node 24, pinned in `.nvmrc`; the Dockerfile's build stage uses the same major.
- `npm ci` must keep passing on Linux. If the lockfile changes, verify it with `npm ci` before committing.
- The Docker image serves `dist/` with unprivileged nginx on port 8080 (`nginx.conf`: immutable caching for `/assets/`, `no-cache` elsewhere, security headers, `/healthz`).
- CI (`.github/workflows/ci.yml`) blocks draft project data, lints, builds and smoke-tests the image on every PR; pushes to `main` publish `ghcr.io/mshirish/portfolio`.
- `media/` is a separate local-only Node project (its own `package.json` and lockfile) for screenshot capture and demo video tooling. It is excluded from the site build (`tsconfig.app.json` includes only `src`), lint (`ignorePatterns` in `.oxlintrc.json`) and Docker (`.dockerignore`). Its `captures/`, `out/`, `node_modules/` and `.env.local` are gitignored and never committed.

## Don'ts
- No gradients, no glassmorphism, no glow effects.
- No pixel fonts for body/headline text (mono utility labels only).
- No autoplaying sound, no cursor effects, no scroll-jacking.
- Don't let pixel decorations overlap or push text at any breakpoint.
