import { EyebrowLabel } from "./EyebrowLabel"
import { SectionReveal } from "./SectionReveal"

export function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-heading" className="section-y">
      <SectionReveal>
        <EyebrowLabel as="h2" id="skills-heading">
          Skills
        </EyebrowLabel>
      </SectionReveal>
    </section>
  )
}
