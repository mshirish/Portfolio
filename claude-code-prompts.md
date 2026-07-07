# Claude Code Prompt Playbook — Pixel-Accent Portfolio

Run these in order, one per session/task. Keep `CLAUDE.md` in the repo root before Prompt 1. After each prompt, review in the browser before moving on. Attach your 3 inspiration screenshots to Prompt 1 and Prompt 4.

---

## Prompt 1 — Foundation (the big one)

> Read CLAUDE.md fully before writing any code — it is the source of truth for all design decisions.
>
> Scaffold a single-page portfolio: Vite + React + TypeScript + Tailwind CSS v4 + Framer Motion.
>
> Set up:
> 1. Design tokens from CLAUDE.md as Tailwind theme values (colors, fonts). Load Space Grotesk, Inter, and JetBrains Mono with display=swap.
> 2. File structure: `src/components/` (one file per section: Hero, Stack, Projects, Experience, Footer), `src/components/pixel/` (PixelClouds, PixelMoon, PixelTrees, PixelBird as inline-SVG rect-grid components with shape-rendering: crispEdges), `src/data/` (projects.ts, experience.ts, stack.ts, links.ts with placeholder entries typed with interfaces), `src/hooks/useParallax.ts` wrapping Framer Motion useScroll/useTransform with a useReducedMotion guard.
> 3. Page shell in App.tsx: semantic landmarks, max-w-[1080px] container, section spacing per CLAUDE.md, smooth in-page anchor nav.
> 4. Build the Hero section completely: mono eyebrow line with green status dot, display name in accent, tagline, short bio, pixel clouds + moon anchored top-right with parallax drift per CLAUDE.md motion rules.
> 5. Stub the other four sections with just their mono eyebrow labels so the page scrolls.
>
> I've attached 3 inspiration screenshots — match their feel: near-black, huge clean type, pixel decorations at the edges. Do not add any features, colors, or effects not specified in CLAUDE.md. When done, run the dev server and give me a summary of the structure.

---

## Prompt 2 — Stack section

> Build the Stack section per CLAUDE.md section 2. Data comes from `src/data/stack.ts` — populate it with my actual stack: [LIST YOUR TECHNOLOGIES]. Use simple-icons via react-icons on rounded surface tiles with a 1px border, subtle hover lift (translate-y and border-color to accent), and a single fade+slide-up reveal for the row. Keep the small pixel nest/plant decoration near the STACK label, aria-hidden.

---

## Prompt 3 — Projects section

> Build the Projects section per CLAUDE.md section 3. Populate `src/data/projects.ts` with my real projects:
>
> [FOR EACH PROJECT: name / one-line description / tech tags / link URL / accent color for its card backdrop / screenshot path in /public/projects/]
>
> Card design: colored rounded backdrop with a stacked screenshot preview (2–3 layered rounded images, slightly offset/rotated), name in display font below, description in muted, mono metadata line with tech tags. Whole card is an anchor opening the project link in a new tab. Hover: the screenshot stack lifts and fans slightly (rotate ~2deg, translate). Grid: 3 columns desktop, 1 column mobile. Lazy-load screenshots.

---

## Prompt 4 — Experience section

> Build the Experience section per CLAUDE.md section 4. Populate `src/data/experience.ts`:
>
> [FOR EACH ROLE: title / company + company URL / date range / 1–2 line description]
>
> Layout: vertical list with hairline dividers, role in text color, company as accent link, mono uppercase date range right-aligned on desktop and stacked on mobile. No timeline graphics, no cards. One gentle reveal for the section.

---

## Prompt 5 — Footer + parallax finale

> Build the Footer per CLAUDE.md section 5: status line with green dot and my location, oversized display headline "[YOUR CLOSING LINE]", mono link row from `src/data/links.ts` (Email, GitHub, LinkedIn, X). Add the PixelTrees component bottom-right rising into view with parallax, and the PixelBird with its gentle bob near the projects/footer edge. Verify every pixel element respects useReducedMotion and never overlaps text at 360px, 768px, 1280px widths.

---

## Prompt 6 — Polish & ship

> Final pass:
> 1. Responsive audit at 360/768/1024/1440 — fix any overflow, crowding, or pixel-decoration collisions; hide or shrink decorations below md where needed.
> 2. Accessibility: visible accent focus rings on all interactive elements, aria-hidden on decorative SVGs, alt text on screenshots, check heading order.
> 3. SEO/meta: title, description, Open Graph tags, favicon (a small pixel-art cloud or tree as SVG favicon would be on-theme).
> 4. Performance: confirm font display=swap, lazy-loaded images, no layout shift on load.
> 5. Add a GitHub Actions workflow or config to deploy to [Vercel / Netlify / GitHub Pages — pick one].
> Then give me a checklist of what was verified.

---

## Iteration tips
- If a section drifts off-style, say: "Re-read CLAUDE.md and bring this section back in line — list what violated it."
- For visual tweaks, screenshot your browser and paste it into Claude Code with the specific change ("clouds too large, ~60% size, more spacing from the eyebrow").
- Change one thing per message when fine-tuning motion — parallax speeds are feel-based.
- Commit after every prompt so you can roll back a bad direction cheaply.
