import { motion } from "framer-motion"
import type { ReactNode, RefObject } from "react"
import { useTargetParallax } from "../../hooks/useParallax"
import { renderPixelGrid, gridSize, type PixelGrid } from "./pixelGrid"

const LEAF_LIGHT = "#4E9A51"
const LEAF_DARK = "#2F6B39"
const TRUNK = "#8A5A32"

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

// Leftmost column of bigTree's top crown row, where a perched sprite stands.
const BIG_TREE_CROWN_LEFT = 3

function Tree({ grid, pixelSize }: { grid: PixelGrid; pixelSize: number }) {
  const { width, height } = gridSize(grid, pixelSize)
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      style={{ shapeRendering: "crispEdges" }}
      aria-hidden="true"
    >
      {renderPixelGrid(grid, pixelSize)}
    </svg>
  )
}

export function PixelTrees({
  className,
  target,
  pixelSize = 4,
  perch,
}: {
  className?: string
  target: RefObject<HTMLElement | null>
  pixelSize?: number
  /** Rendered standing on the big tree's crown, so it rises with the trees. */
  perch?: ReactNode
}) {
  // 48px is a whole number of art pixels at pixelSize 4 or 8
  const y = useTargetParallax(target, 48)

  return (
    <motion.div className={className} style={{ y }} aria-hidden="true">
      <div className="flex items-end" style={{ gap: pixelSize * 2 }}>
        <Tree grid={smallTree} pixelSize={pixelSize} />
        <div className="relative">
          {perch && (
            <div
              className="absolute bottom-full flex"
              style={{ left: BIG_TREE_CROWN_LEFT * pixelSize }}
            >
              {perch}
            </div>
          )}
          <Tree grid={bigTree} pixelSize={pixelSize} />
        </div>
      </div>
    </motion.div>
  )
}
