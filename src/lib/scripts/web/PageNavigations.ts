import { Page, Locator, expect } from "@playwright/test";
import { ICustomWorld } from "../../interface/cucumber";
import { PageActionsHelper } from "./PageActionsHelper";
import { WebElements } from "./PageElements";
import { env } from "../../../../env";

export class PageNavigations {
    public page: Page;
    public dataSource: any;
    public elements: any;
    public web: PageActionsHelper;

    public constructor(self: ICustomWorld) {
        const { page } = self;
        this.page = self.page;
        this.elements = WebElements;
        this.web = new PageActionsHelper(self);
    }

    public async navigateToHomePage(): Promise<void> {
        await this.page.goto(env.playwright.baseUrl);
        await this.page.waitForTimeout(2000);
        await expect(this.page.getByText('Home Page')).toBeVisible();
        const title = await this.page.title();
        console.log(`Page title is: ${title}`);
        await expect(this.page).toHaveTitle(/Home/);
    };

    public async navigateToLoginPage(): Promise<void> {
        await this.page.locator("div[class='panel header'] li[data-label='or'] a").waitFor({state: 'visible'});
        await this.page.locator("div[class='panel header'] li[data-label='or'] a").click();
        await this.page.waitForTimeout(2000);
        // await expect(this.page.getByText('Customer Login')).toBeVisible();
    };

    public async navigateToRegistrationForm(): Promise<void> {
        const registerLink = this.elements.HomePage.CreateNewAccountLocator
        await this.web.clickByLocator({pageName: registerLink, locatorKey: registerLink });
    };

}