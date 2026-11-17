import { useEffect, useRef, useState, type Ref } from "react"
import type { PixelGrid, PixelRole } from "./pixel/pixelGrid"
import { PixelSprite } from "./pixel/PixelSprite"

const U: PixelRole = "ui" // currentColor: follows the button's text/accent color
const n = null

/** Three bars, 9×7 cells at 2px. */
const burgerIcon: PixelGrid = [
  [U, U, U, U, U, U, U, U, U],
  [n, n, n, n, n, n, n, n, n],
  [n, n, n, n, n, n, n, n, n],
  [U, U, U, U, U, U, U, U, U],
  [n, n, n, n, n, n, n, n, n],
  [n, n, n, n, n, n, n, n, n],
  [U, U, U, U, U, U, U, U, U],
]

/** A pixel ×, 9×7 cells at 2px: drawn as its own grid, never a rotated burger. */
const closeIcon: PixelGrid = Array.from({ length: 7 }, (_, y) =>
  Array.from({ length: 9 }, (_, x) => (x === y + 1 || x === 7 - y ? U : n)),
)

export const MENU_ID = "site-menu"

/** The 44×44 burger button. Shows the × while the menu is open. */
export function BurgerButton({
  open,
  onClick,
  buttonRef,
}: {
  open: boolean
  onClick: () => void
  buttonRef?: Ref<HTMLButtonElement>
}) {
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      aria-controls={MENU_ID}
      className="-mr-3 flex h-11 w-11 items-center justify-center text-text transition-colors hover:text-accent focus-visible:text-accent motion-reduce:transition-none"
    >
      <PixelSprite grid={open ? closeIcon : burgerIcon} pixelSize={2} />
    </button>
  )
}

/**
 * The sticky top bar: solid page background, nothing on the left, the burger
 * on the right, aligned with the 1080px column. A 1px bottom border appears
 * once the page has scrolled (watched with an IntersectionObserver on a marker
 * at the top of the page, not a scroll handler).
 */
export function SiteHeader() {
  const markerRef = useRef<HTMLDivElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const marker = markerRef.current
    if (!marker) return
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting))
    observer.observe(marker)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <div ref={markerRef} className="pointer-events-none absolute left-0 top-0 h-px w-px" aria-hidden="true" />
      <header
        className={`sticky top-0 z-30 border-b bg-bg ${scrolled ? "border-border" : "border-transparent"}`}
      >
        <div className="mx-auto flex h-[calc(var(--bar-height)-1px)] max-w-[1080px] items-center justify-end px-6">
          <BurgerButton open={open} onClick={() => setOpen((value) => !value)} />
        </div>
      </header>
    </>
  )
}
