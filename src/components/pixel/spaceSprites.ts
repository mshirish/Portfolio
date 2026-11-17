import type { PixelGrid, PixelRole } from "./pixelGrid"
import { inDisc, rasterize, rotatedShape, trimGrid } from "./pixelShapes"
import { rocketShape, ROCKET_LENGTH } from "./PixelRocket"

/**
 * The sprite grids of the section pieces, shared by the margin versions
 * (MarginSprite, 4px per cell) and the gap versions (GapSprite, 2–3px).
 */

/** A shaded disc: lit up-left, `shade` on the lower-right rim. */
function planet(size: number, lit: PixelRole, shade: PixelRole, craters: [number, number, number][] = []) {
  const c = size / 2
  return rasterize(size, size, (x, y) => {
    if (!inDisc(x, y, c, c, c)) return null
    if (!inDisc(x, y, c - 1.5, c - 1.5, c - 0.5)) return shade
    return craters.some(([cx, cy, r]) => inDisc(x, y, cx, cy, r)) ? shade : lit
  })
}

const MINI = 0.7
export const miniRocket = rotatedShape((u, v) => rocketShape(u / MINI, v / MINI), ROCKET_LENGTH * MINI, -30)

export const rustPlanet = planet(14, "planet-rust", "planet-rust-shade", [
  [5, 5, 1.6],
  [8.5, 9, 1.1],
])

const ASTRONAUT_KEY: Record<string, PixelRole | null> = {
  ".": null,
  B: "rocket-body", // suit
  S: "metal", // suit shade
  V: "rocket-window", // visor
  D: "metal-shade", // backpack, boots
  T: "rocket-trim", // patch
  L: "metal-shade", // tether
}

export const astronaut: PixelGrid = [
  ".....BBBB.......",
  "....BBBBBB......",
  "...BBVVVVBB.....",
  "...BVVVVVVB.....",
  "..DBVVVVVVB.....",
  "..DBBVVVVBS.....",
  "..DDBBBBBSS.....",
  ".BDDBBTBBBSB....",
  "BBDDBBBBBBSBB...",
  "BSDDBBBBBBS.SB..",
  "S.DDBBBBBSS..S..",
  "..DDBBBBBSS.....",
  ".L..BBSSBSS.....",
  ".L..BB..BBS.....",
  "L...BB..BBS.....",
  "L...BS..BSS.....",
  ".L.DDD..DDD.....",
  ".L..............",
  "..L.............",
  "..L.............",
].map((row) => [...row].map((ch) => ASTRONAUT_KEY[ch]))

/** A lumpy rock: radius wobbles with angle; lit rim up-left, shaded lower-right, a few pits. */
function asteroid(size: number, wobble: number, phase: number, pits: [number, number][]) {
  // Two spare cells so the wobbly outline never runs off the grid.
  const grid = size + 2
  const c = grid / 2
  const r = size / 2 - 0.5
  const inside = (x: number, y: number, cx: number, cy: number, rr: number) => {
    const dx = x + 0.5 - cx
    const dy = y + 0.5 - cy
    const a = Math.atan2(dy, dx)
    const edge = rr * (1 + wobble * Math.sin(3 * a + phase) + wobble * 0.6 * Math.cos(5 * a - phase))
    return Math.hypot(dx, dy) <= edge
  }
  return trimGrid(rasterize(grid, grid, (x, y): PixelRole | null => {
    if (!inside(x, y, c, c, r)) return null
    if (pits.some(([px, py]) => px === x && py === y)) return "ground-shade"
    if (!inside(x, y, c - 1, c - 1, r)) return "ground"
    if (!inside(x - 1, y - 1, c, c, r) || !inside(x, y - 1, c, c, r)) return "metal"
    return "metal-shade"
  }))
}

export const asteroidLarge = asteroid(12, 0.12, 0.4, [
  [5, 6],
  [7, 8],
  [6, 4],
])
export const asteroidMedium = asteroid(8, 0.14, 2.1, [[4, 4]])
export const asteroidSmall = asteroid(5, 0.1, 1, [])

export const icePlanet = planet(12, "planet-ice", "planet-ice-shade")
export const tinyMoon = planet(4, "moon", "moon-shade")

/** Each gap piece's height in cells (GapSprite centers it on the section's top edge). */
export const GAP_ROWS = { rocket: 20, rust: 16, astronaut: 20, asteroids: 12, ice: 15 } as const
