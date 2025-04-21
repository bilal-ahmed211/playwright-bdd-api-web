import {ICustomWorld} from '../../lib/interface/cucumber';
import {Given} from '@cucumber/cucumber';
import { PageNavigations } from '../../lib/scripts/web/PageNavigations';

Given('user navigate to Home page',
    async function(this: ICustomWorld): Promise<void>{
        const step = new PageNavigations(this);
        await step.navigateToHomePage();
    }
);

Given('user navigate to Login page',
    async function(this: ICustomWorld): Promise<void>{
        const step = new PageNavigations(this);
        await step.navigateToLoginPage();
    }
);

Given('user navigate to Registration page',
    async function(this: ICustomWorld): Promise<void>{
        const step = new PageNavigations(this);
        await step.navigateToRegistrationForm();
    }
);
