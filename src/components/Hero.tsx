import { site } from "../data/site"
import { PixelSky } from "./pixel/PixelSky"
import { EyebrowLabel } from "./EyebrowLabel"
import { SectionReveal } from "./SectionReveal"

export function Hero() {
  return (
    <section
      id="hero"
      className="section-y relative overflow-hidden pt-16 md:pt-24"
    >
      <PixelSky />

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
