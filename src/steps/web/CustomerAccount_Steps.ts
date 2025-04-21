import { ICustomWorld } from '../../lib/interface/cucumber';
import { Given, When, Then, } from '@cucumber/cucumber';
import { CustomerAccountPageActions } from '../../lib/scripts/web/CustomerAccount_PageActions';
import { WebElements } from '../../lib/scripts/web/PageElements';



Then('Verify contact information is displayed on my account page',
    async function (this: ICustomWorld): Promise<void> {
        const step = new CustomerAccountPageActions(this);
        await step.verifyCustomerDetailsOnMyAccountPage();
    }
);

