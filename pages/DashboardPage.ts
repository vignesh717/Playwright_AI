import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
    readonly page: Page;
    readonly productCards: Locator;
    readonly cartButton: Locator;
    readonly toastMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productCards = page.locator('div.card-body');
        this.cartButton = page.locator('button[routerlink="/dashboard/cart"]');
        this.toastMessage = page.getByText('Product Added To Cart');
    }

    async addProductToCart(productName: string): Promise<void> {
        await this.productCards.first().waitFor({ state: 'visible' });
        const productCard = this.productCards.filter({ hasText: productName });
        await expect(productCard).toBeVisible();
        
        const addToCartButton = productCard.getByRole('button', { name: 'Add To Cart' });
        await addToCartButton.click();

        // Wait for toast notification and let it clear to avoid overlay click interception
        await expect(this.toastMessage).toBeVisible();
        await this.page.locator('.ngx-spinner-overlay').waitFor({ state: 'detached' }).catch(() => {});
        await this.toastMessage.waitFor({ state: 'hidden', timeout: 7000 }).catch(() => {});
    }

    async navigateToCart(): Promise<void> {
        await this.cartButton.waitFor({ state: 'visible' });
        await this.cartButton.click();
        await this.page.waitForURL(/.*cart.*/);
    }
}
