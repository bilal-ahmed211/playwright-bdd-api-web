import { Page, Locator, expect } from "@playwright/test";
import { ICustomWorld } from "../../interface/cucumber";
import { PageActionsHelper } from "./PageActionsHelper";
import { WebElements } from "./PageElements";
import { env } from "../../../../env";
import { getTestCaseData } from "../../utils/GetTestCaseData";
import { faker } from '@faker-js/faker';

export class LoginPageActions {
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

    public async verifyUserIsOnLoginPage(): Promise<void> {
        try {
            const { LoginFormHeadingText, EmailTextbox } = WebElements.LoginPage;
            if (!LoginFormHeadingText || !EmailTextbox) {
                throw new Error('One or more locators for the login page are undefined.');
            }
            await this.web.assertElementVisible({ locatorKey: LoginFormHeadingText, role: '' });
            await this.web.assertElementVisible({ locatorKey: EmailTextbox });
        } catch (error) {
            console.error('Error verifying user is on login page:', error);
            throw error;
        }
    }

    public async fillEmailAndPassword(email: string, password: string): Promise<void> {
        const { EmailTxtLocator, PasswordLocator } = WebElements.LoginPage;
        await this.web.fillByLocator({ locatorKey: EmailTxtLocator, valueKey: email })
        await this.web.fillByLocator({ locatorKey: PasswordLocator, valueKey: password });
    }


    public async clickSignInBtn(): Promise<void> {
        try {
            const signInButton = WebElements.LoginPage.SigninBtnLocator;
            if (!signInButton) {
                throw new Error('Sign-in button locator is undefined.');
            }
            await this.web.clickByLocator({ locatorKey: signInButton });
        } catch (error) {
            console.error('Error clicking sign-in button:', error);
            throw error;
        }
    };


    public async verifyErrorMessagesForCredentials(expectedMessages: { emailError?: string; passError?: string }): Promise<void> {
        try {
            const emailErrorLocator = this.elements.LoginPage.EmailErrorMessageLocator;
            const passErrorLocator = this.elements.LoginPage.PasswordErrorMessageLocator;

            if (!emailErrorLocator || !passErrorLocator) {
                throw new Error('Error locators are undefined.');
            }

            // Validate email error message
            const emailErrorElement = await this.page.locator(emailErrorLocator);
            await expect(emailErrorElement).toBeVisible();
            const emailErrorText = await emailErrorElement.textContent();
            expect(emailErrorText?.trim()).toBe(expectedMessages.emailError);

            // Validate password error message
            const passErrorElement = await this.page.locator(passErrorLocator);
            await expect(passErrorElement).toBeVisible();
            const passErrorText = await passErrorElement.textContent();
            expect(passErrorText?.trim()).toBe(expectedMessages.passError);
        } catch (error) {
            console.error('Error verifying error messages for credentials:', error);
            throw error;
        }
    };

    public async verifyLoginSuccess(): Promise<void> {
            const { LoginFormHeadingText, PasswordLocator, WelcomeMessageOnHeaderLocator } = WebElements.LoginPage;
            await this.web.waitForTimeout(3000);              
            await expect(this.page.getByText(LoginFormHeadingText)).not.toBeVisible({ timeout: 7000 });
            await expect(this.page.locator(PasswordLocator)).not.toBeVisible({ timeout: 7000 });
            await this.page.locator(WelcomeMessageOnHeaderLocator).waitFor({ state: 'visible', timeout: 7000 });
            await expect(this.page.getByText('Welcome,')).toBeVisible
            // const actualWelcomeMsg = await this.page.locator(WelcomeMessageOnHeaderLocator).textContent() || await this.page.evaluate(() => window.alert && window.alert.arguments[0]);
            // const email = process.env.VALID_LOGIN_EMAIL;
            // const extractedName = email.split('@')[0];
            // const expectedWelcomeMsg = `Welcome, ${extractedName}!`;
            // expect(actualWelcomeMsg).toContain(expectedWelcomeMsg);
    }
};
