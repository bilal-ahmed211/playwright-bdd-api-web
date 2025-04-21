import { setWorldConstructor, IWorldOptions } from '@cucumber/cucumber';
import { BrowserContext, APIRequestContext, APIRequest, APIResponse, Page } from '@playwright/test';
// import {Allure, CucumberAllureWorld} from '@cucumber/cucumber'
import { Allure, CucumberAllureWorld } from 'allure-cucumberjs'

export interface CucumberWorldConstructorParams {
    parameters: { [key: string]: string };
}

export interface ICustomWorld extends CucumberAllureWorld {

    debug: boolean;
    context?: BrowserContext;
    page?: Page;
    allure?: Allure;
    testName?: string;
    startTime?: Date;
    dataSource?: any;
    pageElements?: any;
    pageName?: string;
    apiContext?: APIRequestContext;
    apiRequest?: APIRequest;
    apiResponse?: APIResponse;
    apiResponseBody?: any;
    apiResponseDetails?: any;
    curlCommand?: string;
    apiDataSource?: any;
    payload?: any;
    // parentSuite: (suiteName: string) => Promise<void>
}

export class CustomWorld extends CucumberAllureWorld implements ICustomWorld{
    public debug: boolean = false;
    public async parentSuite(name: string): Promise<void> {
        console.log(`Setting parent suite: ${name}`);
    }
    public constructor(options: IWorldOptions){
        super(options);
    }
}

setWorldConstructor(CustomWorld);