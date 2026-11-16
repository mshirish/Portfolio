import type { PixelGrid, PixelRole } from "./pixelGrid"
import { inDisc, rasterize } from "./pixelShapes"

/**
 * A Saturn-like planet: banded amber disc with a shaded lower-right side, and a
 * tilted ring that passes in front of the planet's lower half and behind its
 * upper half. One grid, so the layering is resolved per cell.
 */

export const PLANET_COLS = 44
export const PLANET_ROWS = 24
const CX = PLANET_COLS / 2
const CY = PLANET_ROWS / 2
const R = 10.5

/** Ring tilt in radians (negative: rising to the right). Shared with the satellite orbit. */
export const RING_TILT = -0.35
const RING_RX = 21
const RING_RY = 5.5

/** Rotates a cell offset into the ring's frame: u along the ring, v across it (v > 0 is the near side). */
export function ringFrame(dx: number, dy: number) {
  const cos = Math.cos(RING_TILT)
  const sin = Math.sin(RING_TILT)
  return { u: dx * cos + dy * sin, v: -dx * sin + dy * cos }
}

function planetRole(x: number, y: number): PixelRole {
  const lit = inDisc(x, y, CX - 2.5, CY - 2.5, R - 0.5)
  if (!lit) return "planet-sand-shade"
  // Bands run parallel to the ring.
  const { v } = ringFrame(x + 0.5 - CX, y + 0.5 - CY)
  const band = Math.floor((v + 20) / 3) % 2 === 0 && Math.abs(v) < 8
  return band ? "planet-sand-band" : "planet-sand"
}

export const ringedPlanet: PixelGrid = rasterize(PLANET_COLS, PLANET_ROWS, (x, y) => {
  const { u, v } = ringFrame(x + 0.5 - CX, y + 0.5 - CY)
  const e = (u / RING_RX) ** 2 + (v / RING_RY) ** 2
  const onRing = e >= 0.62 && e <= 1
  const onPlanet = inDisc(x, y, CX, CY, R)
  if (onRing && (v > 0 || !onPlanet)) return e < 0.74 ? "ring-shade" : "ring"
  if (onPlanet) return planetRole(x, y)
  return null
})
