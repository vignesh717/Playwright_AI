import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

const statePath = path.resolve('auth/state.json');

test.describe('Hybrid Session UI Test (Bypass Login)', { tag: ['@ui', '@hybrid'] }, () => {
    // Configure test to use the persisted storageState file
    test.use({
        storageState: fs.existsSync(statePath) ? statePath : undefined
    });

    test('Should bypass login page and open Dashboard directly with saved session', {
        tag: ['@ui', '@smoke', '@normal', '@severity:normal']
    }, async ({ page }) => {
        // Navigate directly to Dashboard without entering credentials
        await page.goto('https://rahulshettyacademy.com/client/#/dashboard/dash');

        // Verify user is authenticated and products are loaded directly
        const productCard = page.locator('div.card-body').filter({ hasText: 'ADIDAS ORIGINAL' });
        await expect(productCard).toBeVisible({ timeout: 15000 });

        // Verify cart button is accessible
        const cartButton = page.locator('button[routerlink="/dashboard/cart"]');
        await expect(cartButton).toBeVisible();

        console.log('Successfully navigated to Dashboard directly using saved session state!');
    });
});
