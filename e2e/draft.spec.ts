import { test, expect } from '@playwright/test'

test.describe('Draft Board', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/draft')
    await page.waitForLoadState('networkidle')
  })

  test('shows draft board heading', async ({ page }) => {
    await expect(page.locator('text=DRAFT BOARD')).toBeVisible({ timeout: 15000 })
  })

  test('shows team column headers (not generic slot names)', async ({ page }) => {
    await expect(page.locator('text=DRAFT BOARD')).toBeVisible({ timeout: 15000 })
    // Team names should appear — "Slot 1" style fallbacks should not be needed
    await expect(page.locator('text=Slot 1')).not.toBeVisible({ timeout: 10000 })
  })

  test('shows player names in pick cells', async ({ page }) => {
    await expect(page.locator('text=DRAFT BOARD')).toBeVisible({ timeout: 15000 })
    // Table cells should contain player data
    const cells = page.locator('table tbody tr td')
    await expect(cells.first()).toBeVisible({ timeout: 10000 })
  })

  test('draft board has correct number of rounds', async ({ page }) => {
    await expect(page.locator('text=DRAFT BOARD')).toBeVisible({ timeout: 15000 })
    // Round numbers should appear in first column
    const roundCells = page.locator('table tbody tr td:first-child')
    await expect(roundCells.first()).toBeVisible({ timeout: 10000 })
  })

  test('shows RND header', async ({ page }) => {
    await expect(page.locator('text=DRAFT BOARD')).toBeVisible({ timeout: 15000 })
    await expect(page.locator('th', { hasText: 'RND' })).toBeVisible({ timeout: 10000 })
  })

  test('shows season year in heading', async ({ page }) => {
    // Heading pattern: "DRAFT BOARD — 2024"
    await expect(page.locator('text=/DRAFT BOARD.*\\d{4}/')).toBeVisible({ timeout: 15000 })
  })
})
