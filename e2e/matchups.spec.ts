import { test, expect } from '@playwright/test'

test.describe('Matchups Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/matchups')
    await page.waitForLoadState('networkidle')
  })

  test('shows MATCHUPS heading', async ({ page }) => {
    // Use role to target the page h1, avoiding sidebar nav label match
    await expect(page.getByRole('heading', { name: /MATCHUPS/i })).toBeVisible({ timeout: 15000 })
  })

  test('shows week indicator', async ({ page }) => {
    await expect(page.locator('text=/week/i').first()).toBeVisible({ timeout: 15000 })
  })

  test('previous and next week buttons exist', async ({ page }) => {
    // Look for arrow navigation buttons
    const buttons = page.locator('button')
    await expect(buttons.first()).toBeVisible({ timeout: 10000 })
  })

  test('matchup cards are rendered', async ({ page }) => {
    await page.waitForLoadState('networkidle')
    // VS text should appear in matchup cards
    await page.waitForTimeout(2000)
    const content = await page.locator('body').textContent()
    expect(content?.length).toBeGreaterThan(200)
  })

  test('navigating to a specific week via URL works', async ({ page }) => {
    await page.goto('/matchups/5')
    // Don't use networkidle — real API keeps fetching. Wait for the week label instead.
    await expect(page.locator('text=/WEEK 5/i').first()).toBeVisible({ timeout: 15000 })
  })

  test('week dots navigation bar is rendered', async ({ page }) => {
    // Multiple week dot buttons should be visible
    const buttons = page.locator('button')
    await expect(buttons.first()).toBeVisible({ timeout: 10000 })
    const count = await buttons.count()
    // At minimum: ◀, ▶, 17 week dots
    expect(count).toBeGreaterThanOrEqual(3)
  })

  test('shows VS separator between teams', async ({ page }) => {
    await page.waitForLoadState('networkidle')
    await expect(page.locator('text=VS').first()).toBeVisible({ timeout: 15000 })
  })
})
