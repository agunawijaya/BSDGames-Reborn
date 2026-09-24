// One-shot screenshot capture for README media. Not part of the app;
// invoked manually to refresh `media/` after visual changes.
//
// Usage:
//   1. Build and start the preview server:  `npm run build && npm run preview -- --port 4173`
//   2. Run this script:                      `node scripts/capture-screenshots.mjs`
//   3. Screenshots land in `media/`.
//
// Every shot uses `?seed=11`, so the deal is identical from run to run.

import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const MEDIA_DIR = resolve(__dirname, '..', 'media')
const BASE = process.env.APP_URL ?? 'http://localhost:4173'
const SEED_URL = `${BASE}/?seed=11`

const card = (suit, rank, faceUp = true) => ({ suit, rank, faceUp })

async function shot(page, name) {
  console.log(`shot: ${name}`)
  await page.screenshot({ path: resolve(MEDIA_DIR, name) })
}

async function freshPage(browser, url = SEED_URL) {
  const context = await browser.newContext({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 1 })
  const page = await context.newPage()
  page.on('pageerror', (err) => console.error('pageerror:', err.message))
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForSelector('.table-area')
  return page
}

async function main() {
  await mkdir(MEDIA_DIR, { recursive: true })
  const browser = await chromium.launch()

  // 01 - initial deal (Buy phase; the phase notice is on screen).
  let page = await freshPage(browser)
  await page.waitForTimeout(700)
  await shot(page, '01-initial-deal.png')

  // 02 - a move in Buy pays Inspect automatically; the betting info box is open.
  await page.locator('[data-testid="tableau-0"] .card').last().dblclick()
  await page.waitForTimeout(700)
  await page.fill('input[aria-label="Command input"]', 'b')
  await page.keyboard.press('Enter')
  await page.waitForTimeout(400)
  await shot(page, '02-betting-panel.png')

  // Close the betting box again so the counting panel is on screen in shot 03.
  await page.fill('input[aria-label="Command input"]', 'b')
  await page.keyboard.press('Enter')

  // 03 - mid-game: committed, hand dealt, card counting ON.
  await page.click('button:has-text("Commit")')
  await page.click('button:has-text("Count: OFF")')
  for (let i = 0; i < 3; i++) await page.click('button:has-text("Deal Hand")')
  await page.waitForTimeout(6000) // let the phase notice fade
  await shot(page, '03-midgame.png')

  // 04 - help.
  await page.keyboard.press('?')
  await page.waitForTimeout(400)
  await shot(page, '04-help.png')
  await page.context().close()

  // 05 - cheat mode ON (arrows + green glow).
  page = await freshPage(browser)
  await page.click('button:has-text("Commit")')
  await page.click('button:has-text("Cheat: OFF")')
  await page.waitForTimeout(6000)
  await shot(page, '05-cheat-mode.png')
  await page.context().close()

  // 06 - victory: inject a nearly finished game and play the last card.
  page = await freshPage(browser, `${BASE}/`)
  const suits = ['spades', 'hearts', 'clubs', 'diamonds']
  const nearWin = {
    foundations: suits.map((s, si) => Array.from({ length: si === 3 ? 12 : 13 }, (_, i) => card(s, i + 1))),
    tableaus: [[card('diamonds', 13)], [], [], []],
    stock: [], talon: [], hand: [], baseCard: card('spades', 1),
    phase: 'commit', bankroll: -52 + 51 * 5, seed: 3,
    countedCards: Array(52).fill(true), seenCards: Array(52).fill(true), countingOn: false,
    totalInfoCost: 0, handRuns: 0, timesThru: 0, lastMoveTime: Date.now(), moveHistory: [], status: 'playing',
  }
  await page.evaluate((s) => localStorage.setItem('canfield-fancy-web:game', JSON.stringify(s)), nearWin)
  await page.reload({ waitUntil: 'networkidle' })
  await page.waitForSelector('.table-area')
  await page.locator('[data-testid="tableau-0"] .card').last().dblclick()
  await page.waitForTimeout(3500)
  await shot(page, '06-victory.png')

  await browser.close()
  console.log(`done - screenshots saved to ${MEDIA_DIR}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
