import { ICustomWorld } from '../../lib/interface/cucumber';
import { Given, When, Then, } from '@cucumber/cucumber';
import { LoginPageActions } from '../../lib/scripts/web/UserLogin_PageActions';
import {CustomerAccountPageActions} from '../../lib/scripts/web/CustomerAccount_PageActions';
import { WebElements } from '../../lib/scripts/web/PageElements';
import { getTestCaseData } from '../../lib/utils/GetTestCaseData';
import { LocalStore } from '../../lib/utils/LocalStore';
import { PageNavigations } from '../../lib/scripts/web/PageNavigations';

Given('user click on signin button',
    async function (this: ICustomWorld): Promise<void> {
        const step = new LoginPageActions(this);
        try {
            await step.clickSignInBtn();
        } catch (error) {
            console.error('Error during sign-in without credentials:', error);
            throw error;
        }
    }
);

Given('Verify error message is displayed indicating Fields are required',
    async function (this: ICustomWorld): Promise<void> {
        const step = new LoginPageActions(this);
        const expectedErrorMsgText = 'This is a required field.'
        await step.verifyErrorMessagesForCredentials({ emailError: expectedErrorMsgText, passError: expectedErrorMsgText });
    }
);

Given('Verify user is not logged in and remains on the login page',
    async function (this: ICustomWorld): Promise<void> {
        const step = new LoginPageActions(this);
        try {
            await step.verifyUserIsOnLoginPage();
        } catch (error) {
            console.error('Error during login page verification:', error);
            throw error;
        }
    }
);

When('user enter valid credentials and click on signin button',
    async function (this: ICustomWorld): Promise<void> {
        const step = new LoginPageActions(this);
        const validEmail = process.env.VALID_LOGIN_EMAIL;
        const validPassword = process.env.VALID_LOGIN_PASSWORD;
        await step.fillEmailAndPassword(validEmail, validPassword);
        await step.web.clickByLocator({locatorKey: WebElements.LoginPage.SigninBtnLocator});
        await step.web.waitForTimeout(2000)
    }
);

When('user enter newly registered credentials',
    async function (this: ICustomWorld): Promise<void> {
        const step = new LoginPageActions(this);
        const email = getTestCaseData('Email');
        const registeredEmail = LocalStore.getInstance().getValue('registeredEmail') as unknown as string;
        const passwrod = getTestCaseData('Password');
        await step.fillEmailAndPassword(registeredEmail, passwrod);
    }
);

Then('user signout from the application',
    async function (this: ICustomWorld): Promise<void> {
        const step = new LoginPageActions(this);
        await this.page.reload();
        console.log('SignoutArrowLocator:', WebElements.CustomerAccountPage.SignoutArrowLocator);
        await step.web.clickByLocator({locatorKey: WebElements.CustomerAccountPage.SignoutArrowLocator});
        await step.web.clickByLocator({locatorKey: WebElements.CustomerAccountPage.SignoutBtnLocator});
        
    }
);

Then('Verify user is logged in successfully and redirected to my account page',
    async function (this: ICustomWorld): Promise<void> {
        const step = new LoginPageActions(this);
        await step.verifyLoginSuccess()
    }
);

Given('user is logged into the application',
    async function (this: ICustomWorld): Promise<void> {
        const step = new LoginPageActions(this);
        const nav = new PageNavigations(this);
        await nav.navigateToHomePage();
        await nav.navigateToLoginPage();
        await step.fillEmailAndPassword(process.env.VALID_LOGIN_EMAIL, process.env.VALID_LOGIN_PASSWORD);
        await step.web.clickByLocator({locatorKey: WebElements.LoginPage.SigninBtnLocator});
    });

