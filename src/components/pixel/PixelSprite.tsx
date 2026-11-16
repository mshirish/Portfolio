import type { CSSProperties } from "react"
import { renderPixelGrid, gridSize, type PixelGrid } from "./pixelGrid"

/** Renders a role grid as a crisp, decorative inline SVG. */
export function PixelSprite({
  grid,
  pixelSize = 4,
  className,
  style,
}: {
  grid: PixelGrid
  pixelSize?: number
  className?: string
  style?: CSSProperties
}) {
  const { width, height } = gridSize(grid, pixelSize)
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={className}
      style={{ ...style, shapeRendering: "crispEdges" }}
      aria-hidden="true"
    >
      {renderPixelGrid(grid, pixelSize)}
    </svg>
  )
}
