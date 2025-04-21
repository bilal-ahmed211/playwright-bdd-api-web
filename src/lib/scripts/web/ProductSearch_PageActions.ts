import { Page, expect} from "@playwright/test";
import { ICustomWorld } from "../../interface/cucumber";
import { PageActionsHelper } from "./PageActionsHelper";
import { WebElements } from "./PageElements";
import { getTestCaseData } from "../../utils/GetTestCaseData";


export class ProductSearchPageActions {
    public page: Page;
    public dataSource: any;
    public elements: any;
    public web: PageActionsHelper;

    public constructor(self: ICustomWorld) {
        const { page } = self;
        this.page = self.page;
        this.elements = WebElements;
        this.web = new PageActionsHelper(self);
    };

    public async searchForProduct(productName: any): Promise<void> {
        await this.page.getByPlaceholder('Search entire store here...').waitFor({ state: 'visible' });
        const searchBox = await this.page.getByPlaceholder('Search entire store here...')
        await searchBox.fill(productName);
        await searchBox.press('Enter');
        await this.web.waitForTimeout(3000);
    }

    public async validateSearchResults(productName: string): Promise<void> {
        await this.page.getByText(`Search results for: '${productName}'`).first().waitFor({ state: 'visible' });
        const results = await this.page.locator('.product-item').count();
        expect(results).toBeGreaterThan(0);
    }

    public async validateNoResultsFoundMessage(): Promise<void> {
        await this.page.getByText('Search results for:').first().waitFor({ state: 'visible' });
        await expect(await this.page.getByText('Your search returned no results.')).toBeVisible();
    }
};

