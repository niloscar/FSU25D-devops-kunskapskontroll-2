import { test, expect } from '@playwright/test';

test('profile page loads and displays user', async ({ page }) => {

    await page.goto('http://localhost:4173/profile.html');

    // vänta på att elementet finns
    await page.waitForSelector('#username');

    // vänta tills det faktiskt fått innehåll
    await expect(page.locator('#username')).not.toHaveText('');
});