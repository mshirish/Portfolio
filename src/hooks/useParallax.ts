import type { RefObject } from "react"
import {
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion"

/**
 * Ties an element's vertical offset to page scroll position.
 * `speed` is a multiplier of scroll distance (e.g. 0.3 = drifts at 30% of scroll speed).
 * Returns a static 0 MotionValue when the user prefers reduced motion.
 */
export function useParallax(speed: number): MotionValue<number> {
  const prefersReducedMotion = useReducedMotion()
  const { scrollY } = useScroll()

  // Overscroll bounce can report negative scrollY; whole pixels keep crispEdges art sharp.
  return useTransform(scrollY, (value) =>
    prefersReducedMotion ? 0 : Math.round(Math.max(0, value) * speed),
  )
}

/**
 * Offsets an element by `distance` px while `target` starts entering the viewport,
 * easing to 0 by the time the target's bottom edge reaches the viewport bottom.
 * Returns a static 0 MotionValue when the user prefers reduced motion.
 */
export function useTargetParallax(
  target: RefObject<HTMLElement | null>,
  distance: number,
): MotionValue<number> {
  const prefersReducedMotion = useReducedMotion()
  // "end end", not the default "end start": the footer is the last element, so its
  // bottom never reaches the viewport top and the default range would never finish.
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start end", "end end"],
  })

  return useTransform(scrollYProgress, (progress) => {
    if (prefersReducedMotion) return 0
    const clamped = Math.min(1, Math.max(0, progress))
    return Math.round((1 - clamped) * distance)
  })
}
