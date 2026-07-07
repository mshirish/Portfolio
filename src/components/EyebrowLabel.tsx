import type { ReactNode } from "react"

export function EyebrowLabel({
  children,
  withDot = false,
}: {
  children: ReactNode
  withDot?: boolean
}) {
  return (
    <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted">
      {withDot && (
        <span
          className="h-2 w-2 rounded-full bg-status"
          aria-hidden="true"
        />
      )}
      {children}
    </p>
  )
}
