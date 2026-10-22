import type { ReactNode } from "react"

export function EyebrowLabel({
  children,
  withDot = false,
  as: Tag = "p",
  id,
}: {
  children: ReactNode
  withDot?: boolean
  as?: "p" | "h2"
  id?: string
}) {
  return (
    <Tag
      id={id}
      className="flex items-center gap-2 font-mono text-xs font-normal uppercase tracking-[0.2em] text-muted"
    >
      {withDot && (
        <span
          className="h-2 w-2 rounded-full bg-status"
          aria-hidden="true"
        />
      )}
      {children}
    </Tag>
  )
}
