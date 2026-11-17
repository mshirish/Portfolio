import type { CSSProperties } from "react"
import type { PixelGrid } from "./pixelGrid"
import { PixelSprite } from "./PixelSprite"
import { bigMoon, ghostRingedPlanet, giantPlanetArc, nebulaSmall, nebulaWide } from "./ghost/ghostShapes"

/**
 * Ghost art: large, very dim shapes behind the page text (see ghostShapes.ts
 * and the readability rule in CLAUDE.md).
 *
 * Each piece is anchored to a section: put it inside the section (which must
 * be `relative`), and it's positioned with offsets in % of that section's
 * width and height, so it follows the section as text reflows. `50% - 50vw`
 * is the viewport's left edge, for pieces meant to sit half off-screen.
 * Pieces may run past the section and off the screen; the app's root clips
 * horizontally (`overflow-x: clip`), so they never cause horizontal scroll.
 *
 * Layering: z-index -5, above the starfield (-10) and below all content and
 * full-color art; solid surfaces (cards, chips, dialogs) cover it. Static: no
 * parallax, bob or twinkle. `contain: paint` keeps each piece's painting to
 * its own box. 6px per cell from lg, 4px below.
 */

type Spot = Pick<CSSProperties, "left" | "right" | "top" | "bottom">

function GhostPiece({ grid, lg, sm }: { grid: PixelGrid; lg: Spot; sm: Spot }) {
  const base: CSSProperties = { zIndex: -5, contain: "paint" }
  return (
    <div className="pointer-events-none select-none" aria-hidden="true">
      <div className="absolute hidden lg:block" style={{ ...base, ...lg }}>
        <PixelSprite grid={grid} pixelSize={6} className="block" />
      </div>
      <div className="absolute lg:hidden" style={{ ...base, ...sm }}>
        <PixelSprite grid={grid} pixelSize={4} className="block" />
      </div>
    </div>
  )
}

/** Hero: the giant planet arc rising from the bottom-left, behind the bio. */
export function HeroGhost() {
  // Anchored past the viewport's left edge, so the arc's left end is off-screen.
  return (
    <GhostPiece
      grid={giantPlanetArc}
      lg={{ left: "calc(50% - 50vw - 240px)", bottom: 0 }}
      sm={{ left: "calc(50% - 50vw - 200px)", bottom: 0 }}
    />
  )
}

/** Projects: a nebula behind the card grid, spreading right. */
export function ProjectsGhost() {
  return <GhostPiece grid={nebulaWide} lg={{ left: "48%", top: "34%" }} sm={{ left: "22%", top: "38%" }} />
}

/** Skills: the large ringed planet, center-right, behind the chips. */
export function SkillsGhost() {
  return <GhostPiece grid={ghostRingedPlanet} lg={{ left: "40%", top: "-24%" }} sm={{ left: "18%", top: "18%" }} />
}

/** Education: the big moon at the left, half off-screen. */
export function EducationGhost() {
  return (
    <GhostPiece
      grid={bigMoon}
      lg={{ left: "calc(50% - 50vw - 180px)", top: "18%" }}
      sm={{ left: "calc(50% - 50vw - 120px)", top: "24%" }}
    />
  )
}

/** Contact: a nebula behind the headline. */
export function ContactGhost() {
  return <GhostPiece grid={nebulaSmall} lg={{ left: "22%", top: "4%" }} sm={{ left: "8%", top: "6%" }} />
}
