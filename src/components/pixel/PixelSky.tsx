import { motion } from "framer-motion"
import { useParallax } from "../../hooks/useParallax"
import { PixelMoon } from "./PixelMoon"
import { PixelStars } from "./PixelStars"

/**
 * The hero's space scene: stars and moon at the back (0.1× scroll).
 * Everything stays in a 344px column at the hero's right edge, right of the
 * widest hero text, so vertical parallax can't carry it into text. From md only the moon fits beside the text (the hero text ends
 * ~112px short of the edge at 768px); the stars join from lg.
 */
export function PixelSky() {
  const backY = useParallax(0.1)

  return (
    <div
      className="pointer-events-none absolute inset-y-0 right-0 hidden w-86 select-none md:block"
      aria-hidden="true"
    >
      <motion.div className="absolute inset-x-0 top-0" style={{ y: backY }}>
        <PixelStars className="absolute right-2 top-2 hidden lg:block" />
        <PixelMoon className="absolute right-0 top-4 lg:right-4" />
      </motion.div>
    </div>
  )
}
