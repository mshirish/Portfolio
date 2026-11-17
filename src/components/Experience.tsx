import { experience } from "../data/experience"
import { EyebrowLabel } from "./EyebrowLabel"
import { ExternalLink } from "./ExternalLink"
import { SectionReveal } from "./SectionReveal"
import { MarginSprite } from "./pixel/MarginSprite"
import { PIECE_WIDTH, IcePlanetPiece } from "./pixel/SpacePieces"

export function Experience() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="section-y relative"
    >
      <MarginSprite side="right" top={48} width={PIECE_WIDTH} speed={0.14}>
        <IcePlanetPiece />
      </MarginSprite>
      <SectionReveal>
        <EyebrowLabel as="h2" id="experience-heading">
          Experience
        </EyebrowLabel>

        <ul className="mt-6 md:mt-8 divide-y divide-border">
          {experience.map((item) => (
            <li key={item.company} className="py-10 first:pt-0 last:pb-0">
              <h3 className="font-display text-xl font-semibold tracking-[-0.03em] text-text md:text-2xl">
                {item.companyHref ? (
                  <ExternalLink
                    href={item.companyHref}
                    className="text-accent underline-offset-4 hover:underline"
                  >
                    {item.company}
                  </ExternalLink>
                ) : (
                  item.company
                )}
              </h3>
              <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-muted">
                {item.location}
              </p>

              <ul className="mt-6 space-y-6">
                {item.roles.map((role) => (
                  <li key={role.title}>
                    <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between md:gap-6">
                      <p className="font-medium text-text">{role.title}</p>
                      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted md:shrink-0">
                        {role.start} — {role.end}
                      </p>
                    </div>
                    <p className="mt-2 max-w-[60ch] text-muted">{role.summary}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </SectionReveal>
    </section>
  )
}
