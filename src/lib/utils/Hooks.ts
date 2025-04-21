import * as fs from 'fs';
import * as path from 'path';
import { ICustomWorld } from '../interface/cucumber';
import { config } from '../../../playwright.config'
import { mkdir, ensureFileSync, ensureDir } from 'fs-extra';
import {
    Before,
    After,
    BeforeAll,
    AfterAll,
    Status,
    setDefaultTimeout,
    AfterStep
} from '@cucumber/cucumber'

import {
    chromium,
    ChromiumBrowser,
    firefox,
    FirefoxBrowser,
    webkit,
    WebKitBrowser,
    Page,
    BrowserContext,
    APIRequestContext,
    APIResponse,
    APIRequest,
    request
} from '@playwright/test'

import { ITestCaseHookParameter } from '@cucumber/cucumber';
import { env } from '../../../env'
import { AllureApiLogger } from '../utils/AllureApiLogger'; // Ensure this import path is correct

const screenshots_folder = '../../../allure-report'
const allure_categories_conf_path = path.join('allure-report', 'categories.json');
const allure_envProperties_path = path.join('allure-report', 'environment.properties');
const allure_categories_target_path = path.join('allure-report', 'allure-results', 'categories.json');
const allure_envProperties_target_path = path.join(
    'allure-report',
    'allure-results',
    'environment.properties'
);

let browser: ChromiumBrowser | FirefoxBrowser | WebKitBrowser;
let page: Page;
let context: BrowserContext;
let apiContext: APIRequestContext;
let apiRequest: APIRequest;
let apiResponse: APIResponse;

const tracesDir = 'traces';

declare global {
    var browser: ChromiumBrowser | FirefoxBrowser | WebKitBrowser
}

setDefaultTimeout(env.playwright.defaultTimeout);

BeforeAll(async function (): Promise<any> {
    switch (env.playwright.browser) {
        case 'firefox':
            browser = await firefox.launch({
                ...config.browserOptions,
                ...config.defineConfig,
            }
            )
            break;
        case 'webkit':
            browser = await firefox.launch({
                ...config.browserOptions,
                ...config.defineConfig,
            }
            )
            break;
        default:
            console.log('Launching Chrome Browser', config.browserOptions);
            browser = await chromium.launch({
                ...config.browserOptions,
                ...config.defineConfig,
                channel: env.playwright.browser,
                // logLevel: env.playwright.logLevel,
            });
    }

    await ensureDir(tracesDir);

    if (!fs.existsSync(screenshots_folder)) {
        mkdir(screenshots_folder);
    }

    ensureFileSync(allure_envProperties_target_path);
    ensureFileSync(allure_categories_target_path);
});

