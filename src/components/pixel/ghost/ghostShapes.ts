import type { PixelGrid, PixelRole } from "../pixelGrid"
import { inDisc, rasterize, seeded, trimGrid } from "../pixelShapes"

/**
 * Ghost art: large, very dim shapes that sit behind the page text. They use
 * only the ghost roles (`ghost-1` darkest … `ghost-4` brightest, plus the
 * violet `ghost-nebula`), which every text color clears at 4.5:1 or more
 * (npm run check:contrast). Rendered at 6px per cell from lg, 4px below.
 */

// --- Giant planet arc --------------------------------------------------------

const ARC_COLS = 160 // wide enough that the whole curve fits inside the grid
const ARC_ROWS = 34
const ARC_R = 96 // the planet's radius in cells; only its top shows

/**
 * The top of a huge planet: a curved slice with latitude bands, darker toward
 * the right-hand limb in two curved steps, and a rim. Meant to rise from below,
 * so most of the planet is implied; the bottom rows step down to the darkest
 * tones, so wherever the slice is cut off it fades into the sky instead of
 * ending in a hard line.
 */
export const giantPlanetArc: PixelGrid = rasterize(ARC_COLS, ARC_ROWS, (x, y) => {
  const cx = ARC_COLS / 2
  const cy = ARC_R // center far below the grid
  const dx = x + 0.5 - cx
  const dy = y + 0.5 - cy
  const d = Math.hypot(dx, dy)
  if (d > ARC_R) return null
  if (d > ARC_R - 1.5) return "ghost-2" // rim
  // Fade out toward the bottom edge: two rows of each darker tone.
  if (y >= ARC_ROWS - 2) return y % 2 === 0 && x % 2 === 0 ? "ghost-1" : null
  if (y >= ARC_ROWS - 4) return "ghost-1"
  if (y >= ARC_ROWS - 7) return "ghost-2"
  // Shaded side: two curved crescents toward the right-hand limb (the lit
  // part is the same planet shifted left, like the moon's shading).
  if (Math.hypot(dx + 22, dy) > ARC_R) return "ghost-1"
  if (Math.hypot(dx + 11, dy) > ARC_R) return "ghost-2"
  // Latitude bands, by depth below the top of the planet.
  const depth = ARC_R - d
  if ((depth > 6 && depth < 9) || (depth > 17 && depth < 22)) return "ghost-4"
  if (depth > 27 && depth < 29) return "ghost-2"
  return "ghost-3"
})

// --- Big moon ------------------------------------------------------------------

const MOON = 60 // cells across: 360px at 6px, 3× the hero moon's 120px

const MOON_CRATERS: [number, number, number][] = [
  [20, 18, 5.5],
  [38, 14, 3.5],
  [33, 32, 6.5],
  [16, 39, 3.5],
  [43, 42, 3],
  [25, 50, 2.5],
]

/** A big full moon: lit disc, a shaded rim down-right, craters a tone darker. */
export const bigMoon: PixelGrid = rasterize(MOON, MOON, (x, y) => {
  const r = MOON / 2
  if (!inDisc(x, y, r, r, r)) return null
  if (!inDisc(x, y, r - 5, r - 5, r - 1)) return "ghost-1"
  if (MOON_CRATERS.some(([cx, cy, cr]) => inDisc(x, y, cx, cy, cr))) return "ghost-2"
  return "ghost-3"
})

// --- Ringed planet ---------------------------------------------------------------

const RP_COLS = 104
const RP_ROWS = 56
const RP_R = 22
const RING_RX = 50
const RING_RY = 12
const TILT = -0.3

/**
 * A large ringed planet: banded disc, shaded lower-right, and a tilted ring
 * that crosses in front of the lower half and behind the upper half.
 */
export const ghostRingedPlanet: PixelGrid = rasterize(RP_COLS, RP_ROWS, (x, y) => {
  const cx = RP_COLS / 2
  const cy = RP_ROWS / 2
  const dx = x + 0.5 - cx
  const dy = y + 0.5 - cy
  const u = dx * Math.cos(TILT) + dy * Math.sin(TILT)
  const v = -dx * Math.sin(TILT) + dy * Math.cos(TILT)
  const e = (u / RING_RX) ** 2 + (v / RING_RY) ** 2
  const onRing = e >= 0.6 && e <= 1
  const onPlanet = inDisc(x, y, cx, cy, RP_R)
  if (onRing && (v > 0 || !onPlanet)) return e < 0.72 ? "ghost-2" : "ghost-4"
  if (!onPlanet) return null
  if (!inDisc(x, y, cx - 4, cy - 4, RP_R - 1)) return "ghost-1"
  // Bands parallel to the ring.
  return Math.floor((v + 40) / 5) % 2 === 0 ? "ghost-3" : "ghost-2"
})

// --- Nebulae -------------------------------------------------------------------

/**
 * An irregular cloud of pixel blobs: a density field from overlapping round
 * blobs (seeded, so it's the same on every load), thresholded into three
 * stepped tones, densest in the middle. Loose single pixels scatter around
 * the edges. No gradients: each cell is one solid tone.
 */
function nebula(cols: number, rows: number, seed: number, blobs: number): PixelGrid {
  const random = seeded(seed)
  const cx = cols / 2
  const cy = rows / 2
  const spots = Array.from({ length: blobs }, () => {
    // Blob centers cluster toward the middle (average of two randoms).
    const bx = cx + ((random() + random()) / 2 - 0.5) * cols * 0.9
    const by = cy + ((random() + random()) / 2 - 0.5) * rows * 0.9
    const near = 1 - Math.hypot((bx - cx) / cols, (by - cy) / rows) * 1.6
    return { bx, by, r: 5 + random() * 9 * Math.max(0.35, near) }
  })
  const density = (x: number, y: number) =>
    spots.reduce((sum, { bx, by, r }) => {
      const d = Math.hypot(x + 0.5 - bx, y + 0.5 - by)
      return sum + Math.max(0, 1 - d / r)
    }, 0)

  const grid = rasterize(cols, rows, (x, y): PixelRole | null => {
    const value = density(x, y)
    if (value > 1.4) return "ghost-nebula"
    if (value > 0.7) return "ghost-3"
    if (value > 0.25) return "ghost-2"
    return null
  })

  // Scattered single pixels toward the edges.
  const strays = Math.round((cols * rows) / 90)
  for (let i = 0; i < strays; i++) {
    const x = Math.floor(random() * cols)
    const y = Math.floor(random() * rows)
    if (!grid[y][x]) grid[y][x] = random() < 0.3 ? "ghost-3" : "ghost-2"
  }
  return trimGrid(grid)
}

export const nebulaWide = nebula(84, 44, 7101, 26)
export const nebulaSmall = nebula(60, 36, 4242, 18)
export const nebulaTall = nebula(52, 56, 9137, 20)

/** Every ghost sprite, for checks and reports. */
export const GHOST_SPRITES = {
  giantPlanetArc,
  bigMoon,
  ghostRingedPlanet,
  nebulaWide,
  nebulaSmall,
  nebulaTall,
}
