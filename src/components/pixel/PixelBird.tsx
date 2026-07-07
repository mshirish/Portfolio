import { motion, useReducedMotion } from "framer-motion"
import { renderPixelGrid, gridSize, type PixelGrid } from "./pixelGrid"

const BODY = "#8A5A32"
const BELLY = "#EDF4FB"
const EYE = "#26262C"

const PIXEL_SIZE = 4

const n = null

const grid: PixelGrid = [
  [n, n, BODY, BODY, n, n],
  [BODY, BODY, BODY, BODY, EYE, BODY],
  [BODY, BELLY, BELLY, BODY, BODY, n],
  [n, BODY, BODY, n, n, n],
]

const { width, height } = gridSize(grid, PIXEL_SIZE)

export function PixelBird({ className }: { className?: string }) {
  const prefersReducedMotion = useReducedMotion()

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
      {renderPixelGrid(grid, PIXEL_SIZE)}
    </motion.svg>
  )
}
