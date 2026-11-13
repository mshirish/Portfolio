// Captures Levant Table screenshots for the portfolio card and demo video.
// Logs in with media/.env.local credentials (values are never printed), walks the
// order flow through Stripe test checkout, and writes PNGs plus targets.json:
// for each screen, the box of the element clicked next, so the video's cursor can
// land on real buttons. A failed step is reported and skipped, never faked.
import { config } from "dotenv"
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { chromium, type Locator, type Page } from "playwright"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
config({ path: path.join(ROOT, ".env.local"), quiet: true })

const BASE = (process.env.LEVANT_URL ?? "https://levant-table.onrender.com").replace(/\/$/, "")
const OUT = path.join(ROOT, "captures", "levant-table")
const VIEWPORT = { width: 1440, height: 900 }
const WAKE_TIMEOUT_MS = 120_000

const { DEMO_EMAIL, DEMO_PASSWORD, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env
const SECRETS = [DEMO_EMAIL, DEMO_PASSWORD, ADMIN_EMAIL, ADMIN_PASSWORD].filter(
  (v): v is string => Boolean(v),
)

interface Target {
  label: string
  x: number
  y: number
  width: number
  height: number
}
const targets: Record<string, { file: string; next: Target | null }> = {}
const results: { step: string; ok: boolean; detail: string }[] = []

/** Strips credential values from anything printed, including Playwright call logs. */
function redact(text: string) {
  return SECRETS.reduce((t, s) => t.split(s).join("***"), text)
}

async function step(name: string, fn: () => Promise<string | void>) {
  try {
    const detail = (await fn()) ?? "ok"
    results.push({ step: name, ok: true, detail })
    console.log(`✓ ${name}`)
    return true
  } catch (err) {
    const message = redact(err instanceof Error ? err.message.split("\n")[0] : String(err))
    results.push({ step: name, ok: false, detail: message })
    console.log(`✗ ${name}: ${message}`)
    return false
  }
}

async function box(label: string, locator: Locator): Promise<Target> {
  await locator.scrollIntoViewIfNeeded()
  const b = await locator.boundingBox()
  if (!b) throw new Error(`${label} has no bounding box`)
  const round = (n: number) => Math.round(n * 10) / 10
  return { label, x: round(b.x), y: round(b.y), width: round(b.width), height: round(b.height) }
}

/** Screenshot of the current viewport. `next` is measured first so the box matches the image. */
async function capture(page: Page, name: string, next: { label: string; locator: Locator } | null) {
  const target = next ? await box(next.label, next.locator) : null
  const file = `${name}.png`
  await page.screenshot({ path: path.join(OUT, file) })
  targets[name] = { file, next: target }
}

async function settle(page: Page) {
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {})
}

