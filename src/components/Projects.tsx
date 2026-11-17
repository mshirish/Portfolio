import { useEffect, useRef } from "react"
import { projects } from "../data/projects"
import { useProjectRoute } from "../hooks/useProjectRoute"
import { warmUp } from "../hooks/useWarmup"
import { EyebrowLabel } from "./EyebrowLabel"
import { ProjectCard } from "./ProjectCard"
import { ProjectModal } from "./ProjectModal"
import { SectionReveal } from "./SectionReveal"
import { MarginSprite } from "./pixel/MarginSprite"
import { PIECE_WIDTH, MiniRocketGap, MiniRocketPiece } from "./pixel/SpacePieces"
import { GapSprite } from "./pixel/GapSprite"
import { GAP_ROWS } from "./pixel/spaceSprites"
import { ProjectsGhost } from "./pixel/GhostLayer"

export function Projects() {
  const { slug, open, close } = useProjectRoute()
  const openProject = projects.find((p) => p.slug === slug) ?? null
  const cards = useRef(new Map<string, HTMLButtonElement>())
  const lastOpened = useRef<string | null>(null)

  useEffect(() => {
    if (!openProject) return
    lastOpened.current = openProject.slug
    // Also covers a deep link (#project/{slug}) opened before the card is ever seen.
    warmUp(openProject.warmupUrl)
  }, [openProject])

  return (
    <section id="projects" aria-labelledby="projects-heading" className="section-y relative">
      <ProjectsGhost />
      <MarginSprite side="right" top={112} width={PIECE_WIDTH} speed={0.12}>
        <MiniRocketPiece />
      </MarginSprite>
      <GapSprite side="right" rows={GAP_ROWS.rocket}>
        {(px) => <MiniRocketGap px={px} />}
      </GapSprite>
      <SectionReveal>
        <EyebrowLabel as="h2" id="projects-heading">
          Projects
        </EyebrowLabel>

        <ul className="mt-6 md:mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <li key={project.slug}>
              <ProjectCard
                ref={(el) => {
                  if (el) cards.current.set(project.slug, el)
                  else cards.current.delete(project.slug)
                }}
                project={project}
                onOpen={() => open(project.slug)}
              />
            </li>
          ))}
        </ul>
      </SectionReveal>

      {/* One modal for the section; one project open at a time. */}
      <ProjectModal
        project={openProject}
        onClose={close}
        onClosed={() => {
          if (lastOpened.current) cards.current.get(lastOpened.current)?.focus()
        }}
      />
    </section>
  )
}
