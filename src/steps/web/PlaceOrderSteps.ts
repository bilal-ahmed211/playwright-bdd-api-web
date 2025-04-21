import { ICustomWorld } from '../../lib/interface/cucumber';
import { expect } from '@playwright/test';
import { Given, When, Then } from '@cucumber/cucumber';
import { PlaceOrderPageActions } from '../../lib/scripts/web/PlaceOrder_PageActions';

const products: { name: string, price: string }[] = [];

When('user clicks on Shop New Yoga',
    async function (this: ICustomWorld): Promise<void> {
        const step = new PlaceOrderPageActions(this);
        await step.navigateToYogaCollection();
    });

When('user selects product number {int}',
    async function (this: ICustomWorld, index: number): Promise<void> {
        const step = new PlaceOrderPageActions(this);
        const product = await step.selectProductByIndex(index - 1); // converting to 0-based index
        products.push(product);
    });

When('user selects first available size and color',
    async function (this: ICustomWorld): Promise<void> {
        const step = new PlaceOrderPageActions(this);
        await step.selectFirstAvailableOptions();
    });

When('user adds the product to cart',
    async function (this: ICustomWorld): Promise<void> {
        const step = new PlaceOrderPageActions(this);
        await step.addProductToCart(products[products.length - 1].name);
    });

When('user adds the first product to wishlist',
    async function (this: ICustomWorld): Promise<void> {
        const step = new PlaceOrderPageActions(this);
        await step.addProductToWishList();
    });

When('user proceeds to checkout from wishlist',
    async function (this: ICustomWorld): Promise<void> {
        const step = new PlaceOrderPageActions(this);
        await step.proceedToCheckoutFromWishlist();
    });

When('user go to the cart page',
    async function (this: ICustomWorld): Promise<void> {
        const step = new PlaceOrderPageActions(this);
        await step.goToCartPage();
    });

When('user verifies cart items and pricing',
    async function (this: ICustomWorld): Promise<void> {
        const step = new PlaceOrderPageActions(this);
        const products = [
            { name: "Echo Fit Compression Short", price: "$24.00" },
            { name: "Hera Pullover Hoodie", price: "$48.00" }
        ];
        await step.validateCartItems(products);
    });

When('user proceeds to checkout',
    async function (this: ICustomWorld): Promise<void> {
        const step = new PlaceOrderPageActions(this);
        await step.proceedToCheckout();
    });

When('user fills shipping details',
    async function (this: ICustomWorld): Promise<void> {
        const step = new PlaceOrderPageActions(this);
        await step.fillShippingDetails();
    });

When('user proceed to payment page',
    async function (this: ICustomWorld): Promise<void> {
        const step = new PlaceOrderPageActions(this);
        await step.placeOrder();
    });

Then('verify order is placed successfully',
    async function (this: ICustomWorld): Promise<void> {
        const step = new PlaceOrderPageActions(this);
        await step.verifyOrderConfirmation();
    });

Then('Verify product is removed from wishlist',
    async function (this: ICustomWorld): Promise<void> {
        const step = new PlaceOrderPageActions(this);
        await step.verifyProductRemovedFromWishlist();
    }); 
