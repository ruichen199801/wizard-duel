import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/game');
});

test.afterEach(async ({ page }) => {
  await page.evaluate(() => sessionStorage.clear());
});

test.describe('Game Board', () => {
  const levels = ['1', '2', '3', '4', '5', '6', '7', '8'];

  levels.forEach((level) => {
    test(`play a card and end turn at level ${level}`, async ({ page }) => {
      await page.evaluate((lvl) => {
        sessionStorage.setItem('level', lvl);
      }, level);

      await page.goto('/game');

      // MatchupModal pops up
      const continueButton = page.getByRole('button', { name: 'Continue' });
      await expect(continueButton).toBeVisible();
      await continueButton.click();

      // Click a card
      const firstCard = page.getByRole('img', { name: 'card front' }).nth(0);
      await expect(firstCard).toBeVisible();
      await firstCard.click();

      // Click end turn button
      const endTurnButton = page.getByRole('button', { name: 'End Turn' });
      await expect(endTurnButton).toBeVisible();
      await endTurnButton.click();

      // Expect end turn button disabled
      await expect(
        page.getByText(/^Enemy Turn$/, { exact: true })
      ).toBeVisible();
    });
  });

  test('reset entire run', async ({ page }) => {
    page.once('dialog', async (dialog) => {
      console.log(`Dialog message: ${dialog.message()}`);
      await dialog.accept();
    });

    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('img', { name: 'settings' }).click();
    await page.getByRole('button', { name: 'Reset Entire Run' }).click();

    // Expect page to refresh and MatchupModal to pop up again
    await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
  });

  test('exit to title', async ({ page }) => {
    page.once('dialog', async (dialog) => {
      console.log(`Dialog message: ${dialog.message()}`);
      await dialog.accept();
    });

    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('img', { name: 'settings' }).click();
    await page.getByRole('button', { name: 'Exit to Title' }).click();

    // Expect main title page to load
    await expect(page).toHaveURL('/');
  });
});
