import { test, expect } from '@playwright/test';

test('exercise page renders correctly', async ({ page }) => {
    await page.goto('/exercise.html?id=1');
    
    await expect(page.locator('#exercise-container')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('h1')).toHaveText('Övningar', { timeout: 15000 });
});