Before(async function (this: ICustomWorld, { pickle }: ITestCaseHookParameter): Promise<any> {
    const parent_suite = await pickle.uri
        .replace(/[a-zA-Z]+\/[a-zA-Z]+\//i, '')
        .replace('features', '')
        .replace('ui', '')
        .replace('\\\\', '\\')
        .replace('.feature', '')
        .toUpperCase();
    await parentSuite(parent_suite);

    async function parentSuite(suiteName: string): Promise<void> {
        console.log(`Parent suite: ${suiteName}`);
    }
});

Before({ tags: '@ignore' }, function (): string {
    return 'skipped' as any;
});

Before({ tags: '@debug' }, function (this: ICustomWorld): void {
    this.debug = true;
});


Before(
    { tags: '@ui' },
    async function (this: ICustomWorld, { pickle }: ITestCaseHookParameter): Promise<any> {
        this.testName = pickle.name.replace(/\W/g, '-');

        if (env.playwright.isToUseSameBrowser && context && page) {
            this.page = page;
            this.context = context;
            return;
        }

        this.context = await browser.newContext({
            acceptDownloads: true,
            recordVideo: env.playwright.isVideoEnabled ? { dir: 'screenshots' } : undefined,
            viewport: null, // eslint-disbale-line no-null/no-null
            ignoreHTTPSErrors: true,
        });

        if (env.playwright.isBrowserLogsEnabled) {
            this.context.on('weberror', (webError: any): any => {
                console.log(`Uncaught exception: "${JSON.stringify(webError.error())}`);
            });
        }

        await this.context.tracing.start({
            screenshots: true,
            snapshots: true,
            sources: true,
        });
        context = this.context;

        this.page = await this.context.newPage();
        page = this.page;
    }
);

Before(async function (this: ICustomWorld) {
    // Initialize the API context
    this.apiContext = await request.newContext();
    apiContext = this.apiContext;
    console.log('API context initialized');
});


AfterStep(async function (this: ICustomWorld, { result }: ITestCaseHookParameter): Promise<any> {
    if (result?.status !== 'PASSED') {
        const image: any = await this.page?.screenshot({ type: 'png' });
        if (image) {
            await this.allure?.attachment('screenshot', image, 'image/png');
        }

        // Log API call details using AllureApiLogger
        if (this.apiContext) {
            if (this.apiRequest && this.apiResponse) {
                AllureApiLogger.logApiCallDetails(
                    this, 
                    undefined,
                    this.apiResponse.url(),
                    this.apiResponse.headers(),
                    this.payload,
                    this.apiResponse,
                );
            }
        }
    }
});

// After(async function (this: ICustomWorld) {
//     // Dispose of the API context after the test
//     if (this.apiContext) {
//         await this.apiContext.dispose();
//         this.apiContext = null;
//         console.log('API context disposed');
//     }
// });

After(async function (this: ICustomWorld, { result }: ITestCaseHookParameter): Promise<void> {
    await this.attach(`Object: ${JSON.stringify(result)}`);

    if (result) {
        await this.attach(`Status: ${result?.status}, CurrentUrl: ${this.page?.url()}`);

        //Add Screenshot
        const image = await this.page?.screenshot();
        if (image) {
            await this.attach(image, 'image/png');
        }

        if (result.status !== Status.PASSED) {
            //Add Video
            if (process.env.PWVIDEO) {
                const video = await this.page?.video();
                const videoPath = await video?.path();
                await this.page?.waitForTimeout(35000);
                if (video) {
                    const file = fs.readFileSync('' + videoPath);
                    // await this.attach(fs.readFileSync('./' + videoPath), 'video/webm'); // Unix
                    await this.attach(file, 'video/webm') // Windows
                }
            }

            const startTime = new Date();
            const traceTime: string = startTime?.toISOString().split('.')[0].replaceAll(':', '.');
            const tracePath = `${tracesDir}/${this.testName}-trace.zip`;
            await this.context?.tracing.stop({
                path: tracePath,
            });
        }
    }

    if (env.playwright.closeBrowser && !env.playwright.isToUseSameBrowser) {
        await this.page?.close();
        await this.context?.close();
    }
});

AfterAll(async function (): Promise<any> {
    try {
        // Write environment.properties for allure reporter
        await fs.writeFileSync(
            allure_envProperties_path,
            `Browser = ${env.playwright.browser} ${browser.version()} \nEnvironment = prod \nURL = ${env.playwright.baseUrl}`
        );
        // Copy allure environment properties file to allure results
        await fs.copyFileSync(allure_envProperties_path, allure_envProperties_target_path);
        console.log('Environment properties file was copied to destination');

        // Copy allure categories configuration file
        // await fs.copyFileSync(allure_categories_conf_path, allure_categories_target_path);
        // console.log('File was copied to destination');

    } catch (err) {
        console.error('Error in AfterAll hook:', err);
        throw err; // Rethrow the error to ensure it is properly handled
    }

    if (fs.existsSync(screenshots_folder)) {
        fs.rmSync(screenshots_folder, { recursive: true, force: true });
    }

    if (env.playwright.closeBrowser) {
        await browser.close();
    }
});