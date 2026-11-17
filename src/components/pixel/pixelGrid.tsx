/**
 * Pixel colors are roles, not hex values. Each role maps to a CSS custom
 * property `--px-<role>` defined in src/index.css, so a second palette (light
 * mode) only has to redefine the variables.
 */
export const PIXEL_ROLES = [
  // Moon and stars
  "moon",
  "moon-shade",
  "moon-crater",
  "star",
  "star-dim",
  // Sun (future light mode)
  "sun",
  "sun-shade",
  // Planets: amber ringed, small rust-red, ice-blue
  "planet-sand",
  "planet-sand-band",
  "planet-sand-shade",
  "planet-rust",
  "planet-rust-shade",
  "planet-ice",
  "planet-ice-shade",
  "ring",
  "ring-shade",
  // Rockets
  "rocket-body",
  "rocket-trim",
  "rocket-window",
  "flame-hot",
  "flame",
  // Hardware and surfaces
  "metal",
  "metal-shade",
  "ground",
  "ground-shade",
  "crater",
  // Ghost art (behind text): dim tones only, checked by npm run check:contrast
  "ghost-1",
  "ghost-2",
  "ghost-3",
  "ghost-4",
  "ghost-nebula",
  // Interface icons: follows the element's text color
  "ui",
] as const

export type PixelRole = (typeof PIXEL_ROLES)[number]

/** A pixel-art grid: each cell is a color role, or null for transparent. */
export type PixelGrid = (PixelRole | null)[][]

/**
 * Renders a PixelGrid as <rect> elements on an integer grid. Horizontal runs
 * of the same role in a row are merged into one rect, which keeps the DOM small
 * without changing how the art looks.
 */
export function renderPixelGrid(grid: PixelGrid, pixelSize: number) {
  const rects = []
  for (let y = 0; y < grid.length; y++) {
    const row = grid[y]
    let x = 0
    while (x < row.length) {
      const role = row[x]
      let end = x + 1
      while (end < row.length && row[end] === role) end++
      if (role) {
        rects.push(
          <rect
            key={`${x}-${y}`}
            x={x * pixelSize}
            y={y * pixelSize}
            width={(end - x) * pixelSize}
            height={pixelSize}
            fill={`var(--px-${role})`}
          />,
        )
      }
      x = end
    }
  }
  return rects
}

export function gridSize(grid: PixelGrid, pixelSize: number) {
  const height = grid.length
  const width = grid[0]?.length ?? 0
  return { width: width * pixelSize, height: height * pixelSize }
}
