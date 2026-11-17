import type { CSSProperties, ReactNode } from "react"
import type { PixelGrid } from "./pixelGrid"
import {
  GAP_ROWS,
  asteroidLarge,
  asteroidMedium,
  asteroidSmall,
  astronaut,
  icePlanet,
  miniRocket,
  rustPlanet,
  tinyMoon,
} from "./spaceSprites"
import { PixelSprite } from "./PixelSprite"
import { StarCluster, type Star } from "./PixelStars"
import { bobStyle } from "./motion"
import type { GapScale } from "./GapSprite"

/**
 * The space pieces beside sections, in two versions sharing the sprites in
 * spaceSprites.ts:
 * - margin pieces (MarginSprite, from 1280px): 16 cells (64px) wide at 4px per
 *   cell, with a few stars in the same tall box. PIECE_WIDTH is what
 *   MarginSprite checks against the gutter.
 * - gap pieces (GapSprite, below 1280px): compact, at most 24 rows tall, drawn
 *   at 2px or 3px per cell, with 1–2 stars beside the sprite.
 */

const PX = 4
export const PIECE_WIDTH = 16 * PX

type Bob = [seconds: number, delay: number]

/** A sprite at cell (x, y) inside a piece, bobbing on its own timing. */
function Floating({
  grid,
  x,
  y,
  bob,
  px = PX,
}: {
  grid: PixelGrid
  x: number
  y: number
  bob: Bob
  px?: number
}) {
  const style: CSSProperties = { left: x * px, top: y * px, ...bobStyle(...bob) }
  return <PixelSprite grid={grid} pixelSize={px} className="px-bob absolute" style={style} />
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

// --- Projects: a mini rocket heading up and to the left -------------------

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

// --- Gap versions (below 1280px) ----------------------------------------

type Placed = { grid: PixelGrid; x: number; y: number; bob: Bob }

/** A compact piece for the gap between sections: sprites plus 1–2 stars, `cols`×`rows` cells. */
function GapPiece({
  px,
  cols,
  rows,
  sprites,
  stars,
  seed,
}: {
  px: GapScale
  cols: number
  rows: number
  sprites: Placed[]
  stars: Star[]
  seed: number
}) {
  return (
    <div className="relative" style={{ width: cols * px, height: rows * px }}>
      <StarCluster width={cols} height={rows} stars={stars} seed={seed} pixelSize={px} className="absolute inset-0" />
      {sprites.map((sprite, i) => (
        <Floating key={i} px={px} {...sprite} />
      ))}
    </div>
  )
}

export const MiniRocketGap = ({ px }: { px: GapScale }) => (
  <GapPiece
    px={px}
    cols={20}
    rows={GAP_ROWS.rocket}
    seed={11}
    sprites={[{ grid: miniRocket, x: 5, y: 0, bob: [3.6, 0.3] }]}
    stars={[
      { x: 1, y: 4, twinkle: true },
      { x: 2, y: 16 },
    ]}
  />
)

export const RustPlanetGap = ({ px }: { px: GapScale }) => (
  <GapPiece
    px={px}
    cols={20}
    rows={GAP_ROWS.rust}
    seed={12}
    sprites={[{ grid: rustPlanet, x: 0, y: 1, bob: [4.4, 1.7] }]}
    stars={[
      { x: 17, y: 3, twinkle: true },
      { x: 18, y: 12 },
    ]}
  />
)

export const AstronautGap = ({ px }: { px: GapScale }) => (
  <GapPiece
    px={px}
    cols={20}
    rows={GAP_ROWS.astronaut}
    seed={13}
    sprites={[{ grid: astronaut, x: 4, y: 0, bob: [3.9, 2.6] }]}
    stars={[{ x: 1, y: 3, plus: true, twinkle: true }]}
  />
)

export const AsteroidsGap = ({ px }: { px: GapScale }) => (
  <GapPiece
    px={px}
    cols={28}
    rows={GAP_ROWS.asteroids}
    seed={14}
    sprites={[
      { grid: asteroidLarge, x: 0, y: 0, bob: [4.8, 0.5] },
      { grid: asteroidMedium, x: 14, y: 2, bob: [3.3, 1.9] },
      { grid: asteroidSmall, x: 23, y: 6, bob: [4.2, 3.1] },
    ]}
    stars={[{ x: 26, y: 1, twinkle: true }]}
  />
)

export const IcePlanetGap = ({ px }: { px: GapScale }) => (
  <GapPiece
    px={px}
    cols={20}
    rows={GAP_ROWS.ice}
    seed={15}
    sprites={[
      { grid: icePlanet, x: 4, y: 3, bob: [4.7, 1.2] },
      { grid: tinyMoon, x: 16, y: 0, bob: [3.5, 0.8] },
    ]}
    stars={[
      { x: 1, y: 6, twinkle: true },
      { x: 18, y: 12 },
    ]}
  />
)
