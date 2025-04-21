"use strict";
exports.__esModule = true;
var allure_cucumberjs_1 = require("allure-cucumberjs");
// Add this line to resolve the module
require('ts-node').register({ transpileOnly: true });
function Reporter(options) {
    return new allure_cucumberjs_1.CucumberJSAllureFormatter(options, new allure_cucumberjs_1.AllureRuntime({ resultsDir: './allure-report/allure-results' }), {
        labels: [
            {
                name: 'epic',
                pattern: [/@feature:(.*)/]
            },
            {
                name: 'severity',
                pattern: [/@serverity:(.*)/]
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
        ]
    });
}
Reporter.prototype = Object.create(allure_cucumberjs_1.CucumberJSAllureFormatter.prototype);
Reporter.prototype.constructor = Reporter;
exports["default"] = Reporter;
