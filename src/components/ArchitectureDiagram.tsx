import { useId } from "react"
import type { CloudView, DiagramEdge, DiagramNode } from "../data/projects"

// Sizes are viewBox units. Text is measured by an average glyph width, which is
// close enough for wrapping Space Grotesk labels and JetBrains Mono sublabels.
const LABEL_SIZE = 15
const SUBLABEL_SIZE = 12
const EDGE_LABEL_SIZE = 11
const LABEL_CHAR = LABEL_SIZE * 0.56
const MONO_CHAR = 0.6
const LINE_GAP = 4
const PAD_X = 12
const PAD_Y = 12
const CHIP_PAD_X = 5
const CHIP_PAD_Y = 3

interface Layout {
  nodeWidth: number
  colGap: number
  rowGap: number
}

const GRID: Layout = { nodeWidth: 184, colGap: 80, rowGap: 56 }
const COLUMN: Layout = { nodeWidth: 232, colGap: 0, rowGap: 48 }
const LANE_GAP = 16

interface Box {
  node: DiagramNode
  x: number
  y: number
  w: number
  h: number
  labelLines: string[]
  sublabelLines: string[]
}

/** Greedy wrap on " · " separators first, then on spaces. */
function wrap(text: string, maxChars: number): string[] {
  const parts = text.includes(" · ") ? text.split(" · ") : text.split(" ")
  const joiner = text.includes(" · ") ? " · " : " "
  const lines: string[] = []
  let line = ""
  for (const part of parts) {
    const candidate = line ? `${line}${joiner}${part}` : part
    if (candidate.length > maxChars && line) {
      lines.push(line)
      line = part
    } else {
      line = candidate
    }
  }
  if (line) lines.push(line)
  return lines
}

function measure(node: DiagramNode, w: number) {
  const labelLines = wrap(node.label, Math.floor((w - PAD_X * 2) / LABEL_CHAR))
  const sublabelLines = node.sublabel
    ? wrap(node.sublabel, Math.floor((w - PAD_X * 2) / (SUBLABEL_SIZE * MONO_CHAR)))
    : []
  const h =
    PAD_Y * 2 +
    labelLines.length * (LABEL_SIZE + LINE_GAP) +
    (sublabelLines.length ? 4 + sublabelLines.length * (SUBLABEL_SIZE + LINE_GAP) : 0) -
    LINE_GAP
  return { labelLines, sublabelLines, h }
}

const center = (b: Box) => ({ x: b.x + b.w / 2, y: b.y + b.h / 2 })

/** Point where the ray from the box centre towards (dx, dy) leaves the box. */
function exitPoint(b: Box, dx: number, dy: number) {
  const c = center(b)
  const tx = dx === 0 ? Infinity : b.w / 2 / Math.abs(dx)
  const ty = dy === 0 ? Infinity : b.h / 2 / Math.abs(dy)
  const t = Math.min(tx, ty)
  return { x: c.x + dx * t, y: c.y + dy * t }
}

function chipLines(label: string) {
  return label.length > 12 ? wrap(label, 12) : [label]
}

function chipSize(lines: string[]) {
  const longest = Math.max(...lines.map((l) => l.length))
  return {
    w: longest * EDGE_LABEL_SIZE * MONO_CHAR + CHIP_PAD_X * 2,
    h: lines.length * (EDGE_LABEL_SIZE + 2) + CHIP_PAD_Y * 2 - 2,
  }
}

interface Route {
  edge: DiagramEdge
  d: string
  labelAt: { x: number; y: number }
}

