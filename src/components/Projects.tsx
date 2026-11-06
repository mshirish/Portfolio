import { useEffect, useRef } from "react"
import { projects } from "../data/projects"
import { useProjectRoute } from "../hooks/useProjectRoute"
import { EyebrowLabel } from "./EyebrowLabel"
import { ProjectCard } from "./ProjectCard"
import { ProjectModal } from "./ProjectModal"
import { SectionReveal } from "./SectionReveal"

export function Projects() {
  const { slug, open, close } = useProjectRoute()
  const openProject = projects.find((p) => p.slug === slug) ?? null
  const cards = useRef(new Map<string, HTMLButtonElement>())
  const lastOpened = useRef<string | null>(null)

  useEffect(() => {
    if (openProject) lastOpened.current = openProject.slug
  }, [openProject])

  return (
    <section id="projects" aria-labelledby="projects-heading" className="py-28 md:py-40">
      <SectionReveal>
        <EyebrowLabel as="h2" id="projects-heading">
          Projects
        </EyebrowLabel>

        <ul className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
