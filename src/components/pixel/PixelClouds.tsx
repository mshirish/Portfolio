import { motion, useReducedMotion } from "framer-motion"
import { useParallax } from "../../hooks/useParallax"
import { renderPixelGrid, gridSize, type PixelGrid } from "./pixelGrid"

const WHITE = "#EDF4FB"
const BLUE_LIGHT = "#BFD9F2"
const BLUE_DARK = "#8FBCE6"

const PIXEL_SIZE = 4

function cloudGrid(cols: number): PixelGrid {
  const pad = Math.max(0, Math.floor((cols - 10) / 2))
  const row = (colors: (string | null)[]) => {
    const left = Array(pad).fill(null)
    const right = Array(cols - pad - colors.length).fill(null)
    return [...left, ...colors, ...right] as (string | null)[]
  }

  return [
    row([null, null, WHITE, WHITE, WHITE, WHITE, null, null]),
    row([null, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, null]),
    row([WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE]),
    row([
      BLUE_LIGHT,
      BLUE_LIGHT,
      BLUE_LIGHT,
      BLUE_LIGHT,
      BLUE_LIGHT,
      BLUE_LIGHT,
      BLUE_LIGHT,
      BLUE_LIGHT,
    ]),
    row([
      BLUE_DARK,
      BLUE_DARK,
      BLUE_DARK,
      BLUE_DARK,
      BLUE_DARK,
      BLUE_DARK,
      BLUE_DARK,
      BLUE_DARK,
    ]),
  ]
}

function Cloud({
  grid,
  driftDistance,
  driftDuration,
}: {
  grid: PixelGrid
  driftDistance: number
  driftDuration: number
}) {
  const prefersReducedMotion = useReducedMotion()
  const { width, height } = gridSize(grid, PIXEL_SIZE)

  return (
    <motion.svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      style={{ shapeRendering: "crispEdges" }}
      aria-hidden="true"
      animate={
        prefersReducedMotion
          ? undefined
          : { x: [0, driftDistance, 0] }
      }
      transition={{
        duration: driftDuration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {renderPixelGrid(grid, PIXEL_SIZE)}
    </motion.svg>
  )
}

export function PixelClouds({ className }: { className?: string }) {
  const y = useParallax(0.3)

  return (
    <motion.div
      className={className}
      style={{ y }}
      aria-hidden="true"
    >
      <div className="flex items-end gap-6">
        <Cloud grid={cloudGrid(10)} driftDistance={10} driftDuration={9} />
        <Cloud grid={cloudGrid(14)} driftDistance={16} driftDuration={12} />
      </div>
    </motion.div>
  )
}
