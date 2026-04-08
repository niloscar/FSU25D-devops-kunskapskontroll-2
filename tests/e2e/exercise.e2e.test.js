import { test, expect } from '@playwright/test';

test('exercise page renders correctly', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('#exercise-container')).toBeVisible();
    await expect(page.locator('h1')).toHaveText('Övningar');
});