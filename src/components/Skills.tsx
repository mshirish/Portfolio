import type { CSSProperties } from "react"
import { skillGroups } from "../data/skills"
import { EyebrowLabel } from "./EyebrowLabel"
import { SectionReveal } from "./SectionReveal"
import { MarginSprite } from "./pixel/MarginSprite"
import { PIECE_WIDTH, AstronautPiece } from "./pixel/SpacePieces"

export function Skills() {
  const groups = skillGroups.filter((group) => group.items.length > 0)

  return (
    <section id="skills" aria-labelledby="skills-heading" className="section-y relative">
      <MarginSprite side="right" top={24} width={PIECE_WIDTH} speed={0.1}>
        <AstronautPiece />
      </MarginSprite>
      <SectionReveal>
        <EyebrowLabel as="h2" id="skills-heading">
          Skills
        </EyebrowLabel>

        <div className="mt-6 grid grid-cols-1 gap-8 md:mt-8 md:grid-cols-3">
          {groups.map((group) => (
            <div key={group.label}>
              <EyebrowLabel as="h3">{group.label}</EyebrowLabel>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  // Not interactive: hover only tints the icon with its brand color (--brand).
                  <li
                    key={item.name}
                    style={{ "--brand": item.color } as CSSProperties}
                    className="group flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 transition-colors duration-150 hover:border-muted/40 motion-reduce:transition-none"
                  >
                    <item.icon
                      size={20}
                      aria-hidden="true"
                      className="shrink-0 text-muted transition-colors duration-150 group-hover:text-(--brand) motion-reduce:transition-none"
                    />
                    <span className="text-sm text-text">{item.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SectionReveal>
    </section>
  )
}
