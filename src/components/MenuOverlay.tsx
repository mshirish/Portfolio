import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useEffect, useRef, type MouseEvent, type RefObject } from "react"
import { links as externalLinks } from "../data/links"
import { ExternalLink } from "./ExternalLink"
import { Starfield } from "./pixel/Starfield"
import { BurgerButton, MENU_ID } from "./BurgerButton"

export type MenuLink = { label: string; href: string }

const EXTERNAL_LINK =
  "text-muted transition-colors hover:text-accent focus-visible:text-accent motion-reduce:transition-none"

/**
 * The full-screen site menu. A native <dialog> opened with showModal(): focus
 * trap, Esc and an inert page come from the browser; the page scroll lock is
 * the shared `html:has(dialog[open])` rule. Framer Motion fades and slides the
 * panel in and out; the dialog only closes once the exit finishes.
 *
 * Choosing a section closes the menu first (releasing the scroll lock), then
 * scrolls to the section, updates the hash and focuses its heading. Opening
 * never touches the hash, so it can't collide with #project/… routing.
 */
export function MenuOverlay({
  open,
  links,
  onClose,
  returnFocusRef,
}: {
  open: boolean
  links: MenuLink[]
  onClose: () => void
  returnFocusRef: RefObject<HTMLButtonElement | null>
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)
  const pendingTarget = useRef<string | null>(null)
  const prefersReducedMotion = useReducedMotion()
  const transition = { duration: prefersReducedMotion ? 0 : 0.2, ease: "easeOut" } as const

  useEffect(() => {
    const dialog = dialogRef.current
    if (open && dialog && !dialog.open) {
      dialog.showModal()
      firstLinkRef.current?.focus()
    }
  }, [open])

  // A hash change while open (the back button, a #project/… link) closes the
  // menu, so it never sits on top of the project modal.
  useEffect(() => {
    if (!open) return
    window.addEventListener("hashchange", onClose)
    window.addEventListener("popstate", onClose)
    return () => {
      window.removeEventListener("hashchange", onClose)
      window.removeEventListener("popstate", onClose)
    }
  }, [open, onClose])

  function choose(event: MouseEvent<HTMLAnchorElement>, href: string) {
    event.preventDefault()
    pendingTarget.current = href.slice(1)
    onClose()
  }

  /** Runs once the dialog has closed and the scroll lock is gone. */
  function afterClose() {
    const id = pendingTarget.current
    pendingTarget.current = null
    const section = id ? document.getElementById(id) : null
    if (!id || !section) {
      returnFocusRef.current?.focus()
      return
    }
    section.scrollIntoView({ behavior: prefersReducedMotion ? "instant" : "smooth" })
    window.history.pushState(null, "", `#${id}`)
    const headingId = section.getAttribute("aria-labelledby")
    const heading = headingId ? document.getElementById(headingId) : null
    if (heading) {
      heading.setAttribute("tabindex", "-1")
      heading.focus({ preventScroll: true })
    }
  }

  return (
    <dialog
      ref={dialogRef}
      id={MENU_ID}
      aria-label="Site menu"
      onCancel={(event) => {
        event.preventDefault() // let the exit animation run first
        onClose()
      }}
      // The browser can still force-close (e.g. a repeated Esc); keep state in sync.
      onClose={() => {
        if (open) onClose()
      }}
      className="m-0 h-dvh max-h-none w-full max-w-none overflow-hidden border-0 bg-transparent p-0 backdrop:bg-transparent"
    >
      <AnimatePresence
        onExitComplete={() => {
          dialogRef.current?.close()
          afterClose()
        }}
      >
        {open && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={transition}
            className="fixed inset-0 isolate overflow-y-auto overscroll-contain bg-bg"
          >
            <div className="relative min-h-full">
              <Starfield />

              {/* Same row as the top bar, so × sits exactly where the burger was. */}
              <div className="border-b border-transparent">
                <div className="mx-auto flex h-[calc(var(--bar-height)-1px)] max-w-[1080px] items-center justify-end px-6">
                  <BurgerButton open onClick={onClose} />
                </div>
              </div>

              <div className="mx-auto max-w-[1080px] px-6 pb-16 pt-8 md:pt-12">
                <nav aria-label="Sections">
                  <ol className="space-y-2 md:space-y-3">
                    {links.map((link, index) => (
                      <li key={link.href}>
                        <a
                          ref={index === 0 ? firstLinkRef : undefined}
                          href={link.href}
                          onClick={(event) => choose(event, link.href)}
                          className="group inline-flex min-h-11 items-baseline gap-4 py-1 text-text transition-colors hover:text-accent focus-visible:text-accent motion-reduce:transition-none"
                        >
                          <span className="font-mono text-xs tracking-[0.2em] text-muted" aria-hidden="true">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="font-display text-[clamp(2rem,7vw,3.5rem)] font-semibold leading-none tracking-[-0.03em]">
                            {link.label}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>

                <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-1 font-mono text-xs uppercase tracking-[0.2em]">
                  {externalLinks.map((link) => (
                    <li key={link.label}>
                      {link.href.startsWith("mailto:") ? (
                        <a href={link.href} className={`inline-flex min-h-11 items-center ${EXTERNAL_LINK}`}>
                          {link.label}
                        </a>
                      ) : (
                        <ExternalLink href={link.href} className={`inline-flex min-h-11 items-center gap-1 ${EXTERNAL_LINK}`}>
                          {link.label}
                        </ExternalLink>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </dialog>
  )
}
