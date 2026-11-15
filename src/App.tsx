import { useEffect } from "react"
import { Hero } from "./components/Hero"
import { Projects } from "./components/Projects"
import { Certifications } from "./components/Certifications"
import { Skills } from "./components/Skills"
import { Education } from "./components/Education"
import { Experience } from "./components/Experience"
import { Footer } from "./components/Footer"

const NAV_LINKS = [
  { label: "Projects", href: "#projects" },
  { label: "Certifications", href: "#certifications" },
  { label: "Skills", href: "#skills" },
  { label: "Education", href: "#education" },
  { label: "Experience", href: "#experience" },
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
        <Projects />
        <Certifications />
        <Skills />
        <Education />
        <Experience />
      </main>

      <Footer />
    </>
  )
}

export default App
