import { education } from "../data/education"
import { EyebrowLabel } from "./EyebrowLabel"
import { ExternalLink } from "./ExternalLink"
import { SectionReveal } from "./SectionReveal"
import { MarginSprite } from "./pixel/MarginSprite"
import { PIECE_WIDTH, AsteroidsGap, AsteroidsPiece } from "./pixel/SpacePieces"
import { GapSprite } from "./pixel/GapSprite"
import { GAP_ROWS } from "./pixel/spaceSprites"

export function Education() {
  return (
    <section
      id="education"
      aria-labelledby="education-heading"
      className="section-y relative"
    >
      <MarginSprite side="left" top={32} width={PIECE_WIDTH} speed={0.06}>
        <AsteroidsPiece />
      </MarginSprite>
      <GapSprite side="left" rows={GAP_ROWS.asteroids}>
        {(px) => <AsteroidsGap px={px} />}
      </GapSprite>
      <SectionReveal>
        <EyebrowLabel as="h2" id="education-heading">
          Education
        </EyebrowLabel>

        <ul className="mt-6 md:mt-8 divide-y divide-border">
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
