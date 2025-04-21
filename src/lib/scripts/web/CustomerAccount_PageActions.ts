import { Page} from "@playwright/test";
import { ICustomWorld } from "../../interface/cucumber";
import { PageActionsHelper } from "./PageActionsHelper";
import { WebElements } from "./PageElements";
import { get } from "lodash";
import { getTestCaseData } from "../../utils/GetTestCaseData";


export class CustomerAccountPageActions {
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

    public async verifyCustomerDetailsOnMyAccountPage(): Promise<void> {
        let { ContactInformationLabel } = WebElements.CustomerAccountPage;
        await this.web.waitForTimeout(3000);
        await this.web.assertElementVisible({ locatorKey: ContactInformationLabel})
    }
};
