import type { Page } from '@playwright/test'

/** Waits for the loading screen to disappear and meaningful content to appear */
export async function waitForData(page: Page, timeout = 15_000) {
  await page.waitForFunction(
    () =>
      !document.querySelector('[data-testid="loading-screen"]') && document.body.innerText.length > 100,
    { timeout },
  )
}