function gridLayout(view: CloudView) {
  const { nodeWidth: w, colGap, rowGap } = GRID
  const measured = view.nodes.map((node) => ({ node, ...measure(node, w) }))
  const rows = Math.max(...view.nodes.map((n) => n.row)) + 1
  const cols = Math.max(...view.nodes.map((n) => n.col)) + 1
  const rowHeights = Array.from({ length: rows }, (_, r) =>
    Math.max(0, ...measured.filter((m) => m.node.row === r).map((m) => m.h)),
  )
  const rowTops = rowHeights.map((_, r) =>
    rowHeights.slice(0, r).reduce((sum, h) => sum + h + rowGap, 0),
  )
  const boxes: Box[] = measured.map(({ node, labelLines, sublabelLines, h }) => ({
    node,
    labelLines,
    sublabelLines,
    w,
    h,
    x: node.col * (w + colGap),
    // Centre each node vertically within its row
    y: rowTops[node.row] + (rowHeights[node.row] - h) / 2,
  }))
  const byId = new Map(boxes.map((b) => [b.node.id, b]))

  const routes: Route[] = view.edges.map((edge) => {
    const a = byId.get(edge.from)!
    const b = byId.get(edge.to)!
    const ca = center(a)
    const cb = center(b)
    const dx = cb.x - ca.x
    const dy = cb.y - ca.y
    const len = Math.hypot(dx, dy)
    const ux = dx / len
    const uy = dy / len
    const start = exitPoint(a, ux, uy)
    const end = exitPoint(b, -ux, -uy)
    return {
      edge,
      d: `M ${start.x} ${start.y} L ${end.x} ${end.y}`,
      labelAt: { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 },
    }
  })

  const width = cols * w + (cols - 1) * colGap
  const height = rowTops[rows - 1] + rowHeights[rows - 1]
  return { boxes, routes, width, height }
}

/**
 * Single column for narrow screens. Nodes are ordered by row, then column.
 * Edges between neighbours run straight down the middle; longer edges take
 * their own lane down the right-hand side.
 */
function columnLayout(view: CloudView) {
  const { nodeWidth: w, rowGap } = COLUMN
  const ordered = [...view.nodes].sort((a, b) => a.row - b.row || a.col - b.col)
  let y = 0
  const boxes: Box[] = ordered.map((node) => {
    const m = measure(node, w)
    const box = { node, ...m, w, x: 0, y }
    y += m.h + rowGap
    return box
  })
  const index = new Map(boxes.map((b, i) => [b.node.id, i]))
  let lanes = 0

  const routes: Route[] = view.edges.map((edge) => {
    const ia = index.get(edge.from)!
    const ib = index.get(edge.to)!
    const a = boxes[ia]
    const b = boxes[ib]
    if (Math.abs(ia - ib) === 1) {
      const down = ib > ia
      const x = w / 2
      const y1 = down ? a.y + a.h : a.y
      const y2 = down ? b.y : b.y + b.h
      return { edge, d: `M ${x} ${y1} L ${x} ${y2}`, labelAt: { x, y: (y1 + y2) / 2 } }
    }
    const laneX = w + LANE_GAP * (++lanes + 1)
    const y1 = a.y + a.h / 2
    const y2 = b.y + b.h / 2
    return {
      edge,
      d: `M ${w} ${y1} L ${laneX} ${y1} L ${laneX} ${y2} L ${w} ${y2}`,
      labelAt: { x: laneX, y: (y1 + y2) / 2 },
    }
  })

  const widestChip = Math.max(0, ...view.edges.map((e) => (e.label ? chipSize(chipLines(e.label)).w : 0)))
  const width = w + (lanes ? LANE_GAP * (lanes + 1) + widestChip / 2 : 0)
  const height = y - rowGap
  return { boxes, routes, width, height }
}

function describe(view: CloudView) {
  const name = new Map(view.nodes.map((n) => [n.id, n.label]))
  const parts = view.edges.map((e) => {
    const link = e.twoWay
      ? `${name.get(e.from)} and ${name.get(e.to)} talk to each other`
      : `${name.get(e.from)} connects to ${name.get(e.to)}`
    return e.label ? `${link} (${e.label})` : link
  })
  return `${view.title}: ${parts.join("; ")}.`
}

