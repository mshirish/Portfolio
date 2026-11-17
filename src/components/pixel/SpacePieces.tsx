import type { CSSProperties, ReactNode } from "react"
import type { PixelGrid, PixelRole } from "./pixelGrid"
import { inDisc, rasterize, rotatedShape, trimGrid } from "./pixelShapes"
import { rocketShape, ROCKET_LENGTH } from "./PixelRocket"
import { PixelSprite } from "./PixelSprite"
import { StarCluster, type Star } from "./PixelStars"
import { bobStyle } from "./motion"

/**
 * The space pieces that sit in the gutters beside sections (via MarginSprite).
 * Each piece is 16 cells (64px) wide at 4px per cell, with its own bob and a
 * few nearby stars inside the same box. PIECE_WIDTH is what MarginSprite
 * checks against the gutter.
 */

const PX = 4
export const PIECE_WIDTH = 16 * PX

/** A sprite at cell (x, y) inside a piece, bobbing on its own timing. */
function Floating({
  grid,
  x,
  y,
  bob,
}: {
  grid: PixelGrid
  x: number
  y: number
  bob: [seconds: number, delay: number]
}) {
  const style: CSSProperties = { left: x * PX, top: y * PX, ...bobStyle(...bob) }
  return <PixelSprite grid={grid} className="px-bob absolute" style={style} />
}

function Piece({
  rows,
  stars,
  seed,
  children,
}: {
  rows: number
  stars: Star[]
  seed: number
  children: ReactNode
}) {
  return (
    <div className="relative" style={{ width: PIECE_WIDTH, height: rows * PX }}>
      <StarCluster width={16} height={rows} stars={stars} seed={seed} className="absolute inset-0" />
      {children}
    </div>
  )
}

/** A shaded disc: lit up-left, `shade` on the lower-right rim. */
function planet(size: number, lit: PixelRole, shade: PixelRole, craters: [number, number, number][] = []) {
  const c = size / 2
  return rasterize(size, size, (x, y) => {
    if (!inDisc(x, y, c, c, c)) return null
    if (!inDisc(x, y, c - 1.5, c - 1.5, c - 0.5)) return shade
    return craters.some(([cx, cy, r]) => inDisc(x, y, cx, cy, r)) ? shade : lit
  })
}

// --- Projects: a mini rocket heading up and to the left -------------------

const MINI = 0.7
const miniRocket = rotatedShape((u, v) => rocketShape(u / MINI, v / MINI), ROCKET_LENGTH * MINI, -30)

export function MiniRocketPiece() {
  return (
    <Piece
      rows={28}
      seed={1}
      stars={[
        { x: 1, y: 2, plus: true },
        { x: 13, y: 1, twinkle: true },
        { x: 3, y: 26 },
      ]}
    >
      <Floating grid={miniRocket} x={2} y={4} bob={[3.6, 0.3]} />
    </Piece>
  )
}

// --- Certifications: the small rust-red planet with two craters -----------

const rustPlanet = planet(14, "planet-rust", "planet-rust-shade", [
  [5, 5, 1.6],
  [8.5, 9, 1.1],
])

export function RustPlanetPiece() {
  return (
    <Piece
      rows={24}
      seed={2}
      stars={[
        { x: 2, y: 2 },
        { x: 13, y: 3, plus: true },
        { x: 4, y: 22, twinkle: true },
        { x: 14, y: 21 },
      ]}
    >
      <Floating grid={rustPlanet} x={1} y={6} bob={[4.4, 1.7]} />
    </Piece>
  )
}

// --- Skills: a floating astronaut on a short tether -----------------------

const ASTRONAUT_KEY: Record<string, PixelRole | null> = {
  ".": null,
  B: "rocket-body", // suit
  S: "metal", // suit shade
  V: "rocket-window", // visor
  D: "metal-shade", // backpack, boots
  T: "rocket-trim", // patch
  L: "metal-shade", // tether
}

const astronaut: PixelGrid = [
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

export function AstronautPiece() {
  return (
    <Piece
      rows={26}
      seed={3}
      stars={[
        { x: 14, y: 2, plus: true, twinkle: true },
        { x: 13, y: 15 },
        { x: 7, y: 24 },
      ]}
    >
      <Floating grid={astronaut} x={0} y={3} bob={[3.9, 2.6]} />
    </Piece>
  )
}

// --- Education: three asteroids of different sizes ------------------------

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

const asteroidLarge = asteroid(12, 0.12, 0.4, [
  [5, 6],
  [7, 8],
  [6, 4],
])
const asteroidMedium = asteroid(8, 0.14, 2.1, [[4, 4]])
const asteroidSmall = asteroid(5, 0.1, 1, [])

export function AsteroidsPiece() {
  return (
    <Piece
      rows={30}
      seed={4}
      stars={[
        { x: 14, y: 1 },
        { x: 1, y: 14, plus: true },
        { x: 14, y: 27, twinkle: true },
      ]}
    >
      <Floating grid={asteroidLarge} x={2} y={2} bob={[4.8, 0.5]} />
      <Floating grid={asteroidMedium} x={7} y={15} bob={[3.3, 1.9]} />
      <Floating grid={asteroidSmall} x={2} y={24} bob={[4.2, 3.1]} />
    </Piece>
  )
}

// --- Experience: the ice-blue planet with a tiny moon ---------------------

const icePlanet = planet(12, "planet-ice", "planet-ice-shade")
const tinyMoon = planet(4, "moon", "moon-shade")

export function IcePlanetPiece() {
  return (
    <Piece
      rows={24}
      seed={5}
      stars={[
        { x: 2, y: 2, plus: true },
        { x: 9, y: 1 },
        { x: 14, y: 22 },
        { x: 1, y: 20 },
      ]}
    >
      <Floating grid={icePlanet} x={1} y={7} bob={[4.7, 1.2]} />
      <Floating grid={tinyMoon} x={12} y={4} bob={[3.5, 0.8]} />
    </Piece>
  )
}
