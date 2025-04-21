import { ICustomWorld } from '../../lib/interface/cucumber';
import { Given, When, Then, } from '@cucumber/cucumber';
import { ProductSearchPageActions } from '../../lib/scripts/web/ProductSearch_PageActions';
import { WebElements } from '../../lib/scripts/web/PageElements';
import { getTestCaseData } from '../../lib/utils/GetTestCaseData';



When('user enter the product name in search box',
    async function (this: ICustomWorld): Promise<void> {
        const step = new ProductSearchPageActions(this);
        const productName = "invalidaProductName";
        await step.searchForProduct(productName);
    }
);

When('Verify the error message is displayed for no search results found',
    async function (this: ICustomWorld): Promise<void> {
        const step = new ProductSearchPageActions(this);
        await step.validateNoResultsFoundMessage()
    }
);

When('user searches for a valid product name {string}',
    async function (this: ICustomWorld, productName: string): Promise<void> {
        const step = new ProductSearchPageActions(this);
        await step.searchForProduct(productName);
    }
);

When('user searches for an empty string',
    async function (this: ICustomWorld): Promise<void> {
        const step = new ProductSearchPageActions(this);
        await step.searchForProduct('');
    }
);

When('user searches for a product name with special characters {string}',
    async function (this: ICustomWorld, specialCharacters: string): Promise<void> {
        const step = new ProductSearchPageActions(this);
        await step.searchForProduct(specialCharacters);
    }
);

When('user searches for a partial product name {string}',
    async function (this: ICustomWorld, partialName: string): Promise<void> {
        const step = new ProductSearchPageActions(this);
        await step.searchForProduct(partialName);
    }
);

When('user searches for a valid product name {string} in lowercase',
    async function (this: ICustomWorld, productName: string): Promise<void> {
        const step = new ProductSearchPageActions(this);
        await step.searchForProduct(productName.toLowerCase());
    }
);

Then('search results should display products related to {string}',
    async function (this: ICustomWorld, productName: string): Promise<void> {
        const step = new ProductSearchPageActions(this);
        await step.validateSearchResults(productName);
    }
);

