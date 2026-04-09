import { test, expect } from '@playwright/test';

test('profile page loads and displays user', async ({ page }) => {

    await page.goto('http://localhost:5500/src/profile/profile.html');

    await expect(page.locator('#username')).not.toBeEmpty();
});