import { ICustomWorld } from '../../lib/interface/cucumber';
import { Given, When, Then, } from '@cucumber/cucumber';
import { RegisterPageActions } from '../../lib/scripts/web/UserRegistration_PageActions';
import { WebElements } from '../../lib/scripts/web/PageElements';
import { faker } from '@faker-js/faker';


Given('user fill regisration form details from static excel sheet',
    async function (this: ICustomWorld): Promise<void> {
        const step = new RegisterPageActions(this);
        await step.fillRegistrationFormFromStaticExcel();
    }
);

Given('user fill regisration form details from dynamic fakerjs Modules',
    async function (this: ICustomWorld): Promise<void> {
        const step = new RegisterPageActions(this);
        await step.fillRegistrationFormFromFakerjsModules();
    }
);

When('user submit registration form data by clicking create account button',
    async function (this: ICustomWorld): Promise<void> {
        const step = new RegisterPageActions(this);
        await step.clickCreateAccountBtnToSubmitRegisterForm();
    }
);

When('user enter password less than minimum length',
    async function (this: ICustomWorld): Promise<void> {
        const step = new RegisterPageActions(this);
        await step.fillRegistrationForm({ password: faker.string.alphanumeric(4) });
    }
);

When('user enter password and confirm password with different values',
    async function (this: ICustomWorld): Promise<void> {
        const step = new RegisterPageActions(this);
        await step.fillRegistrationForm({
            password: faker.internet.password(),
            confirmPassword: faker.internet.password(),
        });
    }
);

When('user leave mandatory fields blank',
    async function (this: ICustomWorld): Promise<void> {
        const step = new RegisterPageActions(this);
        await step.fillRegistrationForm({
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            confirmPassword: faker.internet.password(),
        });
    }
);

When('user fill regisration form details with duplicate email address',
    async function (this: ICustomWorld): Promise<void> {
        const step = new RegisterPageActions(this);
        await step.fillRegistrationForm({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: 'imran1@yahoo.com',
            password: faker.internet.password(),
            confirmPassword: faker.internet.password(),
        });
    }
);

When('user fill regisration form details with invalid email format',
    async function (this: ICustomWorld): Promise<void> {
        const step = new RegisterPageActions(this);
        await step.fillRegistrationForm({ email: 'invalid-email-format' });
    }
);

Then('Verify success message is displayed on my account page',
    async function (this: ICustomWorld): Promise<void> {
        const step = new RegisterPageActions(this);
        const actualMessageLocator = WebElements.RegisterPage.AccountCreationSuccessMessage;
        const expectedMessage = 'Thank you for registering with Main Website Store.'; // Replace with the appropriate message
        await step.verifyContentOfMessagesDisplayed(actualMessageLocator, expectedMessage);
    }
);

Then('Verify the error message is displayed for password less than minimum length',
    async function (this: ICustomWorld): Promise<void> {
        const step = new RegisterPageActions(this);
        const expectedMessage = 'Minimum length of this field must be equal or greater than 8 symbols. Leading and trailing spaces will be ignored.';
        await step.verifyContentOfMessagesDisplayed(WebElements.RegisterPage.PasswordMinLengthErrorMsgLocator || WebElements.RegisterPage.ErrorMessageAlertBoxLocator, expectedMessage);
    }
);

Then('Verify the error message is displayed for mismatched password confirmation',
    async function (this: ICustomWorld): Promise<void> {
        const step = new RegisterPageActions(this);
        const expectedMessage = 'Please make sure your passwords match.';
        await step.verifyContentOfMessagesDisplayed(WebElements.RegisterPage.ErrorMessageAlertBoxLocator, expectedMessage);
    }
);

Then('Verify the error message is displayed for blank values',
    async function (this: ICustomWorld): Promise<void> {
        const step = new RegisterPageActions(this);
        const expectedMessage = '"First Name" is a required value.';
        await step.verifyContentOfMessagesDisplayed(WebElements.RegisterPage.ErrorMessageAlertBoxLocator, expectedMessage);
    }
);

Then('Verify the error message is displayed for duplicate email address',
    async function (this: ICustomWorld): Promise<void> {
        const step = new RegisterPageActions(this);
        const expectedMessage = 'There is already an account with this email address.';
        await step.verifyContentOfMessagesDisplayed(WebElements.RegisterPage.ErrorMessageAlertBoxLocator || WebElements.RegisterPage.EmailFieldErrorMsgLocator, expectedMessage);
    }
);

Then('Verify the error message is displayed for invalid email format',
    async function (this: ICustomWorld): Promise<void> {
        const step = new RegisterPageActions(this);
        const expectedMessage = 'Please enter a valid email address (Ex: johndoe@domain.com).';
        await step.verifyContentOfMessagesDisplayed(WebElements.RegisterPage.EmailFieldErrorMsgLocator || WebElements.RegisterPage.ErrorMessageAlertBoxLocator, expectedMessage);
    }
);

