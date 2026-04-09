import { test, expect } from '@playwright/test';

test('frontpage renders correctly', async ({ page }) => {
    await page.goto('/');
    const appContainer = page.locator('#app');
    const suggestion = page.locator('#suggestion');
    const suggestionBasis = page.locator('#suggestion-basis');
    const title = page.locator('h1');
    const welcomeMessage = page.locator('#welcome-message');
    const suggestionTitle = page.locator('.suggestion-title');

    await expect(appContainer).toBeVisible({ timeout: 1500 });
    await expect(suggestion).toBeVisible({ timeout: 1500 });
    await expect(suggestionBasis).toBeVisible({ timeout: 1500 });
    await expect(suggestionTitle).toBeVisible({ timeout: 1500 });

    await expect(title).toHaveText('The Workout App', { timeout: 1500 });
    await expect(welcomeMessage).toContainText('Hi', { timeout: 1500 });
    await expect(suggestionTitle).not.toHaveText('', { timeout: 1500 });
});
