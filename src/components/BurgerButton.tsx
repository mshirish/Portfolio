import type { Ref } from "react"
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

/**
 * The 44×44 menu button: three bars when the menu is closed, a × when it's
 * open. Text color, accent on hover and focus.
 */
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
