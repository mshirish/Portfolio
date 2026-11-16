import type { CSSProperties } from "react"
import { motion } from "framer-motion"
import { useParallax } from "../../hooks/useParallax"
import { renderPixelGrid, gridSize, type PixelGrid } from "./pixelGrid"
import { cumulus } from "./pixelShapes"

const PIXEL_SIZE = 4

/** Three cumulus variants, widths in cells (4px each). */
const cloudLarge = cumulus([
  { cx: 9, r: 8 },
  { cx: 22, r: 11.5 },
  { cx: 37, r: 9.5 },
  { cx: 51, r: 6.5 },
])
const cloudMedium = cumulus([
  { cx: 8, r: 6.5 },
  { cx: 20, r: 9.5 },
  { cx: 33, r: 7.5 },
  { cx: 42, r: 4.5 },
])
const cloudSmall = cumulus([
  { cx: 7, r: 5.5 },
  { cx: 18, r: 8 },
  { cx: 30, r: 6.5 },
  { cx: 38, r: 4 },
])

function Cloud({
  grid,
  speed,
  drift,
  driftSeconds,
  className,
}: {
  grid: PixelGrid
  /** Parallax speed, a fraction of page scroll. */
  speed: number
  /** Horizontal drift in whole px; negative drifts left. */
  drift: number
  driftSeconds: number
  className?: string
}) {
  const y = useParallax(speed)
  const { width, height } = gridSize(grid, PIXEL_SIZE)
  const driftStyle = {
    "--px-drift": `${drift}px`,
    "--px-drift-steps": Math.abs(drift),
    "--px-drift-duration": `${driftSeconds}s`,
  } as CSSProperties

  return (
    <motion.div className={className} style={{ y }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        className="px-drift block"
        style={{ ...driftStyle, shapeRendering: "crispEdges" }}
        aria-hidden="true"
      >
        {renderPixelGrid(grid, PIXEL_SIZE)}
      </svg>
    </motion.div>
  )
}

/**
 * The hero's clouds, layered by depth: the large back cloud moves slowest.
 * Positioned inside a 344px-wide right-hand column (see PixelSky).
 */
export function PixelClouds({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <Cloud
        grid={cloudLarge}
        speed={0.15}
        drift={12}
        driftSeconds={14}
        className="absolute right-[92px] top-[72px]"
      />
      <Cloud
        grid={cloudMedium}
        speed={0.3}
        drift={-12}
        driftSeconds={11}
        className="absolute right-0 top-[176px]"
      />
      <Cloud
        grid={cloudSmall}
        speed={0.25}
        drift={10}
        driftSeconds={9}
        className="absolute right-[176px] top-[252px]"
      />
    </div>
  )
}
