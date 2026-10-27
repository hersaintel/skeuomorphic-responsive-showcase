import { expect, test } from '@playwright/test';

test('preview tabs switch the adaptive layout and support arrow keys', async ({ page }) => {
  await page.goto('/?preview=desktop');
  const shell = page.locator('[data-preview-shell]');
  await expect(shell).toHaveAttribute('data-preview', 'desktop');

  const desktop = page.getByRole('tab', { name: 'Desktop' });
  await desktop.focus();
  await desktop.press('ArrowRight');
  await expect(shell).toHaveAttribute('data-preview', 'tablet');
  await expect(page.getByRole('tab', { name: 'Tablet' })).toBeFocused();

  await page.getByRole('tab', { name: 'Mobile' }).click();
  await expect(shell).toHaveAttribute('data-preview', 'mobile');
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
});

test('controls expose pressed, disabled, loading, and error states', async ({ page }) => {
  await page.goto('/?preview=desktop');
  const focusScene = page.getByRole('button', { name: /Focus/ });
  await expect(focusScene).toHaveAttribute('aria-pressed', 'true');
  await focusScene.click();
  await expect(focusScene).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByRole('button', { name: /Projector/ })).toBeDisabled();

  const sync = page.getByRole('button', { name: 'Sync profile' });
  await sync.click();
  await expect(sync).toBeDisabled();
  await expect(page.getByText('Material profile synchronized.')).toBeVisible();
  await expect(sync).toBeEnabled();

  await page.getByRole('button', { name: 'Dismiss sensor alert' }).click();
  await expect(page.locator('[data-error-panel]')).toBeHidden();
});

test('iPhone 15 layout fits its CSS viewport without horizontal overflow', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto('/?preview=mobile');
  await expect(page.locator('[data-preview-shell]')).toHaveAttribute('data-preview', 'mobile');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  await context.close();
});

test('iPhone 15 alert does not cover scene controls', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto('/?preview=mobile');

  const lastScene = await page.locator('.scene-card').last().boundingBox();
  const alert = await page.locator('[data-error-panel]').boundingBox();

  expect(lastScene).not.toBeNull();
  expect(alert).not.toBeNull();
  expect(alert.y).toBeGreaterThanOrEqual(lastScene.y + lastScene.height);
  await context.close();
});
