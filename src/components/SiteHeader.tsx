import { useCallback, useEffect, useRef, useState } from "react"
import { BurgerButton } from "./BurgerButton"
import { MenuOverlay, type MenuLink } from "./MenuOverlay"

/**
 * The sticky top bar: solid page background, nothing on the left, the burger
 * on the right, aligned with the 1080px column. A 1px bottom border appears
 * once the page has scrolled (watched with an IntersectionObserver on a marker
 * at the top of the page, not a scroll handler). The burger opens the
 * full-screen menu.
 */
export function SiteHeader({ links }: { links: MenuLink[] }) {
  const markerRef = useRef<HTMLDivElement>(null)
  const burgerRef = useRef<HTMLButtonElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])

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
          <BurgerButton open={open} onClick={() => setOpen(true)} buttonRef={burgerRef} />
        </div>
      </header>
      <MenuOverlay open={open} links={links} onClose={close} returnFocusRef={burgerRef} />
    </>
  )
}
