import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should load the sign-in page correctly', async ({ page }) => {
    // Navigate to the sign in page directly or wait for redirect
    await page.goto('/sign-in');

    // Clerk injects sign-in form. Wait for some identifiable text or structure
    // We custom-built it in previous step with text like "SYSTEM: ONLINE"
    const statusText = page.locator('text=SYSTEM: ONLINE');
    await expect(statusText).toBeVisible();

    // Check for the input field or button
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();
  });
});