function Diagram({ view, layout, className }: { view: CloudView; layout: "grid" | "column"; className: string }) {
  const id = useId()
  const markerId = `${id}-arrow`
  const titleId = `${id}-title`
  const descId = `${id}-desc`
  const { boxes, routes, width, height } = layout === "grid" ? gridLayout(view) : columnLayout(view)
  const margin = 4

  return (
    <svg
      role="img"
      aria-labelledby={`${titleId} ${descId}`}
      viewBox={`${-margin} ${-margin} ${width + margin * 2} ${height + margin * 2}`}
      // Never scale above 1:1, so text stays at its designed size on wide panels
      style={{ maxWidth: width + margin * 2 }}
      className={`mx-auto h-auto w-full ${className}`}
    >
      <title id={titleId}>{view.title}</title>
      <desc id={descId}>{describe(view)}</desc>
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 8 8"
          refX="7"
          refY="4"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 8 4 L 0 8 z" className="fill-muted" />
        </marker>
      </defs>

      {routes.map(({ edge, d }) => (
        <path
          key={`${edge.from}-${edge.to}`}
          d={d}
          fill="none"
          strokeWidth={1.5}
          strokeDasharray={edge.dashed ? "5 4" : undefined}
          markerEnd={`url(#${markerId})`}
          markerStart={edge.twoWay ? `url(#${markerId})` : undefined}
          className="stroke-muted"
        />
      ))}

      {boxes.map((b) => (
        <g key={b.node.id}>
          <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={10} strokeWidth={1} className="fill-surface stroke-border" />
          <text className="fill-text font-display" fontSize={LABEL_SIZE} fontWeight={600}>
            {b.labelLines.map((line, i) => (
              <tspan key={i} x={b.x + PAD_X} y={b.y + PAD_Y + LABEL_SIZE * 0.8 + i * (LABEL_SIZE + LINE_GAP)}>
                {line}
              </tspan>
            ))}
          </text>
          {b.sublabelLines.length > 0 && (
            <text className="fill-muted font-mono" fontSize={SUBLABEL_SIZE}>
              {b.sublabelLines.map((line, i) => (
                <tspan
                  key={i}
                  x={b.x + PAD_X}
                  y={
                    b.y +
                    PAD_Y +
                    b.labelLines.length * (LABEL_SIZE + LINE_GAP) +
                    4 +
                    SUBLABEL_SIZE * 0.8 +
                    i * (SUBLABEL_SIZE + LINE_GAP)
                  }
                >
                  {line}
                </tspan>
              ))}
            </text>
          )}
        </g>
      ))}

      {routes.map(({ edge, labelAt }) => {
        if (!edge.label) return null
        const lines = chipLines(edge.label)
        const chip = chipSize(lines)
        return (
          <g key={`${edge.from}-${edge.to}-label`}>
            <rect
              x={labelAt.x - chip.w / 2}
              y={labelAt.y - chip.h / 2}
              width={chip.w}
              height={chip.h}
              rx={4}
              className="fill-bg"
            />
            <text className="fill-muted font-mono" fontSize={EDGE_LABEL_SIZE} textAnchor="middle">
              {lines.map((line, i) => (
                <tspan
                  key={i}
                  x={labelAt.x}
                  y={labelAt.y - chip.h / 2 + CHIP_PAD_Y + EDGE_LABEL_SIZE * 0.8 + i * (EDGE_LABEL_SIZE + 2)}
                >
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/** Renders a CloudView as an SVG grid, or a single column below `sm` so labels stay legible. */
export function ArchitectureDiagram({ view }: { view: CloudView }) {
  return (
    <div className="rounded-xl border border-border bg-bg p-4 sm:p-6">
      <Diagram view={view} layout="grid" className="hidden sm:block" />
      <Diagram view={view} layout="column" className="sm:hidden" />
    </div>
  )
}
