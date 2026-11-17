import { useEffect, useRef, useState, type ReactNode } from "react"
import { motion } from "framer-motion"
import { useElementParallax } from "../../hooks/useParallax"

/** The content column's full width (main: max-w-[1080px], padding included). */
const COLUMN = 1080
/** The column's horizontal padding (px-6): the gap between a section's box and the column edge. */
const COLUMN_PADDING = 24
const MIN_VIEWPORT = 1280
const CLEARANCE = 24

/** Width of the empty gutter on each side of the content column. */
function gutterWidth() {
  return (document.documentElement.clientWidth - COLUMN) / 2
}

/** Whether a piece `width` px wide fits: 1280px and up, and gutter ≥ width + 24. */
function useFits(width: number) {
  const [fits, setFits] = useState(false)
  useEffect(() => {
    const check = () =>
      setFits(window.innerWidth >= MIN_VIEWPORT && gutterWidth() >= width + CLEARANCE)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [width])
  return fits
}

/**
 * Places decorative art in the left or right gutter beside a section, centered
 * in the gutter, `top` px below the section's top. Renders nothing below
 * 1280px or when the gutter is narrower than the art plus 24px, so it can never
 * reach section content. The parent section must be `relative`.
 *
 * Parallax is relative to the section (0.05–0.15), so it stays bounded;
 * children handle their own bob and twinkle.
 */
export function MarginSprite({
  side,
  top,
  width,
  speed = 0.1,
  children,
}: {
  side: "left" | "right"
  top: number
  /** The art's width in px. */
  width: number
  speed?: number
  children: ReactNode
}) {
  const fits = useFits(width)
  if (!fits) return null
  return (
    <Placed side={side} top={top} width={width} speed={speed}>
      {children}
    </Placed>
  )
}

function Placed({
  side,
  top,
  width,
  speed,
  children,
}: {
  side: "left" | "right"
  top: number
  width: number
  speed: number
  children: ReactNode
}) {
  const laneRef = useRef<HTMLDivElement>(null)
  const y = useElementParallax(laneRef, speed)
  const [offset, setOffset] = useState(0)

  // Distance from the section's edge to the art's near edge: the column
  // padding plus half the leftover gutter, so the art sits centered in it.
  useEffect(() => {
    const place = () =>
      setOffset(Math.round(COLUMN_PADDING + (gutterWidth() - width) / 2 + width))
    place()
    window.addEventListener("resize", place)
    return () => window.removeEventListener("resize", place)
  }, [width])

  return (
    <div
      ref={laneRef}
      className="pointer-events-none absolute inset-y-0 select-none"
      style={{ [side]: -offset, width }}
      aria-hidden="true"
    >
      <motion.div className="absolute inset-x-0" style={{ top, y }}>
        {children}
      </motion.div>
    </div>
  )
}
