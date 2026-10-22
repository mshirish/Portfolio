import { motion } from "framer-motion"
import type { RefObject } from "react"
import { useTargetParallax } from "../../hooks/useParallax"
import { renderPixelGrid, gridSize, type PixelGrid } from "./pixelGrid"

const LEAF_LIGHT = "#4E9A51"
const LEAF_DARK = "#2F6B39"
const TRUNK = "#8A5A32"

const PIXEL_SIZE = 4

const n = null

const smallTree: PixelGrid = [
  [n, n, LEAF_LIGHT, LEAF_LIGHT, LEAF_LIGHT, n, n],
  [n, LEAF_LIGHT, LEAF_LIGHT, LEAF_DARK, LEAF_LIGHT, LEAF_LIGHT, n],
  [LEAF_LIGHT, LEAF_LIGHT, LEAF_DARK, LEAF_DARK, LEAF_LIGHT, LEAF_LIGHT, LEAF_LIGHT],
  [n, LEAF_DARK, LEAF_DARK, LEAF_DARK, LEAF_DARK, LEAF_LIGHT, n],
  [n, n, n, TRUNK, TRUNK, n, n],
  [n, n, n, TRUNK, TRUNK, n, n],
]

const bigTree: PixelGrid = [
  [n, n, n, LEAF_LIGHT, LEAF_LIGHT, LEAF_LIGHT, n, n, n],
  [n, n, LEAF_LIGHT, LEAF_LIGHT, LEAF_DARK, LEAF_LIGHT, LEAF_LIGHT, n, n],
  [n, LEAF_LIGHT, LEAF_LIGHT, LEAF_DARK, LEAF_DARK, LEAF_DARK, LEAF_LIGHT, LEAF_LIGHT, n],
  [LEAF_LIGHT, LEAF_LIGHT, LEAF_DARK, LEAF_DARK, LEAF_DARK, LEAF_DARK, LEAF_DARK, LEAF_LIGHT, LEAF_LIGHT],
  [n, LEAF_DARK, LEAF_DARK, LEAF_DARK, LEAF_DARK, LEAF_DARK, LEAF_DARK, LEAF_DARK, n],
  [n, n, LEAF_DARK, LEAF_DARK, LEAF_DARK, LEAF_DARK, LEAF_DARK, n, n],
  [n, n, n, n, TRUNK, TRUNK, n, n, n],
  [n, n, n, n, TRUNK, TRUNK, n, n, n],
  [n, n, n, n, TRUNK, TRUNK, n, n, n],
]

function Tree({ grid }: { grid: PixelGrid }) {
  const { width, height } = gridSize(grid, PIXEL_SIZE)
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      style={{ shapeRendering: "crispEdges" }}
      aria-hidden="true"
    >
      {renderPixelGrid(grid, PIXEL_SIZE)}
    </svg>
  )
}

export function PixelTrees({
  className,
  target,
}: {
  className?: string
  target: RefObject<HTMLElement | null>
}) {
  // 48px = 12 art pixels at PIXEL_SIZE 4
  const y = useTargetParallax(target, 48)

  return (
    <motion.div className={className} style={{ y }} aria-hidden="true">
      <div className="flex items-end gap-2">
        <Tree grid={smallTree} />
        <Tree grid={bigTree} />
      </div>
    </motion.div>
  )
}
