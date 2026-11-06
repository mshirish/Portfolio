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

function ProjectDetails({ project, onClose }: { project: Project; onClose: () => void }) {
  const { caseStudy } = project
  const front = project.images[0]

  return (
    <div className="px-5 py-6 md:px-10 md:py-10">
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
        <ExternalLink
          href={project.repoUrl}
          className="text-sm font-medium text-text underline-offset-4 transition-colors hover:text-accent hover:underline"
        >
          View source code
        </ExternalLink>
      </div>
      {project.demoNote && (
        <p className="mt-3 max-w-[70ch] font-mono text-xs leading-relaxed text-muted">{project.demoNote}</p>
      )}

      {caseStudy && (
        <>
          <Section label="Overview">
            <p className="max-w-[70ch] text-muted">{caseStudy.overview}</p>
          </Section>

          <Section label="What I built">
            <BulletList items={caseStudy.built} />
          </Section>

          {caseStudy.cloud && (
            <section className="mt-12">
              <EyebrowLabel as="h3">Cloud &amp; operations</EyebrowLabel>
              <CloudTabs views={caseStudy.cloud.views} decisions={caseStudy.cloud.decisions} />
            </section>
          )}

          {caseStudy.limitations && caseStudy.limitations.length > 0 && (
            <Section label="Known limitations">
              <BulletList items={caseStudy.limitations} />
            </Section>
          )}
        </>
      )}

      <Section label="Tech">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{project.tech.join(" · ")}</p>
      </Section>
    </div>
  )
}
