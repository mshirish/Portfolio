import type { CSSProperties } from "react"

/**
 * The page-wide background starfield: one seeded-random 320×320px tile of
 * whole-pixel stars, repeated over the page. It's the only pixel art allowed
 * behind text, so it's drawn in `star-dim` (1.6:1 or less against the page bg).
 *
 * A data-URI SVG can't read CSS variables, so the tile is a mask: the layer is
 * filled with var(--px-star-dim) and the tile's opaque cells let it through.
 * The color stays a theme role; the browser paints one repeated image, with no
 * canvas, no per-star DOM nodes and no scroll handlers.
 */

const TILE = 320 // px
const CELL = 2 // px per star cell
const CELLS = TILE / CELL
const STAR_COUNT = 42

// mulberry32: a tiny seeded PRNG, so the field is the same on every load.
function seeded(seed: number) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function tileSvg() {
  const random = seeded(20261115)
  const rects: string[] = []
  for (let i = 0; i < STAR_COUNT; i++) {
    // Most stars are one cell; about one in five is a 2×2 block.
    const size = random() < 0.2 ? 2 : 1
    const x = Math.floor(random() * (CELLS - size)) * CELL
    const y = Math.floor(random() * (CELLS - size)) * CELL
    rects.push(`<rect x="${x}" y="${y}" width="${size * CELL}" height="${size * CELL}"/>`)
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE}" height="${TILE}" shape-rendering="crispEdges" fill="white">${rects.join("")}</svg>`
}

const tile = `url("data:image/svg+xml,${encodeURIComponent(tileSvg())}")`

const style = {
  backgroundColor: "var(--px-star-dim)",
  maskImage: tile,
  maskSize: `${TILE}px ${TILE}px`,
  maskRepeat: "repeat",
  WebkitMaskImage: tile,
  WebkitMaskSize: `${TILE}px ${TILE}px`,
  WebkitMaskRepeat: "repeat",
} satisfies CSSProperties

/** Fills its positioned parent, below all content. */
export function Starfield() {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 select-none"
      style={style}
      aria-hidden="true"
    />
  )
}
