import { motion, useReducedMotion } from "framer-motion"
import { renderPixelGrid, gridSize, type PixelGrid } from "./pixelGrid"

const BODY = "#8A5A32"
const BELLY = "#EDF4FB"
const EYE = "#26262C"

const n = null

const grid: PixelGrid = [
  [n, n, BODY, BODY, n, n],
  [BODY, BODY, BODY, BODY, EYE, BODY],
  [BODY, BELLY, BELLY, BODY, BODY, n],
  [n, BODY, BODY, n, n, n],
]

export function PixelBird({
  className,
  pixelSize = 4,
}: {
  className?: string
  pixelSize?: number
}) {
  const prefersReducedMotion = useReducedMotion()
  const { width, height } = gridSize(grid, pixelSize)

  return (
    <motion.svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={className}
      style={{ shapeRendering: "crispEdges" }}
      aria-hidden="true"
      animate={prefersReducedMotion ? undefined : { y: [0, -3, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      {renderPixelGrid(grid, pixelSize)}
    </motion.svg>
  )
}
