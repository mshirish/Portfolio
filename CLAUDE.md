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
- Placement: clouds + moon top-right of hero; small nest/plant near STACK label; bird near projects edge; two trees bottom-right of footer. Corners and margins only.
- Scale pixel art in whole multiples so pixels stay square.

## Motion rules
- Parallax via Framer Motion scroll progress: clouds drift slowly horizontally and translate at ~0.3× scroll speed; moon at ~0.15× (page-relative, via `useParallax(speed)`); footer trees rise a bounded 48px as the footer enters the viewport and are at rest when the page is scrolled to the bottom (via `useTargetParallax(footerRef, 48)`, never page-relative); bird gently bobs (2–3px, 3s ease-in-out loop).
- Content: single gentle fade + 12px slide-up reveal per section, once, `viewport={{ once: true }}`. No staggered letter animations, no scroll-jacking.
- Wrap all motion in `useReducedMotion()` — render static when reduced motion is preferred.

## Sections (in order)
1. **Intro/Hero** — mono eyebrow (`SOFTWARE DEVELOPER · OPEN TO WORK` with green dot), huge display name in `accent`, one bold tagline sentence in `text`, 2–3 line bio in `muted`. Pixel clouds + moon top-right.
2. **Stack** — mono `STACK` label, row of rounded `surface` tiles with tech logos (react-icons/simple-icons), subtle hover lift.
3. **Projects** — mono `PROJECTS` label, responsive grid (3-col → 1-col) of cards: colored rounded backdrop + stacked screenshot preview, project name, one-line description, mono metadata line, external link on click. Hover: slight rotate/lift of the screenshot stack.
4. **Experience** — mono `EXPERIENCE` label, vertical list: role, company (accent link), mono date range, 1–2 line description. Hairline `border` dividers between entries. No timeline graphics.
5. **Footer/Contact** — status line with green dot, oversized display headline ("Let's build something real." style), row of mono links (Email · GitHub · LinkedIn · X). Pixel trees bottom-right rising on scroll.

## Content
- Real content lives in `src/data/*.ts` (site, projects, experience, stack, links) — components never hardcode copy.
- `site.ts` holds the name, role, status, hero tagline/bio and page description. It must stay plain strings with no imports, because `vite.config.ts` imports it to generate the `<title>` and meta description.
- Copy register: plain, specific, first person, no buzzwords. Links say where they go ("View project", "GitHub").

## Quality floor
- Responsive to 360px; hero name uses clamp; pixel decorations hide or shrink below `md` if they'd crowd content.
- Visible keyboard focus states (accent outline), semantic landmarks (`header/main/section/footer`), alt text or `aria-hidden` on decorative SVGs.
- Lighthouse-friendly: fonts via `<link>` with `display=swap`, lazy-load project screenshots.

## Build & container
- Node 24, pinned in `.nvmrc`; the Dockerfile's build stage uses the same major.
- `npm ci` must keep passing on Linux. If the lockfile changes, verify it with `npm ci` before committing.
- The Docker image serves `dist/` with unprivileged nginx on port 8080 (`nginx.conf`: immutable caching for `/assets/`, `no-cache` elsewhere, security headers, `/healthz`).
- CI (`.github/workflows/ci.yml`) lints, builds and smoke-tests the image on every PR; pushes to `main` publish `ghcr.io/mshirish/portfolio`.

## Don'ts
- No gradients, no glassmorphism, no glow effects.
- No pixel fonts for body/headline text (mono utility labels only).
- No autoplaying sound, no cursor effects, no scroll-jacking.
- Don't let pixel decorations overlap or push text at any breakpoint.
