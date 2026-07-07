/** A pixel-art grid: each cell is a fill color, or null for transparent. */
export type PixelGrid = (string | null)[][]

/** Renders a PixelGrid as <rect> elements on an integer grid, one rect per pixel. */
export function renderPixelGrid(grid: PixelGrid, pixelSize: number) {
  return grid.flatMap((row, y) =>
    row.map((color, x) =>
      color ? (
        <rect
          key={`${x}-${y}`}
          x={x * pixelSize}
          y={y * pixelSize}
          width={pixelSize}
          height={pixelSize}
          fill={color}
        />
      ) : null,
    ),
  )
}

export function gridSize(grid: PixelGrid, pixelSize: number) {
  const height = grid.length
  const width = grid[0]?.length ?? 0
  return { width: width * pixelSize, height: height * pixelSize }
}
