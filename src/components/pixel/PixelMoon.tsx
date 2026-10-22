import { renderPixelGrid, gridSize, type PixelGrid } from "./pixelGrid"

const MOON = "#EDF4FB"
const SHADE = "#D9D9E3"

const PIXEL_SIZE = 4

const grid: PixelGrid = [
  [null, null, MOON, MOON, MOON, MOON, null, null],
  [null, MOON, MOON, MOON, MOON, MOON, MOON, null],
  [MOON, MOON, MOON, SHADE, MOON, MOON, MOON, MOON],
  [MOON, MOON, MOON, MOON, MOON, SHADE, MOON, MOON],
  [MOON, MOON, SHADE, MOON, MOON, MOON, MOON, MOON],
  [MOON, MOON, MOON, MOON, MOON, MOON, MOON, MOON],
  [null, MOON, MOON, MOON, MOON, MOON, MOON, null],
  [null, null, MOON, MOON, MOON, MOON, null, null],
]

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
