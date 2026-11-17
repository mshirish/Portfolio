import type { CSSProperties } from "react"
import { renderPixelGrid, gridSize, type PixelGrid } from "./pixelGrid"
import { emptyGrid } from "./pixelShapes"

/** A foreground star in cells: a single pixel, or a plus shape centered on (x, y). */
export type Star = { x: number; y: number; plus?: boolean; twinkle?: boolean }

function starGrid(width: number, height: number, stars: Star[]): PixelGrid {
  const grid = emptyGrid(width, height)
  for (const { x, y, plus } of stars) {
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

/**
 * A cluster of foreground stars. Stars marked `twinkle` blink with stepped
 * opacity (the .px-twinkle keyframes in index.css), each on its own 2–6s
 * cycle and offset, so they never blink together. `seed` varies the timing
 * between clusters.
 */
export function StarCluster({
  width,
  height,
  stars,
  seed = 0,
  pixelSize = 4,
  className,
  style,
}: {
  /** Size in cells. */
  width: number
  height: number
  stars: Star[]
  seed?: number
  pixelSize?: number
  className?: string
  style?: CSSProperties
}) {
  const steady = starGrid(width, height, stars.filter((s) => !s.twinkle))
  const twinkling = stars.filter((s) => s.twinkle)
  const size = gridSize(steady, pixelSize)

  return (
    <svg
      viewBox={`0 0 ${size.width} ${size.height}`}
      width={size.width}
      height={size.height}
      className={className}
      style={{ ...style, shapeRendering: "crispEdges" }}
      aria-hidden="true"
    >
      {renderPixelGrid(steady, pixelSize)}
      {twinkling.map((star, i) => {
        const k = i + seed * 3 + 1
        const duration = 2 + ((k * 1.37) % 4) // 2–6s
        const delay = -((k * 0.83) % duration) // start mid-cycle, out of step
        const timing = {
          "--px-twinkle-duration": `${duration.toFixed(2)}s`,
          "--px-twinkle-delay": `${delay.toFixed(2)}s`,
        } as CSSProperties
        return (
          <g key={`${star.x}-${star.y}`} className="px-twinkle" style={timing}>
            {renderPixelGrid(starGrid(width, height, [star]), pixelSize)}
          </g>
        )
      })}
    </svg>
  )
}

// The hero's stars, in cells (336×176px). Kept off the moon (top-right).
// About a quarter twinkle.
const HERO_STARS: Star[] = [
  { x: 4, y: 3, plus: true },
  { x: 17, y: 9, twinkle: true },
  { x: 30, y: 2 },
  { x: 43, y: 7, plus: true },
  { x: 52, y: 1 },
  { x: 36, y: 14, twinkle: true },
  { x: 8, y: 15 },
  { x: 24, y: 18, plus: true },
  { x: 80, y: 38 },
]

export function PixelStars({ className }: { className?: string }) {
  return <StarCluster width={84} height={44} stars={HERO_STARS} className={className} />
}
