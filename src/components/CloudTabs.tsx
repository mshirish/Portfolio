import { motion, useReducedMotion } from "framer-motion"
import { useId, useRef, useState, type KeyboardEvent } from "react"
import type { CloudView } from "../data/projects"
import { ArchitectureDiagram } from "./ArchitectureDiagram"
import { EyebrowLabel } from "./EyebrowLabel"

/** Segmented control switching between deployment views, built as an ARIA tablist. */
export function CloudTabs({ views, decisions }: { views: CloudView[]; decisions: string[] }) {
  const [active, setActive] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const baseId = useId()
  const prefersReducedMotion = useReducedMotion()

  function onKeyDown(event: KeyboardEvent) {
    const last = views.length - 1
    const keys: Record<string, number> = {
      ArrowRight: active === last ? 0 : active + 1,
      ArrowLeft: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    }
    const next = keys[event.key]
    if (next === undefined) return
    event.preventDefault()
    setActive(next)
    tabs.current[next]?.focus()
  }

  return (
    <>
      <div
        role="tablist"
        aria-label="Deployment"
        onKeyDown={onKeyDown}
        className="mt-4 inline-flex rounded-full border border-border bg-surface p-1"
      >
        {views.map((view, i) => (
          <button
            key={view.id}
            ref={(el) => {
              tabs.current[i] = el
            }}
            type="button"
            role="tab"
            id={`${baseId}-tab-${view.id}`}
            aria-selected={i === active}
            aria-controls={`${baseId}-panel-${view.id}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={`relative rounded-full px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] transition-colors ${
              i === active ? "text-text" : "text-muted hover:text-text"
            }`}
          >
            {i === active && (
              <motion.span
                layoutId={`${baseId}-pill`}
                transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: "easeOut" }}
                className="absolute inset-0 rounded-full bg-border shadow-sm shadow-black/40"
              />
            )}
            <span className="relative">{view.tabLabel}</span>
          </button>
        ))}
      </div>

      {views.map((view, i) => (
        <div
          key={view.id}
          role="tabpanel"
          id={`${baseId}-panel-${view.id}`}
          aria-labelledby={`${baseId}-tab-${view.id}`}
          hidden={i !== active}
          tabIndex={0}
          className="mt-6 rounded-xl"
        >
          <h4 className="font-display text-lg font-semibold tracking-[-0.03em] text-text">{view.title}</h4>
          <div className="mt-4">
            <ArchitectureDiagram view={view} />
          </div>
          <p className="mt-4 max-w-[60ch] text-sm text-muted">{view.caption}</p>
          {view.note && <p className="mt-2 font-mono text-xs leading-relaxed text-muted">{view.note}</p>}
        </div>
      ))}

      <div className="mt-8">
        <EyebrowLabel as="h4">Key decisions</EyebrowLabel>
        <ul className="mt-4 max-w-[70ch] list-disc space-y-3 pl-5 text-muted marker:text-border">
          {decisions.map((decision) => (
            <li key={decision}>{decision}</li>
          ))}
        </ul>
      </div>
    </>
  )
}
