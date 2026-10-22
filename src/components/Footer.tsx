import { EyebrowLabel } from "./EyebrowLabel"
import { SectionReveal } from "./SectionReveal"

export function Footer() {
  return (
    <footer id="contact" className="py-28 md:py-40">
      <div className="mx-auto max-w-[1080px] px-6">
        <SectionReveal>
          <EyebrowLabel as="h2">Contact</EyebrowLabel>
        </SectionReveal>
      </div>
    </footer>
  )
}
