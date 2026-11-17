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
import { Starfield } from "./components/pixel/Starfield"
import { SiteHeader } from "./components/SiteHeader"

// One list drives both the page and the menu: a section whose data is empty is left out
// of both, so there's never a menu link to a missing section.
const SECTIONS: { id: string; label: string; Component: ComponentType; items: readonly unknown[] }[] = [
  { id: "projects", label: "Projects", Component: Projects, items: projects },
  { id: "certifications", label: "Certifications", Component: Certifications, items: certifications },
  { id: "skills", label: "Skills", Component: Skills, items: skillGroups.filter((group) => group.items.length > 0) },
  { id: "education", label: "Education", Component: Education, items: education },
  { id: "experience", label: "Experience", Component: Experience, items: experience },
]

const visibleSections = SECTIONS.filter((section) => section.items.length > 0)


function App() {
  // React renders after the browser's own fragment scroll, so a link like /#skills
  // would land at the top. Scroll once on mount; #project/… is handled by the modal.
  // Web fonts can still change heights above the target when they swap in, so
  // scroll once more when they're ready, unless the visitor has scrolled since.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (!id || id.startsWith("project/")) return
    const target = document.getElementById(id)
    if (!target) return
    target.scrollIntoView({ behavior: "instant" })
    const landedAt = window.scrollY
    let cancelled = false
    document.fonts.ready.then(() => {
      if (!cancelled && window.scrollY === landedAt) target.scrollIntoView({ behavior: "instant" })
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    // isolate: the starfield's -z-10 stays inside this stacking context, above the
    // body background and below every section.
    <div className="relative isolate">
      <Starfield />

      <SiteHeader />

      <main className="mx-auto max-w-[1080px] px-6">
        <Hero />
        {visibleSections.map(({ id, Component }) => (
          <Component key={id} />
        ))}
      </main>

      <Footer />
    </div>
  )
}

export default App
