import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    readonly cartItems: Locator;
    readonly allCartItemsInfos: Locator;
    readonly checkoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartItems = page.locator('div.cartSection h3');
        this.allCartItemsInfos = page.locator('div.infoWrap');
        this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    }

    async verifyProductInCart(productName: string): Promise<void> {
        const product = this.page.locator('div.cartSection').filter({ hasText: productName });
        await expect(product).toBeVisible();
    }

    async clickCheckout(): Promise<void> {
        await this.checkoutButton.waitFor({ state: 'visible' });
        await this.checkoutButton.click();
        await this.page.waitForURL('**/dashboard/order**');
    }
}
