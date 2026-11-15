import { useRef } from "react"
import { links } from "../data/links"
import { site } from "../data/site"
import { EyebrowLabel } from "./EyebrowLabel"
import { ExternalLink } from "./ExternalLink"
import { SectionReveal } from "./SectionReveal"
import { PixelBird } from "./pixel/PixelBird"
import { PixelTrees } from "./pixel/PixelTrees"

const LINK_CLASS = "text-muted transition-colors hover:text-accent focus-visible:text-accent"

export function Footer() {
  const footerRef = useRef<HTMLElement>(null)
  const year = new Date().getFullYear()

  return (
    <footer
      ref={footerRef}
      id="contact"
      aria-labelledby="contact-heading"
      className="relative overflow-hidden"
    >
      {/* Padding lives here so the container's bottom is the footer's bottom edge, where
          the trees stand. md:pb-40 (160px) is taller than trees + bird (104px at pixelSize 8),
          so they never reach the text above at any width. */}
      <div className="relative mx-auto max-w-[1080px] px-6 py-28 md:py-40">
        <SectionReveal>
          <EyebrowLabel withDot>
            {site.status} · {site.location}
          </EyebrowLabel>

          <h2
            id="contact-heading"
            className="mt-6 font-display text-[clamp(2.5rem,7vw,5rem)] font-bold leading-[0.95] tracking-[-0.03em] text-text"
          >
            {site.contactHeadline}
          </h2>

          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 font-mono text-xs uppercase tracking-[0.2em]">
            {links.map((link) => (
              <li key={link.label}>
                {link.href.startsWith("mailto:") ? (
                  <a href={link.href} className={LINK_CLASS}>
                    {link.label}
                  </a>
                ) : (
                  <ExternalLink href={link.href} className={LINK_CLASS}>
                    {link.label}
                  </ExternalLink>
                )}
              </li>
            ))}
          </ul>

          <p className="mt-16 font-mono text-xs uppercase tracking-[0.2em] text-muted">
            © {year} {site.name}
          </p>
        </SectionReveal>

        <PixelTrees
          target={footerRef}
          pixelSize={8}
          perch={<PixelBird pixelSize={8} />}
          className="pointer-events-none absolute bottom-0 right-6 hidden select-none md:block"
        />
      </div>
    </footer>
  )
}
