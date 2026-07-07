import { Hero } from "./components/Hero"
import { Stack } from "./components/Stack"
import { Projects } from "./components/Projects"
import { Experience } from "./components/Experience"
import { Footer } from "./components/Footer"

const NAV_LINKS = [
  { label: "Stack", href: "#stack" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
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
        <Projects />
        <Experience />
      </main>

      <Footer />
    </>
  )
}

export default App
