import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion"
import { useEffect, useRef, type KeyboardEvent, type ReactNode } from "react"
import type { Project } from "../data/projects"
import { CloudTabs } from "./CloudTabs"
import { DraftTag } from "./DraftTag"
import { EyebrowLabel } from "./EyebrowLabel"
import { ExternalLink } from "./ExternalLink"

const backdropVariants: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1 } }
const panelVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0 },
}

/**
 * Native <dialog> opened with showModal(): focus trap, inert page and Esc come from
 * the browser. Framer Motion animates the panel in and out; the dialog closes once
 * the exit animation finishes, then `onClosed` returns focus to the opener.
 */
export function ProjectModal({
  project,
  onClose,
  onClosed,
}: {
  project: Project | null
  onClose: () => void
  onClosed: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const projectRef = useRef(project)
  const prefersReducedMotion = useReducedMotion()
  const transition = { duration: prefersReducedMotion ? 0 : 0.25, ease: "easeOut" } as const

  useEffect(() => {
    projectRef.current = project
    const dialog = dialogRef.current
    if (project && dialog && !dialog.open) dialog.showModal()
  }, [project])

  function onKeyDown(event: KeyboardEvent) {
    if (event.key !== "Escape") return
    event.preventDefault() // stops the native close so the exit animation can run
    onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={project ? `project-${project.slug}-title` : undefined}
      onKeyDown={onKeyDown}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      // The browser can still force-close (e.g. a repeated Esc); keep the URL in sync.
      onClose={() => {
        if (projectRef.current) onClose()
      }}
      className="m-0 h-dvh max-h-none w-full max-w-none overflow-hidden border-0 bg-transparent p-0 backdrop:bg-transparent"
    >
      <AnimatePresence
        onExitComplete={() => {
          dialogRef.current?.close()
          onClosed()
        }}
      >
        {project && (
          <motion.div key={project.slug} initial="hidden" animate="visible" exit="hidden" className="fixed inset-0">
            <motion.div
              variants={backdropVariants}
              transition={transition}
              aria-hidden="true"
              onClick={onClose}
              className="fixed inset-0 bg-black/70"
            />
            <div
              onClick={(event) => {
                if (event.target === event.currentTarget) onClose()
              }}
              className="fixed inset-0 flex items-end justify-center md:items-center md:p-8"
            >
              <motion.div
                variants={panelVariants}
                transition={transition}
                className="relative h-full w-full overflow-y-auto overscroll-contain rounded-t-2xl border border-border bg-surface md:h-auto md:max-h-full md:max-w-[960px] md:rounded-2xl"
              >
                <ProjectDetails project={project} onClose={onClose} />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </dialog>
  )
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="mt-12">
      <EyebrowLabel as="h3">{label}</EyebrowLabel>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="max-w-[70ch] list-disc space-y-3 pl-5 text-muted marker:text-border">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

/** Links the collaborator's name (full, or first name) where it appears in the text. */
function WithNameLinked({ text, name, href }: { text: string; name: string; href: string }) {
  const match = [name, name.split(" ")[0]].find((n) => text.includes(n))
  if (!match) return <>{text}</>
  const at = text.indexOf(match)
  return (
    <>
      {text.slice(0, at)}
      <ExternalLink href={href} className={TEXT_LINK}>
        {match}
      </ExternalLink>
      {text.slice(at + match.length)}
    </>
  )
}

const TEXT_LINK = "text-accent underline-offset-4 hover:underline"
const SECONDARY_LINK =
  "text-sm font-medium text-text underline-offset-4 transition-colors hover:text-accent hover:underline"

function ProjectDetails({ project, onClose }: { project: Project; onClose: () => void }) {
  const { caseStudy, credits, gallery } = project
  const front = project.images[0]
  const views = caseStudy?.cloud?.views ?? []

  return (
    <div className="px-5 py-6 md:px-10 md:py-10">
      {/* 1. Name, subtitle, credits */}
      <header className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2
              id={`project-${project.slug}-title`}
              className="font-display text-3xl font-bold tracking-[-0.03em] text-text md:text-4xl"
            >
              {project.name}
            </h2>
            {project.draft && <DraftTag />}
          </div>
          <p className="mt-2 text-muted">{project.subtitle}</p>
          {credits && (
            <p className="mt-2 text-sm text-muted">
              {credits.text}{" "}
              <ExternalLink href={credits.href} className={TEXT_LINK}>
                {credits.name}
              </ExternalLink>
            </p>
          )}
        </div>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border text-xl leading-none text-muted transition-colors hover:border-accent hover:text-text"
        >
          <span aria-hidden="true">×</span>
        </button>
      </header>

      {/* 2. Media */}
      <div className="mt-6 aspect-[16/10] overflow-hidden rounded-xl border border-border bg-bg">
        {project.video ? (
          <video
            src={project.video.src}
            poster={project.video.poster}
            aria-label={project.video.description}
            controls
            playsInline
            preload="none"
            className="h-full w-full object-cover"
          />
        ) : (
          front && (
            <img
              src={front}
              alt={`Screenshot of ${project.name}`}
              width={800}
              height={500}
              decoding="async"
              className="h-full w-full object-cover object-top"
            />
          )
        )}
      </div>

      {/* 3. Links and notes */}
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        {project.demoUrl ? (
          <ExternalLink
            href={project.demoUrl}
            className="inline-flex items-center gap-1.5 rounded-full border border-accent px-5 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-bg focus-visible:bg-accent focus-visible:text-bg"
          >
            Try it yourself
          </ExternalLink>
        ) : (
          <span className="inline-flex items-center rounded-full border border-border px-5 py-2.5 text-sm font-medium text-muted">
            Live demo · soon
          </span>
        )}
        <ExternalLink href={project.repoUrl} className={SECONDARY_LINK}>
          View source code
        </ExternalLink>
        {project.extraLinks?.map((link) => (
          <ExternalLink key={link.href} href={link.href} className={SECONDARY_LINK}>
            {link.label}
          </ExternalLink>
        ))}
      </div>
      {project.wakeNote && (
        <p className="mt-3 font-mono text-xs leading-relaxed text-text">{project.wakeNote}</p>
      )}
      {project.demoNote && (
        <p className="mt-2 max-w-[70ch] font-mono text-xs leading-relaxed text-muted">{project.demoNote}</p>
      )}

      {/* 4. Overview */}
      {caseStudy && (
        <Section label="Overview">
          <p className="max-w-[70ch] text-muted">{caseStudy.overview}</p>
        </Section>
      )}

      {/* 5. How it works */}
      {project.howItWorks && project.howItWorks.length > 0 && (
        <Section label="How it works">
          <ol className="max-w-[70ch] list-decimal space-y-3 pl-5 text-muted marker:font-mono marker:text-accent">
            {project.howItWorks.map((step) => (
              <li key={step} className="pl-1">
                {step}
              </li>
            ))}
          </ol>
        </Section>
      )}

      {/* 6. What I built */}
      {caseStudy && caseStudy.built.length > 0 && (
        <Section label="What I built">
          <BulletList items={caseStudy.built} />
        </Section>
      )}

      {/* 7. Architecture: tabs only when there's more than one view */}
      {caseStudy?.cloud && views.length > 0 && (
        <section className="mt-12">
          <EyebrowLabel as="h3">{views.length > 1 ? "Cloud & operations" : "Architecture"}</EyebrowLabel>
          <CloudTabs views={views} decisions={caseStudy.cloud.decisions} />
        </section>
      )}

      {/* 8. Gallery */}
      {gallery && gallery.items.length > 0 && (
        <section className="mt-12">
          <EyebrowLabel as="h3">{gallery.title}</EyebrowLabel>
          <ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {gallery.items.map((item) => (
              <li key={item.src}>
                <figure>
                  <a
                    href={item.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block overflow-hidden rounded-xl border border-border bg-bg transition-colors hover:border-accent"
                  >
                    <img
                      src={item.src}
                      alt={item.alt}
                      width={item.width}
                      height={item.height}
                      loading="lazy"
                      decoding="async"
                      className="h-auto w-full"
                    />
                    <span className="sr-only"> (full size, opens in a new tab)</span>
                  </a>
                  <figcaption className="mt-2 text-sm text-muted">{item.caption}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 9. Built with */}
      {credits?.detail && (
        <Section label="Built with">
          <p className="max-w-[70ch] text-muted">
            <WithNameLinked text={credits.detail} name={credits.name} href={credits.href} />
          </p>
        </Section>
      )}

      {/* 10. Known limitations */}
      {caseStudy?.limitations && caseStudy.limitations.length > 0 && (
        <Section label="Known limitations">
          <BulletList items={caseStudy.limitations} />
        </Section>
      )}

      {/* 11. Tech */}
      <Section label="Tech">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{project.tech.join(" · ")}</p>
      </Section>
    </div>
  )
}
