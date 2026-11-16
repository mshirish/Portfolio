import { renderPixelGrid, gridSize, type PixelGrid } from "./pixelGrid"
import { emptyGrid } from "./pixelShapes"

const PIXEL_SIZE = 4
const WIDTH = 84 // cells: 336px, the hero sky column
const HEIGHT = 44 // cells: 176px

// [x, y, plus-shaped?] in cells. Kept off the moon (top-right) and the clouds.
const STARS: [number, number, boolean][] = [
  [4, 3, true],
  [17, 9, false],
  [30, 2, false],
  [43, 7, true],
  [52, 1, false],
  [36, 14, false],
  [8, 15, false],
  [24, 18, true],
  [80, 38, false],
]

function starsGrid(): PixelGrid {
  const grid = emptyGrid(WIDTH, HEIGHT)
  for (const [x, y, plus] of STARS) {
    grid[y][x] = "star"
    if (plus) {
      grid[y - 1][x] = "star"
      grid[y + 1][x] = "star"
      grid[y][x - 1] = "star"
      grid[y][x + 1] = "star"
    }
  }
  return grid
}

const grid = starsGrid()
const { width, height } = gridSize(grid, PIXEL_SIZE)

export function PixelStars({ className }: { className?: string }) {
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
