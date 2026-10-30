import { Hero } from "./components/Hero"
import { Stack } from "./components/Stack"
import { Certifications } from "./components/Certifications"
import { Projects } from "./components/Projects"
import { Experience } from "./components/Experience"
import { Education } from "./components/Education"
import { Footer } from "./components/Footer"

const NAV_LINKS = [
  { label: "Stack", href: "#stack" },
  { label: "Certifications", href: "#certifications" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
]

function App() {
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
        <Stack />
        <Certifications />
        <Projects />
        <Experience />
        <Education />
      </main>

      <Footer />
    </>
  )
}

export default App
