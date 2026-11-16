import { motion } from "framer-motion"
import { useParallax } from "../../hooks/useParallax"
import { bobStyle } from "./motion"
import { OrbitingSatellite } from "./PixelSatellite"
import { PixelMoon } from "./PixelMoon"
import { ringedPlanet } from "./PixelRingedPlanet"
import { flyingRocket } from "./PixelRocket"
import { PixelSprite } from "./PixelSprite"
import { PixelStars } from "./PixelStars"
import { ShootingStar } from "./ShootingStar"

/**
 * The hero's space scene, in depth order: stars and moon (0.1× scroll), the
 * ringed planet with its orbiting satellite (0.15×), a rocket in flight
 * (0.25×), and an occasional shooting star.
 *
 * Everything stays in a 344px column at the hero's right edge, right of the
 * widest hero text, so vertical parallax can't carry it into text; only the
 * shooting star leaves it, through the band above the eyebrow. From md only
 * the moon fits beside the text (the hero text ends ~112px short of the edge
 * at 768px); the full scene shows from lg.
 */
export function PixelSky() {
  const backY = useParallax(0.1)
  const planetY = useParallax(0.15)
  const rocketY = useParallax(0.25)

  return (
    <div
      className="pointer-events-none absolute inset-y-0 right-0 hidden w-86 select-none md:block"
      aria-hidden="true"
    >
      <motion.div className="absolute inset-x-0 top-0" style={{ y: backY }}>
        <PixelStars className="absolute right-2 top-2 hidden lg:block" />
        <PixelMoon className="px-bob absolute right-0 top-4 lg:right-4" style={bobStyle(4.6, 0.4)} />
      </motion.div>

      {/* Planet at z 2; the satellite's z-index (1 or 3) puts it behind or in front. */}
      <motion.div className="absolute left-12 top-49 hidden h-24 w-44 lg:block" style={{ y: planetY }}>
        <PixelSprite grid={ringedPlanet} className="px-bob relative z-2 block" style={bobStyle(4.1, 2.3)} />
        <OrbitingSatellite className="left-22 top-12" />
      </motion.div>

      <motion.div className="absolute right-2 top-[330px] hidden lg:block" style={{ y: rocketY }}>
        <PixelSprite grid={flyingRocket} className="px-bob block" style={bobStyle(3.2, 0.9)} />
      </motion.div>

      <ShootingStar className="left-35 top-1 hidden lg:block" />
    </div>
  )
}
