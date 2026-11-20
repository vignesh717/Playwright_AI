import { test, expect } from '@playwright/test';
import { AuthService, LoginResponse } from '../api/AuthService';
import { ProductService, Product } from '../api/ProductService';
import { OrderService, CreateOrderResponse } from '../api/OrderService';
import * as fs from 'fs';

test.describe('API Test Automation with Session Persistence', { tag: ['@api', '@regression'] }, () => {
    test.describe.configure({ mode: 'serial' });
    let authService: AuthService;
    let loginData: LoginResponse;

    test('1. Authenticate via API and save session storage to file', {
        tag: ['@api', '@auth', '@smoke', '@blocker', '@severity:blocker']
    }, async ({ request }) => {
        authService = new AuthService(request);
        
        // 1. Perform login
        loginData = await authService.login('Test@RSA.com', 'Test@RSA123');
        expect(loginData.token).toBeTruthy();
        expect(loginData.userId).toBeTruthy();
        expect(loginData.message).toBe('Login Successfully');

        // 2. Persist session token and Playwright storageState
        const { tokenPath, statePath } = await authService.saveSessionState(loginData);
        expect(fs.existsSync(tokenPath)).toBe(true);
        expect(fs.existsSync(statePath)).toBe(true);

        console.log(`Saved API session token to: ${tokenPath}`);
        console.log(`Saved browser storage state to: ${statePath}`);
    });

    test('2. Reuse saved session to fetch products, place order and verify details', {
        tag: ['@api', '@orders', '@critical', '@severity:critical']
    }, async ({ request }) => {
        // 1. Load session from persisted file
        const savedSession = AuthService.loadSessionToken();
        expect(savedSession.token).toBeTruthy();

        // 2. Fetch product catalog using saved token
        const productService = new ProductService(request, savedSession.token);
        const products = await productService.getAllProducts();
        expect(products.length).toBeGreaterThan(0);

        const targetProduct = await productService.getProductByName('ADIDAS ORIGINAL');
        expect(targetProduct).toBeDefined();
        console.log(`Found target product: ${targetProduct?.productName} (ID: ${targetProduct?._id})`);

        // 3. Place order via OrderService
        const orderService = new OrderService(request, savedSession.token);
        const orderResponse: CreateOrderResponse = await orderService.createOrder(targetProduct!._id, 'India');
        expect(orderResponse.message).toBe('Order Placed Successfully');
        expect(orderResponse.orders.length).toBeGreaterThan(0);

        const orderId = orderResponse.orders[0];
        console.log(`API Order created successfully. Order ID: ${orderId}`);

        // 4. Fetch and verify order details
        const orderDetails = await orderService.getOrderDetails(orderId);
        expect(orderDetails.message).toBe('Orders fetched for customer Successfully');
        expect(orderDetails.data._id).toBe(orderId);
        expect(orderDetails.data.productOrderedId).toBe(targetProduct!._id);
        console.log(`Order details validated for Order ID: ${orderId}`);
    });
});
