import { Page } from "@playwright/test";
import { ICustomWorld } from "../../interface/cucumber";
import { WebElements } from "./PageElements";

import {
    toHover,
    assertElementIsVisible,
    assertElementIsEnabled,
    assertElementIsHidden,
    assertElementTextEquals,
    assertElementContainText,
    assertElementHaveValue,
    assertElementHaveValues,
    clickByElementLocator,
    clickByElementText,
    clickByElementRole,
    doublClick,
    sendKeyboardKeys,
    fillElementByLocator,
    fillElementByText,
    fillElementByRole,
    fillElementByplaceholder,
    fillElementByLabel,
    searchAndSelectFromDropdown,
    selectValueFromDropdown,
    checked,
    uploadFile,
    clickAndUpload,
    textContent,
    innerText,
    inputValue,
    getAttribute
} from "../../utils/PlaywrightUtils";

export class PageActionsHelper {
    public page: Page;
    public elements: any;
    public dataSource: any;
    public context: any;

    public constructor(self: ICustomWorld) {
        this.page = self.page;
        this.elements = self.pageElements;
        this.dataSource = self.dataSource;
        this.context = self.context;

    };

    public getPageName(locatorKey: any): any {
        for (let page in WebElements) {
            if (locatorKey in WebElements[page]) {
                return page;
            } else {
                page = locatorKey;
            }

        }
        throw new Error(`Page not found for locatorKey: ${locatorKey}`);
    };

    public getLocatorKey(locatorKey: string): string {
        for (const page in WebElements) {
            for (const key in WebElements[page]) {
                if (key === locatorKey) {
                    return WebElements[page][key];
                }
            }
        }
        throw new Error(`Locator key not found: ${locatorKey}`);
    };

    public async openNextTab(): Promise<void> {
        const pages = await this.context.pages();
        if (pages.length > 1) {
            this.page = pages[1];
        } else {
            throw new Error('No additional tabs found');
        }
    };

    public async openPreviousTab(): Promise<void> {
        const pages = await this.context.pages();
        if (pages.length > 0) {
            this.page = pages[0];
        } else {
            throw new Error('No previous tabs found');
        }
    };

    public async waitForTimeout(waitTime: number = 1000): Promise<void> {
        await this.page.waitForTimeout(waitTime);
    };

    public async toHover({
        locatorKey,
    }: {
        locatorKey: any;
    }): Promise<void> {
        await toHover(this.page, locatorKey);
    };

    public async doubleClickOn({
        locatorKey,
    }: {
        locatorKey: any;
    }): Promise<void> {
        await doublClick(this.page, locatorKey);
    };

    public async clickByLocator({
        pageName,
        locatorKey,
    }: {
        pageName?: any,
        locatorKey: string,
    }): Promise<void> {
        await clickByElementLocator(this.page, locatorKey);
    };

    public async clickByText({
        pageName,
        locatorKey,
    }: {
        pageName?: any,
        locatorKey: string,
    }): Promise<void> {
        await clickByElementText(this.page, locatorKey);
    };

    public async clickByRole({
        pageName,
        role,
        locatorKey,
    }: {
        pageName: any,
        role: string,
        locatorKey: string,
    }): Promise<void> {
        
        await clickByElementRole(this.page, role, locatorKey);
    };

    public async fillByLocator({
        pageName,
        locatorKey,
        valueKey,
    }: {
        pageName?: any,
        locatorKey: any,
        valueKey: string,
    }): Promise<void> {
        await fillElementByLocator(this.page, locatorKey, valueKey);
    };

    public async fillByRole({
        pageName,
        locatorKey,
        role,
        valueKey,
        index,
    }: {
        pageName: string,
        locatorKey: any,
        role: any,
        valueKey: string,
        index?: any,
    }): Promise<void> {
        await fillElementByRole(this.page, role, locatorKey, index, valueKey);
    };

    public async fillByText({
        pageName,
        locatorKey,
        index,
        valueKey,
    }: {
        pageName: string,
        locatorKey: any,
        index: any,
        valueKey: string
    }): Promise<void> {
        await fillElementByText(this.page, locatorKey, index, valueKey);
    };

    public async fillByPlaceholder({
        locatorKey,
        valueKey,
    }: {
        locatorKey: any,
        valueKey: string
    }): Promise<void> {
        await fillElementByplaceholder(this.page, locatorKey, valueKey);
    };

