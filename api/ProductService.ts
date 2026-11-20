import { APIRequestContext } from '@playwright/test';

export interface Product {
    _id: string;
    productName: string;
    productCategory: string;
    productSubCategory: string;
    productPrice: number;
    productDescription: string;
    productImage: string;
    productRating: string;
    productTotalOrders: string;
    productStatus: boolean;
    productFor: string;
    productAddedBy: string;
}

export class ProductService {
    private requestContext: APIRequestContext;
    private token: string;
    private baseURL: string = 'https://rahulshettyacademy.com';

    constructor(requestContext: APIRequestContext, token: string) {
        this.requestContext = requestContext;
        this.token = token;
    }

    async getAllProducts(): Promise<Product[]> {
        const response = await this.requestContext.post(`${this.baseURL}/api/ecom/product/get-all-products`, {
            headers: {
                'authorization': this.token,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok()) {
            throw new Error(`Failed to fetch products: ${response.status()} ${await response.text()}`);
        }

        const json = await response.json();
        return json.data;
    }

    async getProductByName(productName: string): Promise<Product | undefined> {
        const products = await this.getAllProducts();
        return products.find(p => p.productName.trim().toLowerCase() === productName.trim().toLowerCase());
    }
}
