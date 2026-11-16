import type { CSSProperties } from "react"

/** CSS variables for the .px-bob animation: its own duration and offset. */
export function bobStyle(seconds: number, delaySeconds: number): CSSProperties {
  return {
    "--px-bob-duration": `${seconds}s`,
    "--px-bob-delay": `${-delaySeconds}s`,
  } as CSSProperties
}
