import { motion } from "framer-motion"
import type { RefObject } from "react"
import { useTargetParallax } from "../../hooks/useParallax"
import type { PixelGrid } from "./pixelGrid"
import { emptyGrid, rotatedShape } from "./pixelShapes"
import { rocketShape } from "./PixelRocket"
import { PixelSprite } from "./PixelSprite"

/**
 * The footer's launch pad on a strip of moon ground: a flag, a lattice gantry
 * tower with service arms, and a parked rocket (no exhaust). Grounded, so
 * nothing bobs; the whole scene only rises with the footer.
 *
 * 40×46 cells at 4px = 160×184px.
 */

const COLS = 40
const ROWS = 46
const GROUND_TOP = ROWS - 4 // ground: the bottom 4 rows
const PAD_TOP = GROUND_TOP - 2 // pad: 2 rows on the ground

/** Copies a sprite's non-empty cells into `grid` with its top-left at (x, y). */
function stamp(grid: PixelGrid, sprite: PixelGrid, x: number, y: number) {
  sprite.forEach((row, dy) =>
    row.forEach((role, dx) => {
      if (role) grid[y + dy][x + dx] = role
    }),
  )
}

/** Parked rocket: the flight rocket stretched to 36 cells tall, no flame. 15×36 cells. */
const parkedRocket = rotatedShape((u, v) => rocketShape(u, v * (27 / 36), false), 36, 0)

/** 10×40 lattice: two rails, a rung and an X brace every 6 rows, a red beacon on top. */
function gantry(): PixelGrid {
  const w = 10
  const h = 40
  const grid = emptyGrid(w, h)
  for (let y = 0; y < h; y++) {
    grid[y][0] = "metal"
    grid[y][w - 1] = "metal"
    const k = y % 6
    if (k === 0) for (let x = 1; x < w - 1; x++) grid[y][x] = "metal"
    else {
      // Diagonals crossing in each 6-row bay.
      const a = Math.round(((w - 1) * k) / 6)
      if (a > 0 && a < w - 1) {
        grid[y][a] = "metal-shade"
        grid[y][w - 1 - a] = "metal-shade"
      }
    }
  }
  grid[0][4] = "rocket-trim"
  grid[0][5] = "rocket-trim"
  return grid
}

function flag(): PixelGrid {
  const grid = emptyGrid(6, 14)
  for (let y = 0; y < 14; y++) grid[y][0] = "metal"
  for (let y = 1; y < 5; y++)
    for (let x = 1; x < 6; x++) grid[y][x] = y === 2 || y === 3 ? "rocket-body" : "rocket-trim"
  return grid
}

function sceneGrid(): PixelGrid {
  const grid = emptyGrid(COLS, ROWS)

  // Moon ground: a bumpy top row, shaded body, a few craters.
  const bumps = new Set([3, 4, 12, 27, 28, 29, 36])
  for (let x = 0; x < COLS; x++) {
    if (bumps.has(x)) grid[GROUND_TOP - 1][x] = "ground"
    for (let y = GROUND_TOP; y < ROWS; y++) grid[y][x] = y === GROUND_TOP ? "ground" : "ground-shade"
  }
  const craters: [number, number][] = [
    [2, 44], [3, 44], [15, 43], [22, 45], [23, 45], [33, 43], [34, 43], [38, 45],
  ]
  for (const [x, y] of craters) grid[y][x] = "crater"

  // Pad: a flat slab, lit top, shaded edge.
  for (let x = 8; x < 38; x++) {
    grid[PAD_TOP][x] = "metal"
    grid[PAD_TOP + 1][x] = "metal-shade"
  }

  // Gantry on the pad's left, rocket to its right, joined by two service arms.
  const g = gantry()
  const gx = 10
  stamp(grid, g, gx, PAD_TOP - g.length)
  const rx = gx + 10 + 2
  stamp(grid, parkedRocket, rx, PAD_TOP - parkedRocket.length)
  for (const armY of [PAD_TOP - 24, PAD_TOP - 14]) {
    for (let x = gx + 10; x < rx + 4; x++) if (!grid[armY][x]) grid[armY][x] = "metal-shade"
  }

  // Flag on the ground left of the pad.
  const f = flag()
  stamp(grid, f, 1, GROUND_TOP - f.length)
  return grid
}

const scene = sceneGrid()

/** Bottom-right of the footer; rises 48px (12 cells) as the footer enters the viewport. */
export function PixelLaunchPad({
  target,
  className,
}: {
  target: RefObject<HTMLElement | null>
  className?: string
}) {
  const y = useTargetParallax(target, 48)
  return (
    <motion.div className={className} style={{ y }} aria-hidden="true">
      <PixelSprite grid={scene} className="block" />
    </motion.div>
  )
}

