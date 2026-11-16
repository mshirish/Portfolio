/**
 * Pixel colors are roles, not hex values. Each role maps to a CSS custom
 * property `--px-<role>` defined in src/index.css, so a second palette (day
 * mode) only has to redefine the variables.
 */
export const PIXEL_ROLES = [
  "moon",
  "moon-shade",
  "moon-crater",
  "cloud-light",
  "cloud",
  "cloud-shade",
  "star",
  "sun",
  "sun-shade",
  "foliage-light",
  "foliage",
  "foliage-dark",
  "trunk",
  "ground",
  "lamp-post",
  "lamp-light",
  "fur-light",
  "fur",
  "eye",
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
