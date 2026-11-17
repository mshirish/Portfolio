import type { ReactNode } from "react"

export type GapScale = 2 | 3

/**
 * Places a section's space piece in the gap above the section, below 1280px
 * (from 1280 MarginSprite takes over, never both).
 *
 * The gap between two sections is the previous section's bottom padding plus
 * this section's top padding (section-y): 64px below md, 96px from md, and its
 * middle is this section's top edge. The piece is centered on that edge and
 * aligned to the content column's left or right edge. It's absolutely
 * positioned, so it never changes any section's spacing or height. The parent
 * section must be `relative`.
 *
 * Pieces must fit the gap with room for the 3px bob: at most 48px tall below md
 * (2px per cell, so 24 rows) and 80px from md (3px per cell, 26 rows). No
 * parallax here; it could carry a piece out of the gap into content.
 */
export function GapSprite({
  side,
  rows,
  children,
}: {
  side: "left" | "right"
  /** The piece's height in cells. */
  rows: number
  /** Renders the piece at the given pixel size. */
  children: (px: GapScale) => ReactNode
}) {
  return (
    <div className="pointer-events-none select-none xl:hidden" aria-hidden="true">
      {([2, 3] as const).map((px) => (
        <div
          key={px}
          className={`absolute ${px === 2 ? "md:hidden" : "hidden md:block"}`}
          style={{ top: -Math.round((rows * px) / 2), [side]: 0 }}
        >
          {children(px)}
        </div>
      ))}
    </div>
  )
}
