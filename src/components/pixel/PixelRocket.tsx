import type { PixelRole } from "./pixelGrid"
import { inDisc, rotatedShape } from "./pixelShapes"

/**
 * An upright rocket in local cell coordinates: u across (0 on the center
 * line), v down from the nose tip. Body 8 cells wide; a curved 11-cell nose
 * cone that stays pointed when the rocket is drawn tilted; 27 cells from nose
 * to nozzle, then a stepped three-tone exhaust flame to v = 34.
 */
export const ROCKET_LENGTH = 34
const NOSE = 11

export function rocketShape(u: number, v: number, withFlame = true): PixelRole | null {
  const au = Math.abs(u)
  if (v < 0) return null

  // Nose cone: curved (ogive-like) profile.
  if (v < NOSE) return au <= 4 * (v / NOSE) ** 0.6 ? "rocket-trim" : null

  // Fins flare out from the lower body.
  if (v >= 19 && v < 27 && au > 4 && au <= 4 + (v - 19) * 0.45) return "rocket-trim"

  // Body, with a porthole, a trim stripe and a shaded right edge.
  if (v < 25) {
    if (au > 4) return null
    if (inDisc(u, v, 0, 15, 2)) return "rocket-window"
    if (inDisc(u, v, 0, 15, 2.9)) return "metal"
    if (v >= 21 && v < 22.5) return "rocket-trim"
    return u > 2 ? "metal" : "rocket-body"
  }

  // Nozzle
  if (v < 27) return au <= 2.6 ? "metal-shade" : null

  if (!withFlame || v >= ROCKET_LENGTH) return null

  // Exhaust: hot core, flame, red tip, narrowing as it trails off.
  const t = (v - 27) / (ROCKET_LENGTH - 27)
  const outer = 2.8 * (1 - t * 0.8)
  if (au <= 1.3 * (1 - t) && v < 31) return "flame-hot"
  if (au <= outer * 0.7) return "flame"
  if (au <= outer) return "rocket-trim"
  return null
}

/** The hero's rocket in flight: tilted 30° clockwise, nose up and to the right. */
export const flyingRocket = rotatedShape(rocketShape, ROCKET_LENGTH, 30)
