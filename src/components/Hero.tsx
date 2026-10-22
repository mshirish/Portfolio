import { motion } from "framer-motion"
import { site } from "../data/site"
import { useParallax } from "../hooks/useParallax"
import { PixelClouds } from "./pixel/PixelClouds"
import { PixelMoon } from "./pixel/PixelMoon"
import { EyebrowLabel } from "./EyebrowLabel"
import { SectionReveal } from "./SectionReveal"

export function Hero() {
  const moonY = useParallax(0.15)

  return (
    <section
      id="hero"
      className="relative overflow-hidden py-28 md:py-40"
    >
      <div className="pointer-events-none absolute right-0 top-0 hidden select-none md:block">
        <motion.div className="absolute right-6 top-0" style={{ y: moonY }}>
          <PixelMoon />
        </motion.div>
        <div className="absolute right-16 top-16">
          <PixelClouds />
        </div>
      </div>

      <SectionReveal className="relative max-w-[60ch]">
        <EyebrowLabel withDot>
          {site.role} · {site.status}
        </EyebrowLabel>

        <h1 className="mt-6 font-display text-[clamp(3rem,9vw,6.5rem)] font-bold leading-[0.95] tracking-[-0.03em] text-accent">
          {site.name}
        </h1>

        <p className="mt-6 font-display text-2xl font-semibold tracking-[-0.03em] text-text md:text-3xl">
          {site.tagline}
        </p>

        <p className="mt-6 max-w-[60ch] text-base text-muted md:text-lg">
          {site.bio}
        </p>
      </SectionReveal>
    </section>
  )
}
