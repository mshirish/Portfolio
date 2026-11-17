import type { PixelGrid, PixelRole } from "./pixelGrid"
import { PixelSprite } from "./PixelSprite"
import { RING_TILT, ringFrame } from "./PixelRingedPlanet"
import { bobStyle } from "./motion"

const P: PixelRole = "rocket-window" // solar panel
const M: PixelRole = "metal"
const S: PixelRole = "metal-shade"
const n = null

/** 9×5 cells: two solar panels on struts either side of the body, with an antenna. */
const satellite: PixelGrid = [
  [n, n, n, n, S, n, n, n, n],
  [P, P, n, M, M, M, n, P, P],
  [P, P, S, M, M, S, S, P, P],
  [P, P, n, M, S, S, n, P, P],
  [n, n, n, n, S, n, n, n, n],
]

// Orbit in cells around the planet's center: wider than the ring, same tilt.
const ORBIT_RX = 30
const ORBIT_RY = 9
const POINTS = 120 // one hop every ~0.33s over a 40s orbit
const ORBIT_SECONDS = 40

/** Behind the planet (z 1) on the far half of the orbit, in front (z 3) on the near half. */
const BEHIND = 1
const IN_FRONT = 3

type OrbitPoint = { x: number; y: number; z: number }

/** Orbit positions in px relative to the planet's center at `px` per cell, rounded to whole pixels. */
function orbitPoints(px: number): OrbitPoint[] {
  const cos = Math.cos(RING_TILT)
  const sin = Math.sin(RING_TILT)
  return Array.from({ length: POINTS + 1 }, (_, i) => {
    const t = (2 * Math.PI * i) / POINTS
    const u = ORBIT_RX * Math.cos(t)
    const v = ORBIT_RY * Math.sin(t)
    // Back from the ring frame to the screen.
    const dx = u * cos - v * sin
    const dy = u * sin + v * cos
    const near = ringFrame(dx, dy).v > 0
    return {
      x: Math.round(dx * px - (9 * px) / 2),
      y: Math.round(dy * px - (5 * px) / 2),
      z: near ? IN_FRONT : BEHIND,
    }
  })
}

/** The pixel sizes the satellite is drawn at: 2 and 3 in the hero's sky band, 4 in the column. */
type OrbitScale = 2 | 3 | 4
const SCALES: OrbitScale[] = [2, 3, 4]
const pointsAt = Object.fromEntries(SCALES.map((px) => [px, orbitPoints(px)])) as Record<
  OrbitScale,
  OrbitPoint[]
>

// Precomputed keyframes, one set per scale; steps(1) holds each point, so the
// satellite only ever sits on whole pixels.
const keyframes = SCALES.map(
  (px) => `@keyframes px-orbit-${px} {${pointsAt[px]
    .map(
      (p, i) =>
        `${((i / POINTS) * 100).toFixed(3)}%{transform:translate(${p.x}px,${p.y}px);z-index:${p.z}}`,
    )
    .join("")}}
@media (prefers-reduced-motion: no-preference) {
  .px-orbit-${px} { animation: px-orbit-${px} ${ORBIT_SECONDS}s steps(1, jump-end) infinite; }
}`,
).join("\n")

// Where it rests under reduced motion: on the near side, in front of the planet.
const REST_INDEX = Math.round(POINTS * 0.3)

/**
 * Circles the ringed planet every 40s. Place it at the planet's center, inside
 * the same positioned parent as the planet (z-index 2), so its z-index of 1 or
 * 3 puts it behind or in front.
 */
export function OrbitingSatellite({
  className,
  pixelSize = 4,
}: {
  className?: string
  pixelSize?: OrbitScale
}) {
  const rest = pointsAt[pixelSize][REST_INDEX]
  return (
    <>
      <style>{keyframes}</style>
      <div
        className={`px-orbit-${pixelSize} absolute ${className ?? ""}`}
        style={{
          transform: `translate(${rest.x}px, ${rest.y}px)`,
          zIndex: rest.z,
        }}
      >
        <PixelSprite grid={satellite} pixelSize={pixelSize} className="px-bob block" style={bobStyle(3.4, 1.1)} />
      </div>
    </>
  )
}
