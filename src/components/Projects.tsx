import { projects } from "../data/projects"
import { useProjectRoute } from "../hooks/useProjectRoute"
import { EyebrowLabel } from "./EyebrowLabel"
import { ProjectCard } from "./ProjectCard"
import { SectionReveal } from "./SectionReveal"

export function Projects() {
  const { open } = useProjectRoute()

  return (
    <section id="projects" aria-labelledby="projects-heading" className="py-28 md:py-40">
      <SectionReveal>
        <EyebrowLabel as="h2" id="projects-heading">
          Projects
        </EyebrowLabel>

        <ul className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <li key={project.slug}>
              <ProjectCard project={project} onOpen={() => open(project.slug)} />
            </li>
          ))}
        </ul>
      </SectionReveal>
    </section>
  )
}
