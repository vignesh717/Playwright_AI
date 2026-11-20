import { Page } from '@playwright/test';
import { LoginPage } from './LoginPage';
import { DashboardPage } from './DashboardPage';
import { CartPage } from './CartPage';
import { CheckoutPage } from './CheckoutPage';
import { ConfirmationPage } from './ConfirmationPage';
import { HomePage } from './HomePage';

export class PageManager {
    readonly page: Page;
    readonly loginPage: LoginPage;
    readonly dashboardPage: DashboardPage;
    readonly cartPage: CartPage;
    readonly checkoutPage: CheckoutPage;
    readonly confirmationPage: ConfirmationPage;
    readonly homePage: HomePage; // Preserved for backwards compatibility

    constructor(page: Page) {
        this.page = page;
        this.loginPage = new LoginPage(page);
        this.dashboardPage = new DashboardPage(page);
        this.cartPage = new CartPage(page);
        this.checkoutPage = new CheckoutPage(page);
        this.confirmationPage = new ConfirmationPage(page);
        this.homePage = new HomePage(page);
    }
}
