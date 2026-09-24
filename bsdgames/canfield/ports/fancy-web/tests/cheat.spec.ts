import { test, expect } from '@playwright/test'

test.describe('cheat mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?seed=12345')
    await page.waitForSelector('.table-area', { timeout: 10_000 })
  })

  test('shows visual hints after enabling cheat mode in commit phase', async ({ page }) => {
    await page.click('button:has-text("Inspect")')
    await page.waitForTimeout(200)
    await page.click('button:has-text("Commit")')
    await page.waitForTimeout(200)

    await page.click('button:has-text("Cheat: OFF")')
    await page.waitForTimeout(800)

    const arrows = page.locator('.cheat-arrow')
    const sources = page.locator('.cheat-glow-source')
    await expect(arrows.first()).toBeVisible()
    await expect(sources.first()).toBeVisible()
  })

  test('recommended Inspect button only highlights when cheat mode is on', async ({ page }) => {
    const inspectButton = page.locator('button:has-text("Inspect")')
    await expect(inspectButton).not.toHaveClass(/cheat-recommended/)

    await page.click('button:has-text("Cheat: OFF")')
    await page.waitForTimeout(300)
    await expect(inspectButton).toHaveClass(/cheat-recommended/)

    await page.click('button:has-text("Cheat: ON")')
    await page.waitForTimeout(300)
    await expect(inspectButton).not.toHaveClass(/cheat-recommended/)
  })
})
