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
export function useParallax(
  speed: number,
  target?: RefObject<HTMLElement | null>,
): MotionValue<number> {
  const prefersReducedMotion = useReducedMotion()
  const { scrollY } = useScroll(target ? { target } : undefined)

  return useTransform(scrollY, (value) =>
    prefersReducedMotion ? 0 : value * speed,
  )
}
