

const {series} = require('nps-utils');
require('dotenv').config();

const binPath = '\\node_modules\\.bin';
module.exports = {
    scripts: {
        default: 'nps start',
        dryrun: {
            script: series(
                `cucumber-js **/*.feature --dry-run`
            ),
            description: 'Dry run the cucumber tests'
        },
        test: {
            ui: {
                script: `cucumber-js --config ./cucumber.mjs **/*.feature --tags=@PlaceOrderTest --format @cucumber/pretty-formatter --exit`,
                description: 'Run the UI Automation Scripts'
            },

            api: {
                script: `cucumber-js --config ./cucumber.mjs **/*.feature --tags=@APITests --format @cucumber/pretty-formatter --exit`,
                description: 'Run the API Automation Scripts'
            }, 

            all: {
                script: `cucumber-js --config ./cucumber.mjs **/*.feature --format @cucumber/pretty-formatter --exit`,
                description: 'Run All the Automation Scripts'
            },
        },
        allure: {
            serve: {
                script: 'npx allure serve allure-report/allure-results',
                description: 'Serve allure report'
            },
            generate: {
                script: 'npx generate allure-report/allure-results --clean -o allure-report/allure-results',
                description: 'Generate allure report'
            },
        }
    }
}