import { test, expect } from '@playwright/test';
import { PageManager } from '../pages/PageManager';

test.describe('E2E Product Purchase Flow', { tag: ['@ui', '@regression'] }, () => {
    const targetProduct = 'ADIDAS ORIGINAL';
    const country = 'India';

    test('Should purchase ADIDAS ORIGINAL and complete order confirmation', {
        tag: ['@ui', '@e2e', '@critical', '@severity:critical']
    }, async ({ page }) => {
        test.setTimeout(90000);
        const pageManager = new PageManager(page);

        // 1. Navigate to application and Login
        await pageManager.loginPage.navigate();
        await pageManager.loginPage.login('Test@RSA.com', 'Test@RSA123');

        // 2. Locate product on Dashboard and add to cart
        await pageManager.dashboardPage.addProductToCart(targetProduct);

        // 3. Navigate to Cart and verify product presence
        await pageManager.dashboardPage.navigateToCart();
        await pageManager.cartPage.verifyProductInCart(targetProduct);

        // 4. Proceed to Checkout
        await pageManager.cartPage.clickCheckout();

        // 5. Select Country and submit Order
        await pageManager.checkoutPage.selectCountry(country);
        await pageManager.checkoutPage.placeOrder();

        // 6. Verify Confirmation message and extract Order ID
        const orderId = await pageManager.confirmationPage.verifyOrderSuccess();
        expect(orderId.length).toBeGreaterThan(0);
        console.log(`Order placed successfully! Product: ${targetProduct}, Order ID: ${orderId}`);
    });
});
