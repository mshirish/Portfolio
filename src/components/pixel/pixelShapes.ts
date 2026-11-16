import type { PixelGrid, PixelRole } from "./pixelGrid"

/** True when cell (x, y)'s center lies inside the circle at (cx, cy) with radius r. */
export function inDisc(x: number, y: number, cx: number, cy: number, r: number) {
  const dx = x + 0.5 - cx
  const dy = y + 0.5 - cy
  return dx * dx + dy * dy <= r * r
}

export function emptyGrid(width: number, height: number): PixelGrid {
  return Array.from({ length: height }, () => Array<PixelRole | null>(width).fill(null))
}

type Lobe = { cx: number; r: number }

/**
 * A cumulus cloud: round lobes of different heights on a flat base.
 * Lobe centers sit `baseRows` above the bottom edge; below that line the
 * outline is the union of the lobes' widths, stepped in one cell per row so the
 * base corners round off. The top-left edge of each lobe is `cloud-light`, the
 * bottom row `cloud-shade`, everything else `cloud`.
 */
export function cumulus(lobes: Lobe[], baseRows = 3): PixelGrid {
  const left = Math.floor(Math.min(...lobes.map((l) => l.cx - l.r)))
  const shifted = lobes.map((l) => ({ cx: l.cx - left, r: l.r }))
  const width = Math.ceil(Math.max(...shifted.map((l) => l.cx + l.r)))
  const top = Math.max(...shifted.map((l) => l.r))
  const height = Math.ceil(top) + baseRows
  const cy = height - baseRows

  const minX = Math.min(...shifted.map((l) => l.cx - l.r))
  const maxX = Math.max(...shifted.map((l) => l.cx + l.r))

  const filled = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return false
    if (y < cy) return shifted.some((l) => inDisc(x, y, l.cx, cy, l.r))
    const inset = y - cy
    return x + 0.5 >= minX + inset && x + 0.5 <= maxX - inset
  }

  // The lobe a cell belongs to: the one it sits deepest inside.
  const owner = (x: number, y: number) =>
    shifted.reduce((best, l) => {
      const depth = l.r - Math.hypot(x + 0.5 - l.cx, y + 0.5 - cy)
      const bestDepth = best.r - Math.hypot(x + 0.5 - best.cx, y + 0.5 - cy)
      return depth > bestDepth ? l : best
    })

  const grid = emptyGrid(width, height)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!filled(x, y)) continue
      let role: PixelRole = "cloud"
      if (y === height - 1) {
        role = "cloud-shade"
      } else if (y < cy) {
        const lobe = owner(x, y)
        const onLeftHalf = x + 0.5 <= lobe.cx
        const topEdge = !filled(x, y - 1)
        const leftEdge = !filled(x - 1, y)
        if (onLeftHalf && (topEdge || leftEdge)) role = "cloud-light"
      }
      grid[y][x] = role
    }
  }
  return grid
}
