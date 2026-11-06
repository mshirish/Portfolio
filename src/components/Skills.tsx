import { EyebrowLabel } from "./EyebrowLabel"
import { SectionReveal } from "./SectionReveal"

export function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-heading" className="py-28 md:py-40">
      <SectionReveal>
        <EyebrowLabel as="h2" id="skills-heading">
          Skills
        </EyebrowLabel>
      </SectionReveal>
    </section>
  )
}
