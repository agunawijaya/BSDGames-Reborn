import { test, expect, type Page } from '@playwright/test'

const c = (suit: string, rank: number, faceUp = true) => ({ suit, rank, faceUp })

async function startFromSave(page: Page, state: unknown) {
  await page.goto('/')
  await page.evaluate(s => localStorage.setItem('canfield-fancy-web:game', JSON.stringify(s)), state)
  await page.reload()
  await page.waitForSelector('.table-area')
}

const nearWin = () => {
  const suits = ['spades', 'hearts', 'clubs', 'diamonds']
  return {
    foundations: suits.map((s, si) => Array.from({ length: si === 3 ? 12 : 13 }, (_, i) => c(s, i + 1))),
    tableaus: [[c('diamonds', 13)], [], [], []],
    stock: [], talon: [], hand: [], baseCard: c('spades', 1),
    phase: 'commit', bankroll: -52 + 51 * 5, seed: 3,
    countedCards: Array(52).fill(true), seenCards: Array(52).fill(true), countingOn: false,
    totalInfoCost: 0, handRuns: 0, timesThru: 0, lastMoveTime: Date.now(), moveHistory: [], status: 'playing',
  }
}

test.describe('fancy-web features', () => {
  test('double-click sends a playable card to a foundation (seed 11, Buy phase)', async ({ page }) => {
    await page.goto('/?seed=11')
    await page.waitForSelector('.table-area')
    const before = await page.locator('.foundation-row .card').count()
    await page.locator('[data-testid="tableau-0"] .card').last().dblclick()
    await expect(page.locator('.foundation-row .card')).toHaveCount(before + 1)
    await expect(page.locator('.bankroll')).toContainText('-$26') // deal $13 + automatic Inspect $13
  })

  test('double-click on a card that cannot go up says so', async ({ page }) => {
    await page.goto('/?seed=11')
    await page.waitForSelector('.table-area')
    await page.locator('[data-testid="tableau-1"] .card').last().dblclick()
    await expect(page.locator('.table-area')).toContainText('cannot go to a foundation')
  })

  test('typing ht / n / u in the command bar does not trigger global shortcuts', async ({ page }) => {
    await page.goto('/?seed=11')
    await page.waitForSelector('.table-area')
    await page.locator('input[aria-label="Command input"]').click()
    await page.keyboard.type('htnu')
    await expect(page.locator('.modal')).toHaveCount(0)
    await expect(page.locator('input[aria-label="Command input"]')).toHaveValue('htnu')
    await expect(page.locator('.bankroll')).toContainText('-$13')
  })

  test('Cheat glows appear only when Cheat is ON', async ({ page }) => {
    await page.goto('/?seed=11')
    await page.waitForSelector('.table-area')
    await expect(page.locator('.cheat-glow-source, .cheat-glow-target')).toHaveCount(0)
    await page.click('button:has-text("Cheat: OFF")')
    await expect(page.locator('button:has-text("Cheat: ON")')).toHaveAttribute('aria-pressed', 'true')
    await expect(page.locator('.cheat-glow-source, .cheat-glow-target').first()).toBeVisible()
  })

  test('Count is an ON/OFF toggle; the panel exists only while ON', async ({ page }) => {
    await page.goto('/?seed=11')
    await page.waitForSelector('.table-area')
    await expect(page.locator('[data-testid="counting-panel"]')).toHaveCount(0)
    await page.click('button:has-text("Count: OFF")')
    await expect(page.locator('[data-testid="counting-panel"]')).toBeVisible()
    await expect(page.locator('.bankroll')).toContainText('-$14') // $1 for the visible talon card
    await page.click('button:has-text("Count: ON")')
    await expect(page.locator('[data-testid="counting-panel"]')).toHaveCount(0)
  })

  test('Reset Bankroll erases the Account Book and restarts at -$13', async ({ page }) => {
    page.on('dialog', d => d.accept())
    await page.goto('/?seed=11')
    await page.waitForSelector('.table-area')
    await page.locator('input[aria-label="Command input"]').fill('q')
    await page.keyboard.press('Enter')
    await page.click('button:has-text("Play Again")')
    await expect(page.locator('.panel:has-text("Account Book")')).toContainText('Seed 11')
    await page.click('button:has-text("Reset Bankroll")')
    await expect(page.locator('.panel:has-text("Account Book")')).toContainText('No finished sessions yet')
    await expect(page.locator('.bankroll')).toContainText('-$13')
  })

  test('winning pays +$208 and plays the bouncing-cards animation', async ({ page }) => {
    await startFromSave(page, nearWin())
    await page.locator('[data-testid="tableau-0"] .card').last().dblclick()
    await expect(page.locator('.modal')).toContainText('You won!')
    await expect(page.locator('.modal')).toContainText('+$208')
    await expect(page.locator('[data-testid="win-animation"] .win-card').first()).toBeAttached()
    await page.click('button:has-text("Play Again")')
    await expect(page.locator('[data-testid="win-animation"]')).toHaveCount(0)
  })

  test('phone width: the whole board is visible and the page does not scroll sideways', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/?seed=11')
    await page.waitForSelector('.table-area')
    const box = await page.locator('.table-area').boundingBox()
    expect(box!.height).toBeGreaterThan(400)
    const overflowX = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflowX).toBeLessThanOrEqual(0)
    for (let i = 0; i < 4; i++) await expect(page.locator(`[data-testid="tableau-${i}"]`)).toBeInViewport()
  })

  test('illegal talon drop on an empty space explains the rule', async ({ page }) => {
    await startFromSave(page, {
      ...nearWin(), phase: 'commit', status: 'playing', foundations: [[c('hearts', 1)], [], [], []],
      baseCard: c('hearts', 1), tableaus: [[], [c('spades', 9)], [c('clubs', 4)], []],
      stock: [c('clubs', 3, false), c('diamonds', 6)], talon: [c('diamonds', 8)],
    })
    await page.locator('[data-testid="talon-pile"] .card').last().click()
    await page.locator('[data-testid="tableau-0"]').click()
    await expect(page.locator('.table-area')).toContainText('only after the stock is used up')
  })
})
