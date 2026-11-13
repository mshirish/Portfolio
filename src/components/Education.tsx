import { education } from "../data/education"
import { EyebrowLabel } from "./EyebrowLabel"
import { ExternalLink } from "./ExternalLink"
import { SectionReveal } from "./SectionReveal"

export function Education() {
  return (
    <section
      id="education"
      aria-labelledby="education-heading"
      className="py-28 md:py-40"
    >
      <SectionReveal>
        <EyebrowLabel as="h2" id="education-heading">
          Education
        </EyebrowLabel>

        <ul className="mt-10 divide-y divide-border">
          {education.map((item) => (
            <li key={item.degree} className="py-10 first:pt-0 last:pb-0">
              <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between md:gap-6">
                <h3 className="font-display text-xl font-semibold tracking-[-0.03em] text-text md:text-2xl">
                  {item.degree}
                </h3>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted md:shrink-0">
                  {item.date}
                </p>
              </div>
              <p className="mt-3">
                <ExternalLink
                  href={item.schoolHref}
                  className="text-accent underline-offset-4 hover:underline"
                >
                  {item.school}
                </ExternalLink>
              </p>
              <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-muted">
                {item.location}
              </p>
            </li>
          ))}
        </ul>
      </SectionReveal>
    </section>
  )
}
