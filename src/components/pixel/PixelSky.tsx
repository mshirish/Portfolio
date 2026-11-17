import { motion } from "framer-motion"
import { useParallax } from "../../hooks/useParallax"
import { bobStyle } from "./motion"
import { OrbitingSatellite } from "./PixelSatellite"
import { PixelMoon } from "./PixelMoon"
import { ringedPlanet } from "./PixelRingedPlanet"
import { flyingRocket } from "./PixelRocket"
import { PixelSprite } from "./PixelSprite"
import { PixelStars, StarCluster, type Star } from "./PixelStars"
import { ShootingStar } from "./ShootingStar"

/**
 * The hero's space scene, in depth order: stars and moon (0.1× scroll), the
 * ringed planet with its orbiting satellite (0.15×), a rocket in flight
 * (0.25×), and an occasional shooting star.
 *
 * From lg: everything stays in a 344px column at the hero's right edge, right
 * of the widest hero text, so vertical parallax can't carry it into text; only
 * the shooting star leaves it, through the band above the eyebrow. Below lg the
 * same scene lives in PixelSkyBand instead.
 */
export function PixelSky() {
  const backY = useParallax(0.1)
  const planetY = useParallax(0.15)
  const rocketY = useParallax(0.25)

  return (
    <div
      className="pointer-events-none absolute inset-y-0 right-0 hidden w-86 select-none lg:block"
      aria-hidden="true"
    >
      <motion.div className="absolute inset-x-0 top-0" style={{ y: backY }}>
        <PixelStars className="absolute right-2 top-2" />
        <PixelMoon className="px-bob absolute right-4 top-4" style={bobStyle(4.6, 0.4)} />
      </motion.div>

      {/* Planet at z 2; the satellite's z-index (1 or 3) puts it behind or in front. */}
      <motion.div className="absolute left-12 top-49 h-24 w-44" style={{ y: planetY }}>
        <PixelSprite grid={ringedPlanet} className="px-bob relative z-2 block" style={bobStyle(4.1, 2.3)} />
        <OrbitingSatellite className="left-22 top-12" />
      </motion.div>

      <motion.div className="absolute right-2 top-[330px]" style={{ y: rocketY }}>
        <PixelSprite grid={flyingRocket} className="px-bob block" style={bobStyle(3.2, 0.9)} />
      </motion.div>

      <ShootingStar className="left-35 top-1" />
    </div>
  )
}

// --- Below lg: the sky band ------------------------------------------------

/** Band heights: 112px below sm, 140px from sm to lg. */
const BAND = { 2: 112, 3: 140 } as const
type BandScale = keyof typeof BAND

// Stars spread across the band: [left %, top px at 2px/cell, plus-shaped?, twinkle?]
const BAND_STARS: [number, number, boolean, boolean][] = [
  [3, 8, false, false],
  [30, 6, true, false],
  [44, 92, false, true],
  [52, 12, false, false],
  [63, 70, true, false],
  [74, 4, false, true],
  [96, 96, false, false],
]

const ONE_STAR: Star[] = [{ x: 1, y: 1 }]
const ONE_PLUS: Star[] = [{ x: 1, y: 1, plus: true }]

/**
 * One band layout at `px` per cell (2 or 3): the ringed planet with its
 * orbiting satellite on the left, the rocket after it, the moon on the right,
 * stars across the width and the shooting star crossing the band only. All
 * offsets are whole multiples of `px`.
 */
function BandScene({ px, className }: { px: BandScale; className: string }) {
  const height = BAND[px]
  const backY = useParallax(0.04)
  const planetY = useParallax(0.06)
  const rocketY = useParallax(0.1)

  // The orbit reaches ~33 cells either side of the planet's center.
  const planetCenterX = 33 * px + 2
  const planetCenterY = height / 2
  const rocketLeft = planetCenterX + 33 * px + 6 * px

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ height }}>
      <motion.div className="absolute inset-0" style={{ y: backY }}>
        {BAND_STARS.map(([left, top, plus, twinkle], i) => (
          <StarCluster
            key={i}
            width={3}
            height={3}
            pixelSize={px}
            seed={i + 7}
            stars={plus ? ONE_PLUS : twinkle ? [{ ...ONE_STAR[0], twinkle: true }] : ONE_STAR}
            className="absolute"
            // top is given for the 2px band; scale it with the band's height
            style={{ left: `${left}%`, top: Math.round((top * height) / BAND[2]) }}
          />
        ))}
        <PixelMoon
          pixelSize={px}
          className="px-bob absolute right-0"
          style={{ top: 6 * px, ...bobStyle(4.6, 0.4) }}
        />
      </motion.div>

      <motion.div
        className="absolute"
        style={{ y: planetY, left: planetCenterX - 22 * px, top: planetCenterY - 12 * px, width: 44 * px, height: 24 * px }}
      >
        <PixelSprite grid={ringedPlanet} pixelSize={px} className="px-bob relative z-2 block" style={bobStyle(4.1, 2.3)} />
        <OrbitingSatellite pixelSize={px} className="left-1/2 top-1/2" />
      </motion.div>

      <motion.div className="absolute" style={{ y: rocketY, left: rocketLeft, top: (height - 30 * px) / 2 }}>
        <PixelSprite grid={flyingRocket} pixelSize={px} className="px-bob block" style={bobStyle(3.2, 0.9)} />
      </motion.div>

      <ShootingStar pixelSize={px} className="left-[60%] top-1" />
    </div>
  )
}

/**
 * The hero's art below lg: a block in the normal flow above the eyebrow, so it
 * takes up space and can't overlap text. 2px per cell below sm, 3px from sm.
 * It clips its contents, so bob and parallax never leave it.
 */
export function PixelSkyBand({ className }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className ?? ""}`} aria-hidden="true">
      <BandScene px={2} className="sm:hidden" />
      <BandScene px={3} className="hidden sm:block" />
    </div>
  )
}
