import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('home page loads with league name in header', async ({ page }) => {
    // The TopBar renders the actual league name from the Sleeper API in the header.
    // The real league name is "M$G Fantasy Football League" but the default fallback is "MSG FFL".
    // Wait for either the real name or the fallback to be visible in the header.
    await expect(
      page.locator('header').getByText(/M.G.*Football|MSG FFL/i).first()
    ).toBeVisible({ timeout: 15000 })
  })

  test('navigates to Standings', async ({ page }) => {
    await page.click('text=Standings')
    await expect(page).toHaveURL(/standings/)
    await page.waitForLoadState('networkidle')
    // Use the page h1 heading (not sidebar label) to avoid strict mode violation
    await expect(page.getByRole('heading', { name: /STANDINGS/i })).toBeVisible({ timeout: 10000 })
  })

  test('navigates to Draft', async ({ page }) => {
    await page.click('text=Draft')
    await expect(page).toHaveURL(/draft/)
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('heading', { name: /DRAFT BOARD/i })).toBeVisible({ timeout: 10000 })
  })

  test('navigates to Matchups', async ({ page }) => {
    await page.click('text=Matchups')
    await expect(page).toHaveURL(/matchups/)
  })

  test('navigates to Playoffs', async ({ page }) => {
    await page.click('text=Playoffs')
    await expect(page).toHaveURL(/playoffs/)
  })

  test('navigates to History', async ({ page }) => {
    await page.click('text=History')
    await expect(page).toHaveURL(/history/)
  })

  test('navigates to Achievements', async ({ page }) => {
    await page.click('text=Achievements')
    await expect(page).toHaveURL(/achievements/)
  })

  test('navigates to Transactions', async ({ page }) => {
    await page.click('text=Transactions')
    await expect(page).toHaveURL(/transactions/)
  })

  test('sidebar nav links are all present', async ({ page }) => {
    const navTexts = ['Dashboard', 'Standings', 'Matchups', 'Playoffs', 'Achievements', 'History', 'Draft', 'Transactions']
    for (const text of navTexts) {
      await expect(page.locator(`text=${text}`).first()).toBeVisible()
    }
  })
})
