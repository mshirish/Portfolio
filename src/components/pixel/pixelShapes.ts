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

/** Builds a grid by asking `roleAt` for the role of every cell. */
export function rasterize(
  width: number,
  height: number,
  roleAt: (x: number, y: number) => PixelRole | null,
): PixelGrid {
  return Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => roleAt(x, y)),
  )
}

/** Drops fully transparent rows and columns from the edges. */
export function trimGrid(grid: PixelGrid): PixelGrid {
  const rows = grid.map((row) => row.some(Boolean))
  const cols = grid[0].map((_, x) => grid.some((row) => row[x]))
  const top = rows.indexOf(true)
  const bottom = rows.lastIndexOf(true)
  const left = cols.indexOf(true)
  const right = cols.lastIndexOf(true)
  return grid.slice(top, bottom + 1).map((row) => row.slice(left, right + 1))
}

/**
 * Rasterizes a shape that's described upright, already rotated by `degrees`
 * (clockwise), so the art is drawn tilted instead of rotated with CSS, which
 * would blur the pixels. `shape(u, v)` gets local coordinates with u across
 * (0 at the center line) and v down from the top (0 at the tip); `length` is
 * the shape's extent along v.
 */
export function rotatedShape(
  shape: (u: number, v: number) => PixelRole | null,
  length: number,
  degrees: number,
): PixelGrid {
  const a = (degrees * Math.PI) / 180
  // Even, so cell centers sit on half-cells around the center line.
  const size = 2 * Math.ceil(length * 0.75) + 2
  const c = size / 2
  const grid = rasterize(size, size, (x, y) => {
    const dx = x + 0.5 - c
    const dy = y + 0.5 - c
    const u = dx * Math.cos(a) + dy * Math.sin(a)
    const v = -dx * Math.sin(a) + dy * Math.cos(a) + length / 2
    return shape(u, v)
  })
  return trimGrid(grid)
}
