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
| `surface` | `#18181C` | Cards, skill chips, footer strip |
| `border` | `#26262C` | 1px hairlines, tile borders |
| `text` | `#F2F2EF` | Headlines, primary text |
| `muted` | `#8B8B94` | Body copy, metadata |
| `accent` | `#7C8CF8` | Name, links, hover states (periwinkle) |
| `status` | `#34D399` | "Open to work" dot only |

Pixel-art colors are **roles**, not hex values: see Pixel art below. Max ~8 roles per pixel element.

### Typography
- **Display:** "Clash Display" (Fontshare) or "Space Grotesk" (Google Fonts), weight 600–700, tracking `-0.03em`, for hero name and section headlines. Hero name sized ~`clamp(3rem, 9vw, 6.5rem)`.
- **Body:** "Inter", 400/500, `muted` color, max-width ~60ch.
- **Utility/mono:** "JetBrains Mono", uppercase, `letter-spacing: 0.2em`, 12–13px — for eyebrow labels (`PROJECTS`, `SKILLS`, `EXPERIENCE`), dates, and metadata. Every section opens with a mono eyebrow label.

### Spacing & layout
- Single column, max-width `~1080px`.
- **Section spacing lives in one place:** the `section-y` utility in `src/index.css` (`padding-block: 2rem`, `3rem` from `md`, plus `scroll-margin-top: calc(var(--bar-height) + 1.5rem)`), giving 64px between sections on mobile and 96px on desktop. Every section uses it; to change the rhythm, edit that utility. No per-section `py-*` padding.
  - Two exceptions override one side only. The Hero's top is `pt-4 lg:pt-24`: below `lg` the sky band fills the space above the eyebrow, from `lg` the art sits in the right-hand column. The Footer's bottom is `pb-0 md:pb-28`: below `md` the launch pad stands in the flow on the footer's bottom edge; from `md` 112px keeps the © line above the absolutely placed scene's ground (184px tall, right of every footer line).
  - The gap from a section's h2 label to its content is always `mt-6 md:mt-8`.
  - In divided lists (Education, Experience), items use `first:pt-0 last:pb-0`, so the list's own padding never adds to section spacing.
- **Content-sized sections:** no `min-height` or fixed height on any section or wrapper. Grids use auto rows, so a section grows only when its data does.
- **Empty sections are hidden:** `App.tsx` builds both the page sections and the menu links (`MENU_LINKS`) from one list over the data arrays. A section whose array is empty renders neither the section nor its menu link (nor its pixel piece, which lives inside the section). Never hardcode a separate link list.
- Left-aligned content. Pixel decorations anchored to right/corners so they never overlap text at any viewport.
- Cards: `rounded-2xl`, `surface` bg, 1px `border`, no shadows except subtle on hover.

## Top bar and menu
- **Sticky bar** (`SiteHeader`): `position: sticky; top: 0`, full width, solid `bg` (no translucency, blur or glass), 56px (`--bar-height` in `index.css`). Content aligned with the 1080px column and `px-6`. Nothing on the left; the burger on the right. A 1px `border` bottom line appears only once the page has scrolled (an IntersectionObserver on a marker at the top of the page, no scroll handler).
- **Burger** (`BurgerButton`): a 44×44px button with a 9×7-cell pixel icon at 2px in the `ui` role (`currentColor`): three bars, or a separate × grid while the menu is open (swapped, never rotated). `text` color, `accent` on hover and focus, global focus outline. `aria-label` "Open menu" / "Close menu", `aria-expanded`, `aria-controls="site-menu"`. It's the only navigation on every screen size; there's no inline nav.
- **Menu** (`MenuOverlay`): a native `<dialog id="site-menu" aria-label="Site menu">` opened with `showModal()` (focus trap, Esc, inert page), sharing the project modal's scroll lock (`html:has(dialog[open])`, stable scrollbar gutter). Full viewport, solid `bg` with the dim starfield, the × in exactly the burger's spot. Then a `<nav aria-label="Sections">` list of `MENU_LINKS` in display type (`clamp(2rem, 7vw, 3.5rem)`, `text`, accent on hover/focus) with mono muted indexes ("01"…), and the mono external links from `links.ts` (GitHub and LinkedIn in a new tab with sr-only "(opens in a new tab)"). Every target is at least 44px.
  - Opening focuses the first link and never touches the hash. Closing returns focus to the burger.
  - Choosing a link: the menu closes first (exit animation, then `dialog.close()`, releasing the scroll lock), then the page scrolls to the section (smooth; instant under reduced motion), the hash is pushed, and focus moves to the section's heading (`aria-labelledby` target, `tabindex="-1"`).
  - Fade + 12px slide over 200ms with Framer Motion; instant under reduced motion.
  - Only one dialog at a time: a hash change or Back while the menu is open closes it, so it never sits over the project modal and doesn't interfere with `#project/…` routing.
