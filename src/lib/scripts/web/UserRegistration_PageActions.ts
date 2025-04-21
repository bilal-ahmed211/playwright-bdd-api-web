import { Page, Locator, expect } from "@playwright/test";
import { ICustomWorld } from "../../interface/cucumber";
import { PageActionsHelper } from "./PageActionsHelper";
import { WebElements } from "./PageElements";
import { env } from "../../../../env";
import { getTestCaseData } from "../../utils/GetTestCaseData";
import { faker } from '@faker-js/faker';
import { LocalStore } from "../../utils/LocalStore";

export class RegisterPageActions {
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

    public async navigateToRegistrationForm(): Promise<void> {
        await this.page.goto(env.playwright.baseUrl);
        await this.page.waitForLoadState('load');
        const linkText = this.elements.RegisterPage.RegisterLinkTxt
        await this.web.clickByLocator({ pageName: linkText, locatorKey: linkText });
    };

    public async fillRegistrationForm(fields: {
        firstName?: string;
        lastName?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
    }): Promise<void> {
        const { firstName, lastName, email, password, confirmPassword } = fields;

        if (firstName) {
            await this.web.fillByLocator({ locatorKey: this.elements.RegisterPage.FirstNameTxt, valueKey: firstName });
        }
        if (lastName) {
            await this.web.fillByLocator({ locatorKey: this.elements.RegisterPage.LastNameTxt, valueKey: lastName });
        }
        if (email) {
            await this.web.fillByLocator({ locatorKey: this.elements.RegisterPage.RegEmailTxt, valueKey: email });
        }
        if (password) {
            await this.web.fillByLocator({ locatorKey: this.elements.RegisterPage.RegPassword, valueKey: password });
        }
        if (confirmPassword) {
            await this.web.fillByLocator({ locatorKey: this.elements.RegisterPage.RegConfirmPassword, valueKey: confirmPassword });
        }
    }

    public async fillRegistrationFormFromStaticExcel(): Promise<void> {
        const randomNumber = Math.floor(Math.random() * 10000);
        const email = getTestCaseData('Email').replace('@', `${randomNumber}@`);
        const localStore = LocalStore.getInstance();
        localStore.setValue('registeredEmail', email);
        await this.fillRegistrationForm({
            firstName: getTestCaseData('FirstName'),
            lastName: getTestCaseData('LastName'),
            email,
            password: getTestCaseData('Password'),
            confirmPassword: getTestCaseData('ConfirmPassword'),
        });
        console.log(`Static Data - Test submitted with: Name = ${getTestCaseData('FirstName')} ${getTestCaseData('LastName')}, Email = ${email}`);
    }

    public async fillRegistrationFormFromFakerjsModules(): Promise<void> {
        const fakeFirstName = faker.person.firstName();
        const fakeLastName = faker.person.lastName();
        const fakeEmail = faker.internet.email();
        const fakePassword = faker.internet.password();
        await this.fillRegistrationForm({
            firstName: fakeFirstName,
            lastName: fakeLastName,
            email: fakeEmail,
            password: fakePassword,
            confirmPassword: fakePassword,
        });
        console.log(`Fakerjs Data - Test submitted with: Name = ${fakeFirstName} ${fakeLastName}, Email = ${fakeEmail}`);
    }

    public async fillRegistrationFormWithPasswordLessThanMinLength(): Promise<void> {
        const shortPassword = faker.string.alphanumeric(4);
        await this.fillRegistrationForm({ password: shortPassword });
        await this.web.waitForTimeout(2000);
    }

    public async fillRegistrationFormWithDifferentPasswordAndConfirmPassword(): Promise<void> {
        const fakePassword = faker.internet.password();
        const differentConfirmPassword = faker.internet.password();
        await this.fillRegistrationForm({ password: fakePassword, confirmPassword: differentConfirmPassword });
    }

    public async fillRegistrationFormWithBlankValueForRequiredFields(): Promise<void> {
        const fakeLastName = faker.person.lastName();
        const fakeEmail = faker.internet.email();
        const fakePassword = faker.internet.password();
        await this.fillRegistrationForm({
            lastName: fakeLastName,
            email: fakeEmail,
            password: fakePassword,
            confirmPassword: fakePassword,
        });
    }

    public async fillEmailTextboxWithAlreadyExistingEmailAddress(): Promise<void> {
        const fakeFirstName = faker.person.firstName();
        const fakeLastName = faker.person.lastName();
        const existingEmail = 'imran1@yahoo.com';
        const fakePassword = faker.internet.password();
        await this.fillRegistrationForm({
            firstName: fakeFirstName,
            lastName: fakeLastName,
            email: existingEmail,
            password: fakePassword,
            confirmPassword: fakePassword,
        });
    }

    public async fillEmailTextboxWithInvalidEmailFormat(): Promise<void> {
        const invalidEmail = 'invalid-email-format';
        await this.fillRegistrationForm({ email: invalidEmail });
        await this.web.waitForTimeout(2000);
    }

    public async clickCreateAccountBtnToSubmitRegisterForm(): Promise<void> {
        await this.web.clickByLocator({ locatorKey: this.elements.RegisterPage.CreateAccountBtn });
        await this.web.waitForTimeout(3000);
    };

    public async verifyContentOfMessagesDisplayed(actualMessageLocator: any, expectedMessage: string): Promise<void> {
        await this.web.assertElementVisible({ locatorKey: expectedMessage });
        const actualMessage = await this.page.locator(actualMessageLocator).textContent() || await this.page.evaluate(() => window.alert && window.alert.arguments[0]);
        console.log('Actual Message is:', actualMessage);
        await this.web.assertToContainText({ locatorKey: actualMessage, expectedValue: expectedMessage });
    };

}