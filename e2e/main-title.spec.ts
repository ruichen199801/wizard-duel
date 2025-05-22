import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('Main Title', () => {
  test('should load main title page', async ({ page }) => {
    await expect(page.getByText('Wizard Duel')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Play' })).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Instructions' })
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cards' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'About' })).toBeVisible();
  });

  test('should navigate to /game on Play button click', async ({ page }) => {
    await page.getByRole('button', { name: 'Play' }).click();
    await expect(page).toHaveURL('/game');
  });
});
