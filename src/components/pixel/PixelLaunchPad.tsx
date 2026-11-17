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
 * From md: one 40×46-cell grid at 4px (160×184px), absolutely positioned
 * bottom-right. Below md: the same props in the normal flow under the © line at
 * 2px (3px from sm), standing on a ground strip that spans the content width.
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

/**
 * Moon ground `cols` wide: a bumpy top row, then 4 rows of ground with a few
 * craters. The pattern repeats every 40 cells, so a wide strip matches the
 * md+ scene's own ground.
 */
function groundGrid(cols: number): PixelGrid {
  const grid = emptyGrid(cols, 5)
  const bumps = new Set([3, 4, 12, 27, 28, 29, 36])
  // Crater pixels as "column,row" within each 40-cell repeat (rows 2–4 of the strip).
  const craters = new Set(["2,3", "3,3", "15,2", "22,4", "23,4", "33,2", "34,2", "38,4"])
  for (let x = 0; x < cols; x++) {
    const k = x % 40
    if (bumps.has(k)) grid[0][x] = "ground"
    for (let y = 1; y < 5; y++) {
      grid[y][x] = craters.has(`${k},${y}`) ? "crater" : y === 1 ? "ground" : "ground-shade"
    }
  }
  return grid
}

/** Everything that stands on the ground: flag, pad, gantry, rocket. 40×42 cells. */
function propsGrid(): PixelGrid {
  const grid = emptyGrid(COLS, GROUND_TOP)

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

const props = propsGrid()

/** The md+ scene: the props standing on their own 40-cell strip of ground. */
function sceneGrid(): PixelGrid {
  const grid = emptyGrid(COLS, ROWS)
  stamp(grid, groundGrid(COLS), 0, GROUND_TOP - 1)
  stamp(grid, props, 0, 0)
  return grid
}

const scene = sceneGrid()

/** Wide enough to span the content column at 2px or 3px below md (≤ 720px). */
const strip = groundGrid(360)

/** Bottom-right of the footer from md; rises 48px (12 cells) as the footer enters the viewport. */
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

/**
 * Below md: the scene in the normal flow under the © line, the props aligned
 * right, standing on a ground strip that spans the content width (clipped, and
 * anchored right so its craters line up under the pad). Sits on the footer's
 * bottom edge; rises 24px with the footer.
 */
export function PixelLaunchPadInline({
  target,
  className,
}: {
  target: RefObject<HTMLElement | null>
  className?: string
}) {
  const y = useTargetParallax(target, 24)
  return (
    <motion.div className={`pointer-events-none select-none ${className ?? ""}`} style={{ y }} aria-hidden="true">
      {([2, 3] as const).map((px) => (
        <div key={px} className={px === 2 ? "sm:hidden" : "hidden sm:block"}>
          <div className="flex justify-end">
            <PixelSprite grid={props} pixelSize={px} className="block" />
          </div>
          <div className="flex justify-end overflow-hidden">
            <PixelSprite grid={strip} pixelSize={px} className="block shrink-0" />
          </div>
        </div>
      ))}
    </motion.div>
  )
}
