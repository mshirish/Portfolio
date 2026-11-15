import { useCallback, useEffect, useRef, useState } from "react"

const PREFIX = "#project/"

function slugFromHash() {
  const { hash } = window.location
  return hash.startsWith(PREFIX) ? decodeURIComponent(hash.slice(PREFIX.length)) : null
}

/**
 * Keeps the open project in the URL as `#project/{slug}`.
 * Opening pushes a history entry so the back button closes the modal. Closing from
 * the UI goes back if we pushed that entry, otherwise (opened from a shared link)
 * it replaces the hash with `#projects`.
 */
export function useProjectRoute() {
  const [slug, setSlug] = useState<string | null>(slugFromHash)
  const pushed = useRef(false)

  useEffect(() => {
    const sync = () => {
      const next = slugFromHash()
      if (!next) pushed.current = false
      setSlug(next)
    }
    window.addEventListener("popstate", sync)
    window.addEventListener("hashchange", sync)
    return () => {
      window.removeEventListener("popstate", sync)
      window.removeEventListener("hashchange", sync)
    }
  }, [])

  const open = useCallback((next: string) => {
    window.history.pushState(null, "", `${PREFIX}${encodeURIComponent(next)}`)
    pushed.current = true
    setSlug(next)
  }, [])

  const close = useCallback(() => {
    if (pushed.current) {
      pushed.current = false
      window.history.back() // popstate clears the slug
      return
    }
    window.history.replaceState(null, "", "#projects")
    setSlug(null)
  }, [])

  return { slug, open, close }
}
