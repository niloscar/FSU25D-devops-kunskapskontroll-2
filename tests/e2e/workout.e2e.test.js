import { test, expect } from '@playwright/test';

test('workout page renders correctly', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('#workout-container')).toBeVisible();
    await expect(page.locator('h1')).toHaveText('Full Body Strength');
    await expect(page.locator('#exercises-btn')).toBeVisible();
});