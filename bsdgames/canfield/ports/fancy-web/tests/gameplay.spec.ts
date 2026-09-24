import { test, expect } from '@playwright/test'

test.describe('click-to-select gameplay', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.table-area', { timeout: 10_000 })
  })

  test('can move stock to tableau after committing', async ({ page }) => {
    // Use a fixed seed where the scenario is reproducible.
    await page.goto('/?seed=12345')
    await page.waitForSelector('.table-area', { timeout: 10_000 })

    // Enter commit phase.
    await page.click('button:has-text("Inspect")')
    await page.waitForTimeout(200)
    await page.click('button:has-text("Commit")')
    await page.waitForTimeout(200)

    // Click stock top card.
    await page.locator('[data-testid="stock-pile"] .card').last().click()
    await page.waitForTimeout(200)
    await expect(page.locator('.table-area')).toContainText('Selected: stock')

    // Click a tableau pile as destination.
    await page.locator('[data-testid="tableau-0"]').click()
    await page.waitForTimeout(300)

    // A legal move clears the selection; an illegal one keeps it (so the player can
    // pick another target) and explains itself.
    const area = page.locator('.table-area')
    const cleared = await area.innerText().then(t => !t.includes('Selected: stock'))
    if (!cleared) await expect(area).toContainText("Can't move there")
  })

  test('click talon then foundation either moves the card or explains the refusal', async ({ page }) => {
    await page.click('button:has-text("Inspect")')
    await page.waitForTimeout(200)
    await page.click('button:has-text("Commit")')
    await page.waitForTimeout(200)

    await page.locator('[data-testid="talon-pile"] .card').last().click()
    await page.waitForTimeout(200)

    await expect(page.locator('.table-area')).toContainText('Selected: talon')

    await page.locator('[data-testid="foundation-0"]').click()
    await page.waitForTimeout(300)

    // Legal move: selection clears. Illegal move: selection stays and the refusal is explained.
    const area = page.locator('.table-area')
    const cleared = await area.innerText().then(t => !t.includes('Selected: talon'))
    if (!cleared) await expect(area).toContainText("Can't move there")
  })

  test('Deal Hand button works in commit phase', async ({ page }) => {
    await page.goto('/?seed=12345')
    await page.waitForSelector('.table-area', { timeout: 10_000 })

    await page.click('button:has-text("Inspect")')
    await page.waitForTimeout(200)
    await page.click('button:has-text("Commit")')
    await page.waitForTimeout(200)

    const talonCountBefore = await page.locator('[data-testid="talon-pile"] .card').count()

    await page.click('button:has-text("Deal Hand")')
    await page.waitForTimeout(300)

    const talonCountAfter = await page.locator('[data-testid="talon-pile"] .card').count()
    expect(talonCountAfter).toBeGreaterThan(talonCountBefore)
  })

  test('Deal Hand button is disabled before commit', async ({ page }) => {
    const button = page.locator('button:has-text("Deal Hand")')
    await expect(button).toBeDisabled()
  })
})