    public async fillByLabel({
        pageName,
        locatorKey,
        valueKey,
    }: {
        pageName?: any,
        locatorKey: any,
        valueKey: string,
    }): Promise<void> {
        await fillElementByLabel(this.page, locatorKey, valueKey);
    };

    public async sendKeyboardKeys({
        pageName,
        key,
    }: {
        pageName?: any;
        key: string;
    }): Promise<void> {
        return sendKeyboardKeys(pageName, key);
    };

    public async selectSearchableDropdownValue({
        pageName,
        locatorKey,
        valueKey,
    }: {
        pageName?: any,
        locatorKey: any,
        valueKey: string
    }): Promise<void> {
        await searchAndSelectFromDropdown(this.page, locatorKey, valueKey);
    }

    public async selectDropdownValue({
        pageName,
        locatorKey,
        valueKey,
    }: {
        pageName?: any,
        locatorKey: any,
        valueKey: string,
    }): Promise<void> {
        await selectValueFromDropdown(this.page, locatorKey, valueKey);
    }

    public async selectCheckBox({
        pageName,
        locatorKey,
    }: {
        pageName?: any,
        locatorKey: any
    }): Promise<void> {
        await checked(this.page, locatorKey);
    };

    public async uploadFile({
        pageName,
        locatorKey,
        valueKey,
    }: {
        pageName?: any,
        locatorKey: any,
        valueKey: string
    }): Promise<void> {
        await uploadFile(this.page, locatorKey, valueKey);
    }

    public async clickAndUploadFile({
        pageName,
        locatorKey,
        valueKey,
    }: {
        pageName?: any,
        locatorKey: any,
        valueKey: string
    }): Promise<void> {
        await clickAndUpload(this.page, locatorKey, valueKey);
    };





    public async assertElementVisible({
        pageName,
        role,
        locatorKey,
    }: {
        pageName?: any,
        role?: string,
        locatorKey: string,
    }): Promise<void> {
        await assertElementIsVisible(this.page, locatorKey);
    }

    public async assertElementEnabled({
        pageName,
        locatorKey,
    }: {
        pageName?: any,
        locatorKey: any,
    }): Promise<void> {
        await assertElementIsEnabled(this.page, locatorKey);
    }

    public async assertElementHidden({
        pageName,
        locatorKey,
    }: {
        pageName?: any,
        locatorKey: any,
    }): Promise<void> {
        await assertElementIsHidden(this.page, locatorKey);
    };

    public async assertTextEquals({
        pageName,
        locatorKey,
        expectedValue,
    }: {
        pageName?: any,
        locatorKey: any,
        expectedValue: string
    }): Promise<void> {
        await assertElementTextEquals(this.page, locatorKey, expectedValue);
    };

    public async assertToContainText({
        locatorKey,
        expectedValue
    }: {
        locatorKey: any;
        expectedValue: string;
    }): Promise<void> {
        await assertElementContainText(this.page, locatorKey, expectedValue);
    };

    public async assertToHaveValue({
        pageName,
        locatorKey,
        expectedValue,
    }: {
        pageName?: any,
        locatorKey: any,
        expectedValue: string
    }): Promise<void> {
        await assertElementHaveValue(this.page, locatorKey, expectedValue);
    };

    public async assertToHaveValues({
        pageName,
        locatorKey,
        expectedValue,
    }: {
        pageName?: any,
        locatorKey: any,
        expectedValue: any
    }): Promise<void> {
        await assertElementHaveValues(this.page, locatorKey, expectedValue);
    };

    public async getTextContent({
        pageName,
        locatorKey,
    }: {
        pageName?: any;
        locatorKey: any;
    }): Promise<string> {
        return await textContent(this.page, locatorKey);
    }

    public async getlocatorValue({
        pageName,
        locatorKey,
    }: {
        pageName?: any;
        locatorKey: any;
    }): Promise<string> {
        return await inputValue(this.page, locatorKey);
    }

    public async getInnerText({
        pageName,
        locatorKey,
    }: {
        pageName?: any;
        locatorKey: any;
    }): Promise<string> {
        return await innerText(this.page, locatorKey);
    }

    public async getAttributeValue({
        pageName,
        locatorKey,
        attribute,
    }: {
        pageName?: any;
        locatorKey: any;
        attribute: string;
    }): Promise<string> {
        return await getAttribute(this.page, locatorKey, attribute)
    }

}