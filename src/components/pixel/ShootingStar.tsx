import { useEffect, useState, type CSSProperties } from "react"
import { useReducedMotion } from "framer-motion"
import type { PixelGrid, PixelRole } from "./pixelGrid"
import { PixelSprite } from "./PixelSprite"

/**
 * A streak heading down-left: the head at the bottom-left, a 9-cell tail
 * climbing right at the same 3:1 slope as its path, fading through three solid
 * tones (no gradient).
 */
const H: PixelRole = "star"
const A: PixelRole = "moon-shade"
const B: PixelRole = "metal-shade"
const n = null

const streak: PixelGrid = [
  [n, n, n, n, n, n, n, n, B, B],
  [n, n, n, n, n, B, B, A, n, n],
  [n, n, A, A, H, n, n, n, n, n],
  [H, H, n, n, n, n, n, n, n, n],
]

/** Path in px: 18 hops of 12px left and 4px down, 0.8s in all (see .px-shoot). */
const SHOOT_PATH = { dx: -216, dy: 72 }

const MIN_WAIT = 20_000
const MAX_WAIT = 30_000

/**
 * Every 20–30s (random each time) a streak crosses once. The timer stops while
 * the tab is hidden and on unmount, and never starts under reduced motion.
 * Position it with `className` at the start of its path.
 */
export function ShootingStar({ className }: { className?: string }) {
  const prefersReducedMotion = useReducedMotion()
  const [shot, setShot] = useState(0) // 0: none in flight

  useEffect(() => {
    if (prefersReducedMotion) return
    let timer: number | undefined

    const schedule = () => {
      window.clearTimeout(timer)
      const wait = MIN_WAIT + Math.random() * (MAX_WAIT - MIN_WAIT)
      timer = window.setTimeout(() => {
        setShot((n) => n + 1)
        schedule()
      }, wait)
    }
    const onVisibility = () => {
      if (document.hidden) window.clearTimeout(timer)
      else schedule()
    }

    if (!document.hidden) schedule()
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [prefersReducedMotion])

  if (prefersReducedMotion || shot === 0) return null

  return (
    <PixelSprite
      key={shot}
      grid={streak}
      className={`px-shoot absolute ${className ?? ""}`}
      style={{ "--px-shoot-x": `${SHOOT_PATH.dx}px`, "--px-shoot-y": `${SHOOT_PATH.dy}px` } as CSSProperties}
    />
  )
}
