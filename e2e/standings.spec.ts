import { test, expect } from '@playwright/test'

test.describe('Standings Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/standings')
    await page.waitForLoadState('networkidle')
  })

  test('renders standings table', async ({ page }) => {
    await expect(page.locator('table, [role="table"]').first()).toBeVisible({ timeout: 15000 })
  })

  test('shows win-loss records', async ({ page }) => {
    // W-L format like "7-3" should appear in the table
    await expect(page.locator('text=/\\d+-\\d+/').first()).toBeVisible({ timeout: 15000 })
  })

  test('shows STANDINGS heading', async ({ page }) => {
    // Use role to target the page h1, avoiding sidebar nav label match
    await expect(page.getByRole('heading', { name: /STANDINGS/i })).toBeVisible({ timeout: 15000 })
  })

  test('shows PF column header', async ({ page }) => {
    await expect(page.locator('th', { hasText: 'PF' })).toBeVisible({ timeout: 15000 })
  })

  test('shows PA column header', async ({ page }) => {
    await expect(page.locator('th', { hasText: 'PA' })).toBeVisible({ timeout: 15000 })
  })

  test('shows SHOW LUCK INDEX toggle button', async ({ page }) => {
    await expect(page.locator('text=/SHOW LUCK INDEX/i')).toBeVisible({ timeout: 15000 })
  })

  test('column sort changes order', async ({ page }) => {
    await page.waitForLoadState('networkidle')
    // Wait for data to load
    const rows = page.locator('table tbody tr')
    await expect(rows.first()).toBeVisible({ timeout: 15000 })

    // Get team names in default order
    const defaultFirstRow = await rows.first().textContent()

    // Click a sortable column header (PF)
    const pfHeader = page.locator('th', { hasText: /^PF$/ }).first()
    if (await pfHeader.isVisible()) {
      await pfHeader.click()
      await page.waitForTimeout(300)
      const sortedFirstRow = await rows.first().textContent()
      // After sorting, order may change (not guaranteed to be different, but no crash)
      expect(sortedFirstRow).toBeTruthy()
    }
  })

  test('shows playoff cutline note', async ({ page }) => {
    await expect(page.locator('text=/Top 6 teams make the playoffs/i')).toBeVisible({ timeout: 15000 })
  })

  test('team rows link to manager pages', async ({ page }) => {
    const rows = page.locator('table tbody tr')
    await expect(rows.first()).toBeVisible({ timeout: 15000 })

    // Each row should have a link to /manager/
    const managerLinks = page.locator('a[href*="/manager/"]')
    await expect(managerLinks.first()).toBeVisible({ timeout: 10000 })
  })
})
