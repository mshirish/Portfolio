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

const PIXEL = 4
const SPRITE_W = 9 * PIXEL
const SPRITE_H = 5 * PIXEL

// Orbit in cells around the planet's center: wider than the ring, same tilt.
const ORBIT_RX = 30
const ORBIT_RY = 9
const POINTS = 120 // one hop every ~0.33s over a 40s orbit
const ORBIT_SECONDS = 40

/** Behind the planet (z 1) on the far half of the orbit, in front (z 3) on the near half. */
const BEHIND = 1
const IN_FRONT = 3

type OrbitPoint = { x: number; y: number; z: number }

/** Orbit positions in px relative to the planet's center, rounded to whole pixels. */
function orbitPoints(): OrbitPoint[] {
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
      x: Math.round(dx * PIXEL - SPRITE_W / 2),
      y: Math.round(dy * PIXEL - SPRITE_H / 2),
      z: near ? IN_FRONT : BEHIND,
    }
  })
}

const points = orbitPoints()

// Precomputed keyframes; steps(1) holds each point, so the satellite only ever
// sits on whole pixels.
const keyframes = `@keyframes px-orbit {${points
  .map(
    (p, i) =>
      `${((i / POINTS) * 100).toFixed(3)}%{transform:translate(${p.x}px,${p.y}px);z-index:${p.z}}`,
  )
  .join("")}}
@media (prefers-reduced-motion: no-preference) {
  .px-orbit { animation: px-orbit ${ORBIT_SECONDS}s steps(1, jump-end) infinite; }
}`

// Where it rests under reduced motion: on the near side, in front of the planet.
const rest = points[Math.round(POINTS * 0.3)]

/**
 * Circles the ringed planet every 40s. Place it at the planet's center, inside
 * the same positioned parent as the planet (z-index 2), so its z-index of 1 or
 * 3 puts it behind or in front.
 */
export function OrbitingSatellite({ className }: { className?: string }) {
  return (
    <>
      <style>{keyframes}</style>
      <div
        className={`px-orbit absolute ${className ?? ""}`}
        style={{
          transform: `translate(${rest.x}px, ${rest.y}px)`,
          zIndex: rest.z,
        }}
      >
        <PixelSprite grid={satellite} className="px-bob block" style={bobStyle(3.4, 1.1)} />
      </div>
    </>
  )
}
