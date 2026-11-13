import type { Ref } from "react"
import type { Project } from "../data/projects"
import { DraftTag } from "./DraftTag"
import { ExternalLink } from "./ExternalLink"

// Fan out on card hover, or when the case-study button has keyboard focus.
const FAN = "motion-safe:group-hover:-translate-y-2 motion-safe:group-has-[[aria-haspopup]:focus-visible]:-translate-y-2"

// Back to front. Hover/focus slides every sheet up 8px and fans the back two 2° further.
const SHEETS = [
  {
    imageIndex: 2,
    className:
      "rotate-[-3deg] motion-safe:group-hover:rotate-[-5deg] motion-safe:group-has-[[aria-haspopup]:focus-visible]:rotate-[-5deg]",
  },
  {
    imageIndex: 1,
    className:
      "rotate-[2deg] motion-safe:group-hover:rotate-[4deg] motion-safe:group-has-[[aria-haspopup]:focus-visible]:rotate-[4deg]",
  },
  { imageIndex: 0, className: "" },
]

const CARD_LINK = "font-mono text-xs uppercase tracking-[0.2em] text-accent underline-offset-4 hover:underline"

/**
 * An <article> rather than one big button, because it holds real links. The case-study
 * button's ::after stretches over the whole card so a click anywhere opens the modal;
 * the links row sits above that layer.
 */
export function ProjectCard({
  project,
  onOpen,
  ref,
}: {
  project: Project
  onOpen: () => void
  ref?: Ref<HTMLButtonElement>
}) {
  return (
    <article className="group relative h-full">
      <div className="relative aspect-[4/3]">
        {/* Back panel and its tab */}
        <div
          className="absolute left-0 top-0 h-8 w-2/5 rounded-t-xl"
          style={{ backgroundColor: project.backdrop }}
        >
          <div className="h-full w-full rounded-t-xl bg-black/15" />
        </div>
        <div
          className="absolute inset-x-0 bottom-0 top-5 overflow-hidden rounded-2xl"
          style={{ backgroundColor: project.backdrop }}
        >
          <div className="h-full w-full bg-black/15" />
        </div>

        {/* Screenshot sheets */}
        <div className="absolute inset-x-[12%] top-[16%]">
          {SHEETS.map(({ imageIndex, className }) => {
            const src = project.images[imageIndex]
            return (
              <div
                key={imageIndex}
                className={`absolute inset-x-0 top-0 rounded-lg bg-white p-1 shadow-sm shadow-black/20 transition-[translate,rotate] duration-300 ease-out motion-reduce:transition-none ${FAN} ${className}`}
              >
                <div className="aspect-[16/10] overflow-hidden rounded-md bg-white">
                  {src && (
                    <img
                      src={src}
                      alt={imageIndex === 0 ? `Screenshot of ${project.name}` : ""}
                      width={800}
                      height={500}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-top"
                    />
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Front pocket */}
        <div
          className="absolute inset-x-0 bottom-0 h-[49%] rounded-b-2xl border-t border-white/20"
          style={{ backgroundColor: project.backdrop }}
        />
      </div>

      <div className="mt-5">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="font-display text-xl font-semibold tracking-[-0.03em] text-text md:text-2xl">
            {project.name}
          </h3>
          {project.draft && <DraftTag />}
        </div>
        <p className="mt-2 max-w-[60ch] text-muted">{project.summary}</p>
        <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">
          {project.tech.join(" · ")}
        </p>
        {project.credits && (
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-muted">
            With {project.credits.name}
          </p>
        )}

        <button
          ref={ref}
          type="button"
          aria-haspopup="dialog"
          onClick={onOpen}
          className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-accent after:absolute after:inset-0 after:rounded-2xl after:content-['']"
        >
          View case study <span aria-hidden="true">→</span>
        </button>

        {(project.demoUrl || project.repoUrl) && (
          <div className="relative z-10 mt-3 flex flex-wrap gap-x-6 gap-y-2">
            {project.demoUrl && (
              <ExternalLink href={project.demoUrl} className={CARD_LINK}>
                Live demo
              </ExternalLink>
            )}
            <ExternalLink href={project.repoUrl} className={CARD_LINK}>
              Code
            </ExternalLink>
          </div>
        )}
        {project.wakeNote && (
          <p className="mt-2 font-mono text-xs text-muted">{project.wakeNote}</p>
        )}
      </div>
    </article>
  )
}