/** Render's free tier sleeps; keep retrying the first request until it answers. */
async function wake(page: Page) {
  const deadline = Date.now() + WAKE_TIMEOUT_MS
  let last = ""
  while (Date.now() < deadline) {
    try {
      const res = await page.goto(`${BASE}/`, { timeout: 30_000 })
      if (res?.ok()) return `awake after ${Math.round((WAKE_TIMEOUT_MS - (deadline - Date.now())) / 1000)}s`
      last = `HTTP ${res?.status()}`
    } catch (err) {
      last = err instanceof Error ? err.message.split("\n")[0] : String(err)
    }
    await page.waitForTimeout(5_000)
  }
  throw new Error(`site did not respond within ${WAKE_TIMEOUT_MS / 1000}s (${last})`)
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2 })
  const page = await context.newPage()

  if (!(await step("wake site", () => wake(page)))) {
    await browser.close()
    return finish()
  }

  const loggedIn = await step("log in", async () => {
    if (!DEMO_EMAIL || !DEMO_PASSWORD) throw new Error("DEMO_EMAIL/DEMO_PASSWORD missing in .env.local")
    await page.goto(`${BASE}/accounts/login/`)
    await page.locator('input[name="login"]').fill(DEMO_EMAIL)
    await page.locator('input[name="password"]').fill(DEMO_PASSWORD)
    await page.locator('form.auth-form button[type="submit"]').click()
    await page.waitForURL((url) => !url.pathname.startsWith("/accounts/login"), { timeout: 30_000 })
  })

  if (loggedIn) {
    await step("empty cart", async () => {
      await page.goto(`${BASE}/cart/`)
      const remove = page.getByRole("button", { name: "Remove" })
      let removed = 0
      while ((await remove.count()) > 0 && removed < 50) {
        await Promise.all([
          page.waitForResponse((r) => r.url().includes("/cart/remove/")),
          remove.first().click(),
        ])
        await page.waitForTimeout(300)
        removed++
      }
      return `removed ${removed} leftover item(s)`
    })
  }

  await step("01-storefront", async () => {
    await page.goto(`${BASE}/`)
    await settle(page)
    const grocery = page.locator('a[href="/menu/grocery/"]:visible').first()
    await capture(page, "01-storefront", { label: "Grocery category link", locator: grocery })
    await grocery.click()
    await page.waitForURL(/\/menu\/grocery\/$/)
  })

  await step("02-category", async () => {
    if (!page.url().endsWith("/menu/grocery/")) await page.goto(`${BASE}/menu/grocery/`)
    await settle(page)
    const product = page.locator('a[href^="/menu/grocery/"]:visible').filter({ has: page.locator("img") }).first()
    await capture(page, "02-category", { label: "First grocery product", locator: product })
    if (!loggedIn) return "captured; skipped add to cart (not logged in)"
    await product.click()
    await page.waitForURL(/\/menu\/grocery\/\d+\/$/)
    await Promise.all([
      page.waitForResponse((r) => r.url().includes("/cart/add/") && r.ok()),
      page.getByRole("button", { name: "Add to Cart" }).click(),
    ])
  })

  await step("03-custom-cake", async () => {
    await page.goto(`${BASE}/menu/cakes/custom/`)
    await settle(page)
    const form = page.locator('form[action^="/cart/add/"]')
    if (loggedIn) {
      await form.locator('select[name="size"]').selectOption({ index: 2 })
      await form.locator('select[name="flavor_name"]').selectOption({ index: 1 })
      const groups = form.locator('select[name^="option_group_"]')
      for (let i = 0; i < (await groups.count()); i++) {
        await groups.nth(i).selectOption({ index: 1 })
      }
      await form.locator('input[name="cake_inscription"]').fill("Happy Birthday, Sarah!")
    }
    const add = loggedIn
      ? page.getByRole("button", { name: "Add to Cart" })
      : page.getByRole("link", { name: /log in|sign in/i }).first()
    // Frame the options: size field just under the sticky header, no focus ring on the last input.
    await page.evaluate(() => {
      ;(document.activeElement as HTMLElement | null)?.blur()
      const size = document.querySelector('select[name="size"]')
      if (size) window.scrollTo(0, size.getBoundingClientRect().top + window.scrollY - 140)
    })
    await capture(page, "03-custom-cake", { label: "Add to Cart button", locator: add })
    if (!loggedIn) return "captured logged-out view; options need a login"
    await Promise.all([
      page.waitForResponse((r) => r.url().includes("/cart/add/") && r.ok()),
      add.click(),
    ])
  })

  if (!loggedIn) {
    for (const s of ["04-cart", "05-checkout", "06-stripe", "07-confirmation"]) {
      results.push({ step: s, ok: false, detail: "skipped: needs a logged-in session" })
    }
  } else {
    const toCheckout = await step("04-cart", async () => {
      await page.goto(`${BASE}/cart/`)
      await settle(page)
      const checkout = page.getByRole("link", { name: "Proceed to Checkout" })
      await capture(page, "04-cart", { label: "Proceed to Checkout", locator: checkout })
      await checkout.click()
      await page.waitForURL(/\/checkout\/$/)
    })

    const toStripe =
      toCheckout &&
      (await step("05-checkout", async () => {
        const date = page.locator("#pickup-date")
        const earliest = await date.getAttribute("min")
        if (!earliest) throw new Error("no earliest pickup date offered")
        await date.fill(earliest)
        await date.dispatchEvent("change")
        await page.locator("#pickup-window-display").getByText("Pickup window").waitFor()
        const place = page.getByRole("button", { name: "Place Order" })
        await page.locator("#pickup-window-display").scrollIntoViewIfNeeded()
        await capture(page, "05-checkout", { label: "Place Order", locator: place })
        await place.click()
        await page.waitForURL(/checkout\.stripe\.com/, { timeout: 30_000 })
      }))

    const paid =
      toStripe &&
      (await step("06-stripe", async () => {
        await settle(page)
        // Emails registered with Stripe Link open on a security-code prompt instead of the card form.
        const cardNumber = page.locator("#cardNumber")
        const skipLink = page.getByRole("button", { name: "Pay without Link" })
        await cardNumber.or(skipLink).first().waitFor({ timeout: 20_000 })
        if (await skipLink.isVisible()) await skipLink.click()
        // Newer Checkout pages put card fields behind a payment-method accordion.
        const cardTab = page.locator('[data-testid="card-accordion-item-button"]')
        if (await cardTab.isVisible().catch(() => false)) await cardTab.click()
        await page.locator("#cardNumber").fill("4242 4242 4242 4242")
        await page.locator("#cardExpiry").fill("12 / 34")
        await page.locator("#cardCvc").fill("123")
        const name = page.locator("#billingName")
        if (await name.isVisible().catch(() => false)) await name.fill("Test Customer")
        const zip = page.locator("#billingPostalCode")
        if (await zip.isVisible().catch(() => false)) await zip.fill("01610")
        const pay = page.locator('[data-testid="hosted-payment-submit-button"], button.SubmitButton').first()
        await capture(page, "06-stripe", { label: "Pay button", locator: pay })
        await pay.click()
        await page.waitForURL((url) => url.href.startsWith(BASE), { timeout: 60_000 })
      }))

    if (paid) {
      await step("07-confirmation", async () => {
        // payment_success verifies with Stripe, then redirects to the order page with ?just_paid=1.
        await page.waitForURL(
          (url) => /^\/orders\/\d+\/$/.test(url.pathname) && url.searchParams.has("just_paid"),
          { timeout: 60_000 },
        )
        await settle(page)
        await capture(page, "07-confirmation", null)
      })
    } else {
      results.push({ step: "07-confirmation", ok: false, detail: "skipped: payment did not complete" })
    }
  }

  if (ADMIN_EMAIL && ADMIN_PASSWORD) {
    await step("08-admin", async () => {
      const admin = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2 })
      const adminPage = await admin.newPage()
      await adminPage.goto(`${BASE}/admin/login/?next=/admin/orders/order/`)
      await adminPage.locator("#id_username").fill(ADMIN_EMAIL)
      await adminPage.locator("#id_password").fill(ADMIN_PASSWORD)
      await adminPage.locator('input[type="submit"], button[type="submit"]').first().click()
      await adminPage.waitForURL(/\/admin\/orders\/order\/$/, { timeout: 30_000 })
      await settle(adminPage)
      await capture(adminPage, "08-admin", null)
      await admin.close()
    })
  } else {
    results.push({ step: "08-admin", ok: false, detail: "skipped: ADMIN_EMAIL/ADMIN_PASSWORD not set" })
  }

  await browser.close()
  return finish()
}

async function finish() {
  await writeFile(
    path.join(OUT, "targets.json"),
    JSON.stringify({ viewport: VIEWPORT, deviceScaleFactor: 2, units: "CSS px, relative to the viewport", captures: targets }, null, 2) + "\n",
  )
  console.log("\nSummary")
  for (const r of results) console.log(`${r.ok ? "✓" : "✗"} ${r.step.padEnd(16)} ${r.detail}`)
  if (results.some((r) => !r.ok && !r.detail.startsWith("skipped: ADMIN"))) process.exitCode = 1
}

main().catch((err) => {
  console.error(redact(err instanceof Error ? err.stack ?? err.message : String(err)))
  process.exitCode = 1
})
