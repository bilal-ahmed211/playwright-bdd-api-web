import { Page, expect } from "@playwright/test";
import { ICustomWorld } from "../../interface/cucumber";
import { PageActionsHelper } from "./PageActionsHelper";
import { WebElements } from "./PageElements";

export class PlaceOrderPageActions {
    public page: Page;
    public web: PageActionsHelper;

    public constructor(self: ICustomWorld) {
        this.page = self.page;
        this.web = new PageActionsHelper(self);
    };

    public async navigateToYogaCollection(): Promise<void> {
        await this.page.locator('text=Shop New Yoga').click();
        await expect(this.page).toHaveURL(/\/collections\/yoga-new\.html/);
    }

    public async selectProductByIndex(index: number): Promise<{name: string, price: string}> {
        const product = this.page.locator('.product-item-link').nth(index);
        const price = this.page.locator('.price-wrapper .price').nth(index);
        const productName = await product.textContent() || '';
        const productPrice = await price.textContent() || '';
        await product.click();
        await this.page.waitForTimeout(3000);
        return {name: productName, price: productPrice};
    }

    public async selectFirstAvailableOptions(): Promise<void> {
        await this.page.locator("//div[contains(@id, 'option-label-size-')]").first().waitFor({ state: 'visible', timeout: 3000 });
        await this.page.locator("//div[contains(@id, 'option-label-size-')]").first().click(); // Size
        await this.page.locator('.swatch-option.color').first().waitFor({ state: 'visible', timeout: 3000 }); 
        await this.page.locator('.swatch-option.color').first().click(); // Color
    }

    public async addProductToCart(productName: string): Promise<void> {
        await this.page.locator('button:has-text("Add to Cart")').click();
        await this.page.waitForTimeout(2000); // Wait for the cart to update
    };

    public async goToCartPage(): Promise<void> {
        await this.page.locator('.showcart').click(); 
        await this.page.locator('a:has-text("View and Edit Cart")').click(); 
        await expect(this.page.locator('h1:has-text("Shopping Cart")')).toBeVisible();
        await this.page.waitForTimeout(4000); // Wait for the cart page to load
    }

    public async validateCartItems(
        products: {name: string, price: string}[]
    ): Promise<void> {
        // Wait for cart to load
        await this.page.locator('.cart.item').first().waitFor({ state: 'visible', timeout: 15000 });
    
        // Get all cart items
        const cartItems = await this.page.locator('.cart.item').all();
        let calculatedSubtotal = 0;
        let matchedProducts = 0;
    
        // For each expected product
        for (const product of products) {
            const normalizedProductName = product.name.trim().replace(/\s+/g, ' ').toLowerCase();
            const expectedPrice = parseFloat(product.price.replace(/[^\d.]/g, ''));
    
            let productFound = false;
    
            // Search through all cart items (order doesn't matter)
            for (const item of cartItems) {
                const itemName = await item.locator('.product-item-name').textContent();
                const normalizedItemName = itemName?.trim().replace(/\s+/g, ' ').toLowerCase() || '';
    
                if (normalizedItemName.includes(normalizedProductName)) {
                    // Get the most specific price element within this item
                    const itemPriceText = await item.locator('.price-wrapper .price, .price').first().textContent();
                    const actualPrice = parseFloat(itemPriceText?.replace(/[^\d.]/g, '') || '0');
    
                    if (Math.abs(actualPrice - expectedPrice) < 0.01) {
                        calculatedSubtotal += actualPrice;
                        matchedProducts++;
                        productFound = true;
                        break;
                    }
                }
            }
    
            if (!productFound) {
                throw new Error(`Product "${product.name}" with price $${product.price} not found in cart`);
            }
        }
    
        // Verify all products were matched
        if (matchedProducts !== products.length) {
            throw new Error(`Expected ${products.length} products but found ${matchedProducts} matches`);
        }
    
        // Handle multiple subtotal elements by finding the one in the minicart
        const subtotalElement = this.page.locator('#minicart-content-wrapper .subtotal .price').first();
        const subtotalText = await subtotalElement.textContent();
        const subtotal = parseFloat(subtotalText?.replace(/[^\d.]/g, '') || '0');
        
        if (Math.abs(subtotal - calculatedSubtotal) >= 0.01) {
            throw new Error(`Subtotal mismatch. Expected: $${calculatedSubtotal.toFixed(2)}, Actual: $${subtotal.toFixed(2)}`);
        }
    
        // Handle multiple total elements by finding the one in the minicart
        const totalElement = this.page.locator('.cart-summary').first();
        const totalText = await totalElement.textContent();
        const total = parseFloat(totalText?.replace(/[^\d.]/g, '') || '0');
        
        if (Math.abs(total - calculatedSubtotal) >= 0.01) {
            throw new Error(`Total mismatch. Expected: $${calculatedSubtotal.toFixed(2)}, Actual: $${total.toFixed(2)}`);
        }
    }

    public async proceedToCheckout(): Promise<void> {
        await this.page.locator("button[title='Proceed to Checkout'] span").click();
        await this.page.waitForTimeout(2000); // Wait for the checkout page to load
    }

    public async fillShippingDetails(): Promise<void> {
        await this.page.locator('input[name="firstname"]').fill('Test');
        await this.page.locator('input[name="lastname"]').fill('User');
        await this.page.locator('input[name="street[0]"]').fill('123 Test St');
        await this.page.locator('input[name="city"]').fill('New York');
        await this.page.selectOption('select[name="region_id"]', { label: 'New York' });
        await this.page.locator('input[name="postcode"]').fill('10001');
        await this.page.locator('input[name="telephone"]').fill('1234567890');
        await this.page.locator('input[name="ko_unique_1"]').check();
        await this.page.locator('button:has-text("Next")').click();
        await this.page.waitForTimeout(3000); // Wait for the payment page to load
        
    }

    public async placeOrder(): Promise<void> {
        await expect(this.page.getByText('Payment Method', { exact: true })).toBeVisible();
        await this.page.getByRole('button', { name: 'Place Order' }).click();
        await this.page.waitForTimeout(3000); // Wait for the order confirmation page to load
    }

    public async verifyOrderConfirmation(): Promise<void> {
        await expect(this.page.getByText('Thank you for your purchase!')).toBeVisible();
        const orderNumber = await this.page.locator('.order-number').textContent();
        console.log(`Order Number: ${orderNumber}`);
        await expect(this.page.getByText(`Your order number is: ${orderNumber}`)).toBeVisible();
    }

    public async addProductToWishList(): Promise<void> {
        await this.page.waitForTimeout(2000); 
        await this.page.getByRole('link', { name: ' Add to Wish List' }).click();
        await expect(this.page.locator('.message-success')).toContainText('has been added to your Wish List');
    }

    public async proceedToCheckoutFromWishlist(): Promise<void> {
        await this.page.waitForTimeout(4000); 
        await this.page.locator('.action.primary.tocart').last().click(); 
        await this.page.waitForTimeout(2000); 
    }

    public async verifyProductRemovedFromWishlist(): Promise<void> {
        await this.page.locator('.message-success').waitFor({ state: 'visible', timeout: 5000 });
        const emptyWishlistMessage = this.page.locator("div[class='message info empty'] span");
        await expect(emptyWishlistMessage).toBeVisible({ timeout: 5000 });
    }
}