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
