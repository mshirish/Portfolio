import { renderPixelGrid, gridSize, type PixelGrid } from "./pixelGrid"
import { emptyGrid, inDisc } from "./pixelShapes"

/**
 * The day-mode counterpart of PixelMoon, at the same scale (120px across).
 * Not rendered anywhere yet: it's here for the future day/night toggle.
 */

const PIXEL_SIZE = 4
const SIZE = 30
const C = SIZE / 2
const BODY_R = 9

function sunGrid(): PixelGrid {
  const grid = emptyGrid(SIZE, SIZE)
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (inDisc(x, y, C, C, BODY_R)) {
        // Lit core offset up-left, a darker rim down-right, like the moon.
        grid[y][x] = inDisc(x, y, C - 1.5, C - 1.5, BODY_R - 0.5) ? "sun" : "sun-shade"
      }
    }
  }

  // Eight stepped rays: straight ones are 2 cells wide, diagonals step one cell
  // per row. Each ray starts 2 cells off the body and runs 3 cells out.
  const lo = C - 1
  for (let i = 0; i < 3; i++) {
    const near = C - BODY_R - 2 - i // distance out from the body
    const far = C + BODY_R + 1 + i
    for (const k of [lo, lo + 1]) {
      grid[near][k] = "sun"
      grid[far][k] = "sun"
      grid[k][near] = "sun"
      grid[k][far] = "sun"
    }
  }
  for (let i = 0; i < 3; i++) {
    const a = 5 - i // top-left diagonal, stepping inward
    const b = SIZE - 1 - a
    grid[a][a] = "sun"
    grid[a][b] = "sun"
    grid[b][a] = "sun"
    grid[b][b] = "sun"
  }
  return grid
}

const grid = sunGrid()
const { width, height } = gridSize(grid, PIXEL_SIZE)

export function PixelSun({ className }: { className?: string }) {
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
