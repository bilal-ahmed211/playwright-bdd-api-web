import { ICustomWorld } from "../../lib/interface/cucumber";
import { PageActionsHelper } from "../../lib/scripts/web/PageActionsHelper";
import { When, Then } from "@cucumber/cucumber";
import { toCamelCase } from "../../lib/utils/Utilities";
import { expect } from "@playwright/test"

When('user open a new tab',
    async function (this: ICustomWorld): Promise<void> {
        const step = new PageActionsHelper(this);
        await step.openNextTab();
    });

When('user open the previous tab',
    async function (this: ICustomWorld): Promise<void> {
        const step = new PageActionsHelper(this);
        await step.openPreviousTab();
    });

When('user click on {string} By Locator',
    async function (this: ICustomWorld, locatorKey: string): Promise<void> {
        const step = new PageActionsHelper(this);
        await step.waitForTimeout(2000);
        await step.clickByLocator({
            pageName: step.getPageName(toCamelCase(locatorKey)),
            locatorKey: toCamelCase(locatorKey)
        });
    });

When('user click on {string} By Text',
    async function (this: ICustomWorld, locatorKey: string): Promise<void> {
        const step = new PageActionsHelper(this);
        await step.waitForTimeout(2000);
        await step.clickByText({
            pageName: step.getPageName(toCamelCase(locatorKey)),
            locatorKey: step.getLocatorKey(locatorKey),
        });
    });

When('user click on {string} By {string} Role',
    async function (this: ICustomWorld, locatorKey: string, role: string): Promise<void> {
        const step = new PageActionsHelper(this);
        await step.waitForTimeout(2000);
        await step.clickByRole({
            pageName: step.getPageName(toCamelCase(locatorKey)),
            role: role,
            locatorKey: step.getLocatorKey(locatorKey),
        });
    });

When('user fill {string} with {string} value By Locator',
    async function (this: ICustomWorld, locatorKey: any, valueKey: string): Promise<void> {
        const step = new PageActionsHelper(this);
        await step.waitForTimeout(1000);
        await step.fillByLocator({
            pageName: step.getPageName(toCamelCase(locatorKey)),
            locatorKey: step.getLocatorKey(locatorKey),
            valueKey: valueKey
        });
    });

When('user fill {string} with {string} value By Label',
    async function (this: ICustomWorld, locatorKey: any, valueKey: string): Promise<void> {
        const step = new PageActionsHelper(this);
        await step.waitForTimeout(1000);
        await step.fillByLabel({
            pageName: step.getPageName(toCamelCase(locatorKey)),
            locatorKey: step.getLocatorKey(locatorKey),
            valueKey: valueKey
        });
    });

When('user fill {string} with {string} value By {string} Role',
    async function (this: ICustomWorld, locatorKey: any, role: string, valueKey: string): Promise<void> {
        const step = new PageActionsHelper(this);
        await step.waitForTimeout(1000);
        await step.fillByRole({
            pageName: step.getPageName(toCamelCase(locatorKey)),
            locatorKey: step.getLocatorKey(locatorKey),
            role: role,
            valueKey: valueKey,
        });
    });

When('user fill {string} By {string} Role with {string} value',
    async function (this: ICustomWorld, locatorKey: any, role: string, valueKey: string): Promise<void> {
        const step = new PageActionsHelper(this);
        await step.waitForTimeout(1000);
        await step.fillByRole({
            pageName: step.getPageName(toCamelCase(locatorKey)),
            locatorKey: step.getLocatorKey(locatorKey),
            role: role,
            valueKey: valueKey,
        });
    });


When('Double click on {string}',
    async function (this: ICustomWorld, locatorKey: any): Promise<void> {
        const step = new PageActionsHelper(this);
        await step.doubleClickOn({ locatorKey: toCamelCase(locatorKey) });
    });

When('Mark {string} as checked',
    async function (this: ICustomWorld, locatorKey: any): Promise<void> {
        const step = new PageActionsHelper(this);
        await step.selectCheckBox({ pageName: this.page || '', locatorKey: toCamelCase(locatorKey) });
    });

Then('Compare textbox value of {string} with {string}',
    async function (this: ICustomWorld, locatorKey: any, valueKey: string): Promise<void> {
        const step = new PageActionsHelper(this);
        await step.assertTextEquals({ pageName: this.page || '', locatorKey: locatorKey, expectedValue: valueKey });
    });

Then('Wait for {string} milli-seconds',
    async function (this: ICustomWorld, milliseconds: string): Promise<void> {
        const waitTime = Number(milliseconds);
        const step = new PageActionsHelper(this);
        await step.waitForTimeout(waitTime);
    });

When('Search and select {string} from {string} dropdown',
    async function (this: ICustomWorld, valueKey: string, locatorKey: any): Promise<void> {
        const step = new PageActionsHelper(this);
        await step.selectSearchableDropdownValue({
            pageName: this.pageName || '',
            locatorKey: toCamelCase(locatorKey),
            valueKey: toCamelCase(valueKey),
        });
    });

When('Select {string} from {string} dropdown',
    async function (this: ICustomWorld, valueKey: string, locatorKey: any): Promise<void> {
        const step = new PageActionsHelper(this);
        await step.selectDropdownValue({
            pageName: this.pageName || '',
            locatorKey: toCamelCase(locatorKey),
            valueKey: toCamelCase(valueKey),
        });
    });

When('upload {string} with {string} file',
    async function (this: ICustomWorld, valueKey: string, locatorKey: any): Promise<void> {
        const step = new PageActionsHelper(this);
        await step.uploadFile({
            pageName: this.pageName || '',
            locatorKey: toCamelCase(locatorKey),
            valueKey: toCamelCase(valueKey),
        });
    });

When('click and upload {string} with {string} file',
    async function (this: ICustomWorld, valueKey: string, locatorKey: any): Promise<void> {
        const step = new PageActionsHelper(this);
        await step.clickAndUploadFile({
            pageName: this.pageName || '',
            locatorKey: toCamelCase(locatorKey),
            valueKey: toCamelCase(valueKey),
        });
    });

When('I press {string} key',
    async function (this: ICustomWorld, key: string): Promise<void> {
        const step = new PageActionsHelper(this);
        await step.sendKeyboardKeys({ pageName: this.page, key: key });
    });

Then('I validate the text content for {string} equals to {string}',
    async function (this: ICustomWorld, locatorKey: any, expectedValue: string): Promise<void> {
        const step = new PageActionsHelper(this);
        const actualValue = await step.getTextContent({
            pageName: this.pageName || '',
            locatorKey: toCamelCase(locatorKey),
        });
        await expect(actualValue).toEqual(expectedValue);
    });


