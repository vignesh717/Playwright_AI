import { Page, Locator, expect } from '@playwright/test';

export class ConfirmationPage {
    readonly page: Page;
    readonly confirmationHeader: Locator;
    readonly orderIdLabel: Locator;
    readonly downloadCsvButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.confirmationHeader = page.locator('.hero-primary');
        this.orderIdLabel = page.locator('label.ng-star-inserted');
        this.downloadCsvButton = page.getByRole('button', { name: 'Click To Download Order Details in CSV' });
    }

    async verifyOrderSuccess(): Promise<string> {
        await expect(this.confirmationHeader).toBeVisible();
        await expect(this.confirmationHeader).toHaveText(/Thankyou for the order\./i);
        
        const rawOrderId = await this.orderIdLabel.textContent();
        const orderId = rawOrderId ? rawOrderId.replace(/\|/g, '').trim() : '';
        return orderId;
    }
}
