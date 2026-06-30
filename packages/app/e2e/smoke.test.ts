import { expect, test } from '@playwright/test';

test('editor boots and preview iframe paginates the sample CV', async ({ page }) => {
  await page.goto('/lebenslauf-anschreiben-creator/');

  // App chrome renders.
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  // The preview iframe is mounted.
  const iframe = page.frameLocator('iframe[title="CV preview"]');

  // Paged.js has paginated the template (at least one .pagedjs_page present).
  await expect(iframe.locator('.pagedjs_page').first()).toBeVisible({ timeout: 15_000 });

  // The sample CV name is rendered inside the paginated output.
  await expect(iframe.locator('.cv-name', { hasText: 'Alex Muster' })).toBeVisible();

  // The sidebar rendered (proves template stylesheet loaded inside iframe).
  await expect(iframe.locator('.cv-sidebar')).toBeVisible();
});
