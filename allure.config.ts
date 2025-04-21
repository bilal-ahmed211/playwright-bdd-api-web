import { AllureRuntime, CucumberJSAllureFormatter } from 'allure-cucumberjs';
// Add this line to resolve the module
require('ts-node').register({ transpileOnly: true });
import * as fs from 'fs';
import * as path from 'path';

const allureResultsDir = path.resolve(__dirname, './allure-report/allure-results');
if (!fs.existsSync(allureResultsDir)) {
    fs.mkdirSync(allureResultsDir, { recursive: true });
}

function Reporter(options) {
    return new CucumberJSAllureFormatter(
        options,
        new AllureRuntime({ resultsDir: allureResultsDir }),
        {
            labels: [
                {
                    name: 'epic',
                    pattern: [/@feature:(.*)/],
                },
                {
                    name: 'severity',
                    pattern: [/@serverity:(.*)/],
                }
            ],
            links: [
                {
                    type: 'issue',
                    pattern: [/@issue:(.*)/],
                    urlTemplate: 'http:localhost:8000/issue/%s'
                },
                {
                    type: 'tms',
                    pattern: [/@tms:(.*)/],
                    urlTemplate: 'http:localhost:8000/tms/%s'
                },
            ],
        },
    );
}

Reporter.prototype = Object.create(CucumberJSAllureFormatter.prototype);
Reporter.prototype.constructor = Reporter;
export default Reporter;