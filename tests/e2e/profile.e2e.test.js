import { test, expect } from '@playwright/test';

test('profile page loads and displays user', async ({ page }) => {

    //Kör på playwrights egna testserver
    await page.goto('http://localhost:4173/profile.html');

    await expect(page.locator('#username')).not.toBeEmpty();
});