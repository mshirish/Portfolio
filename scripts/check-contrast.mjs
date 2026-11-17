#!/usr/bin/env node
// Checks the readability rule for art behind text (see CLAUDE.md, Pixel art):
//   - every text color that sits on the page background keeps at least 4.5:1
//     against every ghost role (--px-ghost-*)
//   - the starfield (--px-star-dim) stays at most 1.6:1 against the background
// Colors are read from src/index.css. Text colors are found by scanning src/
// for `text-<color>` classes, so a new text color can't skip the check: it's
// either checked against the ghost roles or listed in EXEMPT with a reason.
// Prints a table; exits 1 on any failure. Plain Node, no dependencies.

import { readFileSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"

const CSS = "src/index.css"
const MIN_TEXT = 4.5
const MAX_STARFIELD = 1.6

/** Text colors that never sit over ghost art, with the reason. */
const EXEMPT = {
  bg: "label on the solid accent pill inside the project modal",
  border: "list markers inside the project modal panel (solid surface)",
}

const css = readFileSync(CSS, "utf8")

/** All `--name: #hex;` declarations in the stylesheet. */
const vars = Object.fromEntries(
  [...css.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\b/g)].map(([, name, hex]) => [name, hex.toLowerCase()]),
)

function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

function sourceFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return sourceFiles(path)
    return /\.(tsx?|css)$/.test(name) ? [path] : []
  })
}

// Theme colors (--color-*) that are used as text somewhere in src/.
const themeColors = Object.keys(vars)
  .filter((name) => name.startsWith("color-"))
  .map((name) => name.slice("color-".length))
const usedAsText = new Set()
for (const file of sourceFiles("src")) {
  const source = readFileSync(file, "utf8")
  for (const color of themeColors) {
    if (new RegExp(`(?<![\\w-])text-${color}(?![\\w-])`).test(source)) usedAsText.add(color)
  }
}

const ghosts = Object.keys(vars).filter((name) => name.startsWith("px-ghost-"))
const failures = []

if (!vars["color-bg"]) failures.push(`--color-bg not found in ${CSS}`)
if (!vars["px-star-dim"]) failures.push(`--px-star-dim not found in ${CSS}`)
if (ghosts.length === 0) failures.push(`no --px-ghost-* roles found in ${CSS}`)

const checked = [...usedAsText].filter((color) => !(color in EXEMPT)).sort()
const exempt = [...usedAsText].filter((color) => color in EXEMPT).sort()

// Text against every ghost role.
const pad = (value, width) => String(value).padEnd(width)
console.log(`Text colors against ghost roles (each must be at least ${MIN_TEXT}:1)\n`)
const header = ["text color", ...ghosts.map((g) => g.replace("px-", ""))]
const widths = header.map((h) => Math.max(h.length, 18))
console.log(header.map((h, i) => pad(h, widths[i])).join("  "))
for (const color of checked) {
  const cells = ghosts.map((ghost) => {
    const ratio = contrast(vars[`color-${color}`], vars[ghost])
    if (ratio < MIN_TEXT) failures.push(`text ${color} on ${ghost}: ${ratio.toFixed(2)}:1 < ${MIN_TEXT}:1`)
    return `${ratio.toFixed(2)}:1${ratio < MIN_TEXT ? " FAIL" : ""}`
  })
  console.log([`${color} ${vars[`color-${color}`]}`, ...cells].map((c, i) => pad(c, widths[i])).join("  "))
}
console.log(`\nGhost roles: ${ghosts.map((g) => `${g.replace("px-", "")} ${vars[g]}`).join(", ")}`)
if (exempt.length) {
  console.log("Not checked (never over ghost art):")
  for (const color of exempt) console.log(`  text-${color}: ${EXEMPT[color]}`)
}

// Starfield against the background.
if (vars["px-star-dim"] && vars["color-bg"]) {
  const ratio = contrast(vars["px-star-dim"], vars["color-bg"])
  const ok = ratio <= MAX_STARFIELD
  if (!ok) failures.push(`star-dim on bg: ${ratio.toFixed(2)}:1 > ${MAX_STARFIELD}:1`)
  console.log(
    `\nStarfield: star-dim ${vars["px-star-dim"]} on bg ${vars["color-bg"]}: ${ratio.toFixed(2)}:1 (at most ${MAX_STARFIELD}:1)${ok ? "" : " FAIL"}`,
  )
}

if (failures.length) {
  console.error(`\n${failures.length} contrast check(s) failed:`)
  for (const failure of failures) console.error(`  - ${failure}`)
  process.exit(1)
}
console.log("\nAll contrast checks passed.")
