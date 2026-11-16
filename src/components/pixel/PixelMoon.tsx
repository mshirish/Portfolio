import { renderPixelGrid, gridSize, type PixelGrid } from "./pixelGrid"
import { emptyGrid, inDisc } from "./pixelShapes"

const PIXEL_SIZE = 4
const SIZE = 30 // cells across: 120px at 4px per cell
const R = SIZE / 2

// Craters as [cx, cy, r] in cells, kept clear of the shaded edge.
const CRATERS: [number, number, number][] = [
  [10, 9, 2.6],
  [19, 7, 1.6],
  [16.5, 16, 3.1],
  [8, 19, 1.7],
  [21, 20.5, 1.5],
  [12.5, 24, 1.2],
]

function moonGrid(): PixelGrid {
  const grid = emptyGrid(SIZE, SIZE)
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (!inDisc(x, y, R, R, R)) continue
      // Lit disc offset up-left; what's left of the moon is the shaded rim.
      const lit = inDisc(x, y, R - 2.5, R - 2.5, R - 0.5)
      const crater = CRATERS.some(([cx, cy, r]) => inDisc(x, y, cx, cy, r))
      grid[y][x] = !lit ? "moon-shade" : crater ? "moon-crater" : "moon"
    }
  }
  return grid
}

const grid = moonGrid()
const { width, height } = gridSize(grid, PIXEL_SIZE)

export function PixelMoon({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={className}
      style={{ shapeRendering: "crispEdges" }}
      aria-hidden="true"
    >
      {renderPixelGrid(grid, PIXEL_SIZE)}
    </svg>
  )
}
