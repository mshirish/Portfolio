import { useEffect, type ComponentType } from "react"
import { Hero } from "./components/Hero"
import { Projects } from "./components/Projects"
import { Certifications } from "./components/Certifications"
import { Skills } from "./components/Skills"
import { Education } from "./components/Education"
import { Experience } from "./components/Experience"
import { Footer } from "./components/Footer"
import { projects } from "./data/projects"
import { certifications } from "./data/certifications"
import { skillGroups } from "./data/skills"
import { education } from "./data/education"
import { experience } from "./data/experience"

// One list drives both the page and the nav: a section whose data is empty is left out
// of both, so there's never a nav link to a missing section.
const SECTIONS: { id: string; label: string; Component: ComponentType; items: readonly unknown[] }[] = [
  { id: "projects", label: "Projects", Component: Projects, items: projects },
  { id: "certifications", label: "Certifications", Component: Certifications, items: certifications },
  { id: "skills", label: "Skills", Component: Skills, items: skillGroups.filter((group) => group.items.length > 0) },
  { id: "education", label: "Education", Component: Education, items: education },
  { id: "experience", label: "Experience", Component: Experience, items: experience },
]

const visibleSections = SECTIONS.filter((section) => section.items.length > 0)

const NAV_LINKS = [
  ...visibleSections.map(({ id, label }) => ({ label, href: `#${id}` })),
  { label: "Contact", href: "#contact" },
]

function App() {
  // React renders after the browser's own fragment scroll, so a link like /#skills
  // would land at the top. Scroll once on mount; #project/… is handled by the modal.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (!id || id.startsWith("project/")) return
    document.getElementById(id)?.scrollIntoView({ behavior: "instant" })
  }, [])

  return (
    <>
      <header className="mx-auto max-w-[1080px] px-6 pt-8">
        <nav
          aria-label="Section navigation"
          className="flex flex-wrap gap-6 font-mono text-xs uppercase tracking-[0.2em] text-muted"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-[1080px] px-6">
        <Hero />
        {visibleSections.map(({ id, Component }) => (
          <Component key={id} />
        ))}
      </main>

      <Footer />
    </>
  )
}

export default App
