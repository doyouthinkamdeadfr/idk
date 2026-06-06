import { test, expect } from '@playwright/test';

test('homepage renders', async ({ page }) => {
	const response = await page.goto('/');
	expect(response?.ok()).toBe(true);
	await expect(page.locator('h1')).toBeVisible();
});
