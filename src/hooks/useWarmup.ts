import { useEffect, type RefObject } from "react"

// URLs already requested during this page view. Module-level, so it survives modal
// reopens and re-renders, and resets only on a full page load.
const fired = new Set<string>()

type NetworkInformation = { saveData?: boolean }

/**
 * Wakes a sleeping free-tier backend so the live demo is warm by the time someone
 * clicks through. Fire-and-forget: one request per URL per page view, no retries,
 * no polling. The response is opaque (`no-cors`) and ignored. Skipped when the
 * visitor has asked to save data.
 */
export function warmUp(url: string | undefined) {
  if (!url || fired.has(url)) return
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection
  if (connection?.saveData) return
  fired.add(url)
  fetch(url, { mode: "no-cors", cache: "no-store" }).catch(() => {})
}

/** Calls `warmUp(url)` the first time `target` scrolls into view. */
export function useWarmupOnView(target: RefObject<Element | null>, url: string | undefined) {
  useEffect(() => {
    const el = target.current
    if (!url || !el || fired.has(url) || typeof IntersectionObserver === "undefined") return
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        warmUp(url)
        observer.disconnect()
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, url])
}
