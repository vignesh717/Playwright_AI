import { APIRequestContext } from '@playwright/test';

export interface CreateOrderResponse {
    orders: string[];
    productOrderId: string[];
    message: string;
}

export class OrderService {
    private requestContext: APIRequestContext;
    private token: string;
    private baseURL: string = 'https://rahulshettyacademy.com';

    constructor(requestContext: APIRequestContext, token: string) {
        this.requestContext = requestContext;
        this.token = token;
    }

    async createOrder(productId: string, country: string = 'India'): Promise<CreateOrderResponse> {
        const response = await this.requestContext.post(`${this.baseURL}/api/ecom/order/create-order`, {
            data: {
                orders: [
                    {
                        country: country,
                        productOrderedId: productId
                    }
                ]
            },
            headers: {
                'authorization': this.token,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok()) {
            throw new Error(`Failed to create order: ${response.status()} ${await response.text()}`);
        }

        return await response.json();
    }

    async getOrderDetails(orderId: string): Promise<any> {
        const response = await this.requestContext.get(`${this.baseURL}/api/ecom/order/get-orders-details`, {
            params: { id: orderId },
            headers: {
                'authorization': this.token
            }
        });

        if (!response.ok()) {
            throw new Error(`Failed to fetch order details: ${response.status()} ${await response.text()}`);
        }

        return await response.json();
    }
}