- **Layering**, back to front: page background < starfield (`-z-10`) < ghost art (`z-index: -5`) < page content and full-color pixel art < sticky bar (`z-30`) < menu and project modal (both in the browser's top layer). Art scrolls under the bar. The app's root wrapper is `relative isolate overflow-x-clip`: `isolate` keeps the negative layers above the page background, and `overflow-x: clip` lets ghost art run off the screen edges without horizontal scroll (unlike `hidden`, it doesn't create a scroll container, so the sticky bar keeps working).
- **Anchors:** every section's `scroll-margin-top` (and the footer's, for `#contact`) is the bar height plus 1.5rem, so jumps and deep links (`/#skills`) land with the label just below the bar. On load, `App.tsx` scrolls to the hash once, and again when web fonts finish loading unless the visitor has scrolled. `/#project/<slug>` opens the project modal instead.

## Pixel art (important)
The theme is **space**: a dim starfield behind the page, large dim ghost shapes behind the text, a night-sky scene in the hero, a small space piece beside each section and a launch pad in the footer. Every piece has a placement for each screen size (see Placement).

**The readability rule.** Only two kinds of art may sit behind text: the starfield and ghost art. Ghost art uses only the ghost roles, and **every text color on the page keeps at least 4.5:1 contrast against every ghost role** (`text`, `muted` and `accent`; `muted` #8B8B94 is the binding one, so no ghost tone may be brighter than about #252525). The starfield's `star-dim` stays at **1.6:1 or less** against `bg`. `npm run check:contrast` enforces both and runs in CI; it finds text colors by scanning `src/` for `text-<color>` classes, so a new text color is either checked or added to its exemption list with a reason. All full-color art (moon, planets, rockets, margin and gap pieces, launch pad) must never overlap text.

### Building sprites
- Pixel art is **inline SVG rect grids** with `shape-rendering: crispEdges`, rendered by `renderPixelGrid` (`src/components/pixel/pixelGrid.tsx`) or the `PixelSprite` wrapper. No external image assets, no `<image>`, no canvas, no blur, glow or gradients.
- `renderPixelGrid` **merges horizontal runs** of the same role in a row into one `<rect>`, so a sprite costs a rect per run, not per pixel.
- Grids hold **color roles** (`PixelRole`), never hex: each cell is a role name or `null`, rendered as `fill="var(--px-<role>)"`. A grep for hex colors in `src/components/pixel/` must find none outside comments.
- Draw at 4px per cell. Scale only in whole multiples so pixels stay square. Hand-draw small sprites as grids (the astronaut, the satellite); build larger ones from shape math in `pixelShapes.ts` (`rasterize`, `inDisc`, `trimGrid`). Tilted art is rasterized already rotated with `rotatedShape`, never rotated with CSS, which would blur it.
- If a raster sprite is ever used: `image-rendering: pixelated`.
- These rules are for our own SVG art only. Third-party badges (e.g. certification badges) are shown exactly as issued — never pixelated, filtered, recolored, cropped or rounded.

### Color roles
CSS custom properties `--px-<role>` in `src/index.css` under `:root` (dark values), listed in `PIXEL_ROLES` in `pixelGrid.tsx`. Each is one solid color. A future light mode only adds `:root[data-theme="light"]` with the same names (reserved by a comment in `index.css`, not defined yet).
- Moon and stars: `moon`, `moon-shade`, `moon-crater`, `star`, `star-dim`
- Sun (light mode only): `sun`, `sun-shade`
- Planets: `planet-sand`, `planet-sand-band`, `planet-sand-shade` (ringed), `planet-rust`, `planet-rust-shade`, `planet-ice` `#BFD9F2`, `planet-ice-shade` `#8FBCE6`, `ring`, `ring-shade`
- Rockets: `rocket-body` `#EDF4FB`, `rocket-trim`, `rocket-window`, `flame-hot`, `flame`
- Hardware and surfaces: `metal`, `metal-shade`, `ground`, `ground-shade`, `crater`
- Interface: `ui` (`currentColor`), for the burger icon only
- Ghost art (the only roles allowed behind text): `ghost-1` #121216, `ghost-2` #16161C, `ghost-3` #1B1B22, `ghost-4` #202028 (brightest; `muted` clears it at 4.79:1), `ghost-nebula` #1D1A2C (faint violet)

### The starfield
`Starfield` fills the page-wide `relative isolate` wrapper in `App.tsx` at `-z-10`, `pointer-events: none`. One seeded-random 320×320px tile of 2px stars is a CSS mask over a layer filled with `var(--px-star-dim)`, repeated. No per-star nodes, no scroll handlers. `star-dim` must stay at **1.6:1 or less** against `bg` (it's 1.54:1), so it reads as texture. It doesn't twinkle.

### Placement
| Width | Hero | Beside sections | Footer |
|---|---|---|---|
| below `sm` (640) | sky band, 2px/cell | gap pieces, 2px/cell | launch pad in flow, 2px/cell |
| `sm`–`md` | sky band, 3px/cell | gap pieces, 2px/cell | launch pad in flow, 3px/cell |
| `md`–`lg` (768–1023) | sky band, 3px/cell | gap pieces, 3px/cell | absolute launch pad, 4px/cell |
| `lg`–1279 | right-hand column, 4px/cell | gap pieces, 3px/cell | absolute launch pad, 4px/cell |
| 1280 and up | right-hand column, 4px/cell | margin pieces, 4px/cell | absolute launch pad, 4px/cell |

Only whole-number scales; a variant per scale is rendered and the others are hidden with CSS.
- **Hero column** (`PixelSky`, from `lg`): everything sits in a 344px column at the hero's right edge, right of the widest hero text, so vertical parallax can't carry it into text: stars, moon, the ringed planet with its orbiting satellite, a rocket in flight (tilted 30°) and the shooting star. The shooting star is the only piece that leaves the column, through the band above the eyebrow.
- **Sky band** (`PixelSkyBand`, below `lg`): a block in the normal flow between the top bar and the eyebrow (112px tall below `sm`, 140px from `sm`), so it takes up space and can't overlap text. The ringed planet with its orbiting satellite on the left, the rocket after it, the moon on the right, seven stars across the width; the shooting star crosses the band only. It clips its contents (`overflow: hidden`), so bob and parallax never leave it.
- **Margin pieces** (`MarginSprite`, from 1280px): one 64px piece in the gutter beside a section, centered in the gutter, `top` px below the section top. It renders only at **1280px and up**, and only when the gutter outside the 1080px column is at least the piece's width plus 24px; otherwise nothing. Each carries 2–4 stars in its own box.
- **Gap pieces** (`GapSprite`, below 1280px, `xl:hidden`): a compact version of the same piece, centered on the section's top edge, which is the middle of the gap between sections, and aligned to the column's left or right edge (same side as the margin piece). Absolutely positioned, so it never changes spacing or height. It must fit the gap with room for the bob: at most 48px tall below `md` (64px gap) and 80px from `md` (96px gap). 1–2 stars beside each, one twinkling.
- **Section mapping** (both versions; sprites shared in `spaceSprites.ts`): Projects right (mini rocket), Certifications left (rust planet), Skills right (astronaut), Education left (three asteroids), Experience right (ice planet with a tiny moon). Margin and gap pieces are `aria-hidden`, `pointer-events: none`, and live inside their section (which must be `relative`), so a hidden section hides its piece.
- **Footer** (`PixelLaunchPad`): moon ground, a pad, a 10×40 lattice gantry, a parked rocket (no exhaust) and a pennant. From `md`: one 160×184px scene absolutely placed bottom-right on the footer's bottom edge. Below `md` (`PixelLaunchPadInline`): the same props in the flow under the © line, aligned right, on a ground strip that spans the content width, sitting on the footer's bottom edge. Never over the headline, links or © line.
- `PixelSun` exists for the future light mode and isn't rendered anywhere.

### Ghost art
Large, very dim shapes behind the text (`src/components/pixel/ghost/ghostShapes.ts`, placed by `GhostLayer.tsx`): a giant planet arc, a big moon (3× the hero moon), a large ringed planet and three nebulae (irregular clusters of blobs in three stepped tones, denser in the middle). Ghost roles only, drawn with the shape helpers, each under about 400 merged rects. 6px per cell from `lg`, 4px below.
- **Anchoring:** each piece lives inside a section (which must be `relative`) and is positioned with offsets in % of that section's width and height, so it follows its section as text reflows. `calc(50% - 50vw - …)` anchors to the viewport's left edge, for pieces meant to sit half off-screen. Pieces may run past their section and off the screen; the root's `overflow-x: clip` stops horizontal scroll. The hero clips only vertically (`overflow-y-clip`), so its arc can run off the left edge. Each piece is `aria-hidden`, `pointer-events: none`, `z-index: -5` and `contain: paint`.
- **Current layout:** Hero, the giant planet arc rising from the bottom-left behind the bio (its bottom rows step down to the darkest tones, so where the hero clips it, it fades); Projects, the wide nebula behind the card grid spreading right; Skills, the ringed planet center-right behind the chips; Education, the big moon at the left, half off-screen; Contact, the small nebula behind the headline. The tall nebula is drawn but not placed.
- **Covering:** solid surfaces (project and certification cards, skill chips, dialogs) cover ghost art, as they cover the starfield.
- **Motion:** static. At most very slow parallax (0.03–0.05×), never bob, twinkle or drift; fully static under reduced motion.

### Checking a change
Measure, don't guess: after moving or adding full-color art, check bounding boxes against text and interactive elements (the burger included) at 360, 390, 440, 768, 1024, 1280, 1440 and 1920px, scrolling the whole page (include the satellite's whole orbit and the shooting-star path). Art passing under the opaque sticky bar is fine; count only what's visible below it. Ghost art is excluded from that check; for it, run `npm run check:contrast` and sample the screenshot pixels inside the text it sits behind (nothing brighter than the brightest ghost role, apart from the starfield's stars).

## Motion rules
- **Floating** art (moon, planets, rockets in flight, the satellite, the astronaut, asteroids) bobs: the `.px-bob` keyframes, 0 to −3px and back, alternating, in whole-pixel steps (uneven keyframe spacing approximates ease-in-out). Each sprite sets its own `--px-bob-duration` (3–5s) and `--px-bob-delay` via `bobStyle()`, so nothing moves in sync.
- **Grounded** art (the footer launch pad) never bobs.
- **Parallax** (Framer Motion, whole pixels): hero layers are page-relative via `useParallax(speed)`: in the column, stars and moon 0.1×, ringed planet and satellite 0.15×, rocket 0.25×; in the sky band, smaller (0.04×, 0.06×, 0.1×). Margin pieces use `useElementParallax(ref, speed)` (0.05–0.15), relative to their section, so they stay bounded. Gap pieces have no parallax (it could carry them out of the gap into content). The footer scene rises a bounded distance as the footer enters the viewport and is at rest at the bottom of the page (`useTargetParallax(footerRef, …)`, never page-relative): 48px from `md`, 24px below.
- **Twinkle:** about a quarter of the foreground stars (hero, band and pieces) blink with stepped opacity, 1 → 0.45 → 1, each on its own 2–6s cycle (`.px-twinkle`). The background tile doesn't.
- **Orbit:** the satellite circles the ringed planet every 40s on 120 precomputed whole-pixel CSS keyframes (one set per scale: `px-orbit-2/3/4`), with z-index 1 (behind the planet) on the far half and 3 (in front) on the near half. No JS animation loop.
- **Shooting star:** every 20–30s (random each time), one streak crosses in 18 whole-pixel hops over 0.8s. The timer stops while the tab is hidden and on unmount.
- **Ghost art** is static (at most 0.03–0.05× parallax): no bob, twinkle or drift.
- All movement uses whole-pixel steps (`steps()`), so pixels stay crisp.
- **Reduced motion:** under `prefers-reduced-motion: reduce`, every CSS animation is off (each rule sits inside `prefers-reduced-motion: no-preference`), parallax hooks return 0 and the shooting-star timer never starts. Everything sits still.
- Content: single gentle fade + 12px slide-up reveal per section, once, `viewport={{ once: true }}`. No staggered letter animations, no scroll-jacking.

## Sections (in order)
1. **Intro/Hero** — mono eyebrow (`SOFTWARE DEVELOPER · OPEN TO WORK` with green dot), huge display name in `accent`, one bold tagline sentence in `text`, 2–3 line bio in `muted`. Pixel space scene: the sky band above the eyebrow below `lg`, the right-hand column from `lg` (see Pixel art).
2. **Projects** — mono `PROJECTS` h2 label, `<ul>` grid (1 col → `md:2` → `lg:3`, gap-6). Each card is an `<article>`, not one big button, because it holds real links: a solid-color folder preview (backdrop back panel with a black/15 overlay and a top-left tab; up to 3 white screenshot sheets at −3°, +2°, 0°, front one showing `images[0]`; a backdrop "pocket" over the lower ~45% with a 1px white/20 top line), then the name as display h3, summary, mono tech line, the `highlight` when set (an achievement line: mono uppercase in the `text` color, never muted and never the status green, which is reserved for the "open to work" dot), a mono "With …" line naming every `credits.people` entry when `credits` is set, and the "View case study →" `<button aria-haspopup="dialog">`. That button's `::after` stretches over the whole card, so a click anywhere opens the modal. Below it, a mono links row ("Live demo ↗" when `demoUrl` is set, "Code ↗") sits above the stretched layer (`relative z-10`) and opens new tabs; then the mono `wakeNote` when set. Hover, or keyboard focus on the case-study button: sheets slide up 8px and fan 2° more (`motion-safe:` only). A mono DRAFT tag shows while `draft: true`.
   - **Backend warm-up:** a project with `warmupUrl` gets `fetch(warmupUrl, { mode: "no-cors", cache: "no-store" }).catch(() => {})` the first time its card scrolls into view (IntersectionObserver) or its modal opens, deep links included (`warmUp` / `useWarmupOnView` in `src/hooks/useWarmup.ts`). At most once per URL per page view (a module-level Set): no retries, no polling. Skipped when `navigator.connection?.saveData` is true.
   - **Never iframe a live demo.** Demos are only ever linked to, in a new tab.
   - **Modal** (`ProjectModal`): native `<dialog>` via `showModal()` (focus trap, inert page), `aria-labelledby` the project name (h2; section labels inside are h3). Fade + scale from 0.96/12px over 250ms, instant under reduced motion. Closes on Esc, ×, backdrop click and the back button; focus returns to the card's case-study button. Opening pushes `#project/{slug}`; closing from the UI goes `history.back()` if the modal pushed that entry, else replaces the hash with `#projects`; loading `/#project/{slug}` opens it. Page scroll locks with `html:has(dialog[open])` and a stable scrollbar gutter. Panel max-w 960px, scrolls inside; full-height sheet below `md`.
   - **Content order** (each section renders only when its data is set):
     1. Name + subtitle, the `highlight` under the subtitle (same style as on the card), then the `credits` line: `credits.text` + the people joined naturally ("A, B and C"), each name an accent link only when it has an `href`.
     2. Media slot: `video` when set, else `images[0]` at 16:10. The box takes its shape from `video.aspect` (default 16:10) and the video uses `object-contain`, so it's never cropped. The video keeps `controls`, `playsInline` and `preload="none"` and never autoplays (some videos have sound), so nothing is downloaded until the visitor presses play. `video.note` shows in small mono muted text directly under it.
     3. Links row: "Try it yourself ↗" accent pill (new tab) or a muted "Live demo · soon"; "View source code ↗"; each of `extraLinks` ↗. Then `wakeNote` (mono, `text` color) and `demoNote` (mono, `muted`). `wakeNote` holds the cold-start sentence; `demoNote` never repeats it.
     4. Overview.
     5. How it works: `howItWorks` as a numbered list.
     6. What I built.
     7. Architecture / Cloud & operations (see below).
     8. Gallery: `gallery.title` label, 1 → `md:2` columns, each image lazy with width/height, linking to the full-size file in a new tab, with a caption.
     9. Built with: `credits.detail`, with each person who has an `href` linked where their full or first name appears.
     10. Known limitations.
     11. Tech.
   - **Cloud & operations** (`CloudTabs`): with several views, a segmented pill control (surface track, raised active pill) built as an ARIA tablist (arrow keys, Home/End, `aria-selected`, labelled tabpanels), under the label "Cloud & operations". A single view renders on its own, with no tab control, under the label "Architecture". Each view: title, diagram, caption, optional `note`. "Key decisions" sits below, shared by all views.
   - **Diagram** (`ArchitectureDiagram`): renders any `CloudView` as inline SVG from data only: nodes on a `col`/`row` grid (max 3 columns), rounded surface rects with display-font labels and mono sublabels; 1.5px muted edges with arrowheads (`dashed`, `twoWay` optional) and mono labels on bg chips. Never scales above 1:1. Below `sm` it switches to a single column with long edges in side lanes. `role="img"` with `<title>` and a `<desc>` generated from the edges. No gradients, glows or cloud-provider brand icons.
3. **Certifications** — mono `CERTIFICATIONS` h2 label, `<ul>` of cards (1-col → `lg:grid-cols-2`, gap-4). Each card is one link to the Credly credential (new tab, visually hidden "(opens in a new tab)"): `rounded-2xl` `surface` card, 1px `border`; issuer badge stacked above the text below `sm`, beside it from `sm`; badge 80px → 96px at `md`, `alt=""`, lazy; mono issuer line, cert name as display h3, "Verify on Credly ↗" in mono `accent`. Hover/focus: border to `accent`, badge lifts 2px (off under reduced motion), subtle shadow. No pixel art inside the section; its margin piece sits in the left gutter.
4. **Skills** — mono `SKILLS` h2 label (section id `skills`), then `skillGroups` from `src/data/skills.ts` in a grid: one column, `md:grid-cols-3`, `gap-8`, inside one `SectionReveal`.
   - **Group:** mono uppercase h3 label (`EyebrowLabel as="h3"`), then a wrapping `<ul>` of chips (`flex-wrap gap-2`). Empty groups are skipped.
   - **Chip** (`<li>`, not a link or button: no tabindex, no hover lift): `rounded-xl`, `surface` bg, 1px `border`, `px-3 py-2`. A 20px `aria-hidden` icon, then the name (Inter, `text-sm`, `text`).
   - **Hover:** the icon is `muted` at rest and switches to the chip's brand color while the chip is hovered (a per-chip `--brand` CSS variable, 150ms, `motion-reduce:transition-none`). The border brightens slightly.
   - **Brand colors:** each `color` must have at least 3:1 contrast against `surface` `#18181C`; lighten a brand color that falls short (Terraform `#7B42BC` → `#8651C1`). GitHub uses the `text` color, because its brand black would disappear.
   - **Icon sources:** icons come from react-icons, Simple Icons (`Si*`) by default. Simple Icons removed the AWS and C# logos at the trademark owners' request, so AWS uses Font Awesome's `FaAws` and C# uses Tabler's `TbBrandCSharp`. Import only icons that are used, so unused ones never reach the bundle.
5. **Education** — mono `EDUCATION` h2 label, same divided-list pattern as Experience: degree as display h3, school as an accent link (new tab, ↗), mono location, mono date right-aligned from `md`.
6. **Experience** — mono `EXPERIENCE` h2 label, `<ul>` of companies with hairline `divide-y` dividers. Each company: name as display h3 (plain text, or an accent link opening in a new tab when `companyHref` is set) and a mono uppercase location; roles nested under it, so a promotion stays under one employer. Each role: title (Inter, medium, `text`), mono date range ("APR 2024 — DEC 2024", right-aligned on the title row from `md`, stacked below `md`), and a `muted` summary at max 60ch. No timeline graphics, connecting lines or cards.
7. **Footer/Contact** — status line with green dot ("Open to work · Worcester, MA"), oversized display h2 headline from `site.contactHeadline`, row of mono links (Email · GitHub · LinkedIn; Email stays in the same tab, the others open new tabs), and a mono `© {year} {name}` line. The pixel launch pad bottom-right, rising on scroll: absolutely placed from `md`, in the flow under the © line below `md`.

## Content
- Real content lives in `src/data/*.ts` (site, skills, certifications, projects, experience, education, links) — components never hardcode copy.
- Images referenced from data files live in `src/assets/` and are imported, so Vite emits them to `/assets/` with hashed names (served with immutable caching). `public/` is only for files that need fixed URLs (favicon, OG image).
- `site.ts` holds the name, role, status, location, hero tagline/bio, contact headline and page description. It must stay plain strings with no imports, because `vite.config.ts` imports it to generate the `<title>` and meta description.
- `projects.ts` shape: `Project { slug, name, subtitle, summary, tech, backdrop, images, repoUrl, demoUrl?, demoNote?, highlight?, wakeNote?, warmupUrl?, howItWorks?, credits?, extraLinks?, gallery?, draft?, video?, caseStudy? }`; `highlight` = one achievement line (card + modal); `wakeNote` = one short cold-start line (card + modal); `warmupUrl` = a cheap endpoint on the demo's backend, fetched to wake it; `howItWorks: string[]` (ordered steps); `credits { text, people: { name, href? }[], detail? }`; `video { src, poster, description, aspect?: "16/9" | "16/10", note? }`; `extraLinks { label, href }[]`; `gallery { title, items: { src, alt, caption, width, height }[] }`; `caseStudy { overview, built, cloud?: { views: CloudView[], decisions }, limitations? }`; `CloudView { id, tabLabel, title, caption, note?, nodes, edges }`; `DiagramNode { id, label, sublabel?, col, row }`; `DiagramEdge { from, to, label?, dashed?, twoWay? }`.
- **Case-study claims must be verifiable in the project's own repo** (README, docs or code). Label live, lab and planned work honestly; never present a design or a plan as running.
- **Credit collaborators visibly.** A project built with someone else sets `credits`: every person in `credits.people` is named on the card and in the modal (linked when they have an `href`), and `credits.detail`, when set, says what they built. Never present shared work as solo work.
- **Sample data in videos:** a video that uses sample data must say so in its `video.note` (e.g. "Launch video: illustrative nutrition and prices, sample data.").
- **Draft rule:** a project with `draft: true` carries copy that isn't verified yet. CI fails on any `draft: true` in `src/data`, so drafts can't merge. Remove the flag only after every claim checks out against the repo.
- Copy register: plain, specific, first person, no buzzwords. Links say where they go ("View project", "GitHub").

## Quality floor
- Responsive to 360px; hero name uses clamp; pixel art moves to in-flow or gap placements at smaller sizes (see Placement) so it never crowds content.
- Visible keyboard focus states (accent outline), semantic landmarks (`header/main/section/footer`), alt text or `aria-hidden` on decorative SVGs.
- Heading outline: the hero name is the only h1; section labels are h2 via `<EyebrowLabel as="h2">`; item titles inside sections are h3. The hero eyebrow stays a `p`. Contact is the exception: its h2 is the headline (`site.contactHeadline`), not a "Contact" label, and its status eyebrow is a `p`.
- Lighthouse-friendly: fonts via `<link>` with `display=swap`, lazy-load project screenshots.

## Build & container
- Node 24, pinned in `.nvmrc`; the Dockerfile's build stage uses the same major.
- `npm ci` must keep passing on Linux. If the lockfile changes, verify it with `npm ci` before committing.
- The Docker image serves `dist/` with unprivileged nginx on port 8080 (`nginx.conf`: immutable caching for `/assets/`, `no-cache` elsewhere, security headers, `/healthz`).
- There is no Content-Security-Policy yet. If one is added, `connect-src` must allow `https://dev-pilot-blush.vercel.app` (the DevPilot warm-up request), and `frame-src` can stay `'none'` because demos are never iframed.
- CI (`.github/workflows/ci.yml`) blocks draft project data, lints, builds and smoke-tests the image on every PR; pushes to `main` publish `ghcr.io/mshirish/portfolio`.
- `media/` is a separate local-only Node project (its own `package.json` and lockfile) for screenshot capture and demo video tooling. It is excluded from the site build (`tsconfig.app.json` includes only `src`), lint (`ignorePatterns` in `.oxlintrc.json`) and Docker (`.dockerignore`). Its `captures/`, `out/`, `node_modules/` and `.env.local` are gitignored and never committed.

## Git workflow
- All work happens directly on `main`. No feature branches: agents never create, switch or delete branches.
- The owner makes every commit. Agents never run `git commit`, `git push` or `git stash`, never stage files, and never create PRs.
- After each numbered step of a task, stop and report: the files changed, a 2–3 sentence explanation, a suggested conventional commit message, and the exact `git add <files> && git commit -m "..."` command. Wait for "next" before continuing.

## Don'ts
- No gradients, no glassmorphism, no glow effects.
- No pixel fonts for body/headline text (mono utility labels only).
- No autoplaying sound, no cursor effects, no scroll-jacking.
- Don't let pixel decorations overlap or push text at any breakpoint. Only the starfield and ghost art may sit behind text, under the readability rule.
