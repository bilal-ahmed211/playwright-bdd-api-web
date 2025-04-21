import 'ts-node/esm';
const getWorldParams = () => {
    const params = {
        foo: 'bar',
    };
    return params;
}

const config = {
    requireModule: [],
    require: [
        'src/lib/utils/*.ts',
        'src/lib/utils/Hooks.ts',
        'src/steps/**/*.ts',
    ],
    format: [
        'summary',
        'progress-bar',
        '@cucumber/pretty-formatter',
        './allure.config.js:OUTPUT.txt',
        'rerun:@rerun.txt',
    ],
    paths: ["**/*.feature"],
    formatOptions: {snippetInterface: 'async-await'},
    worldParameters: getWorldParams(),
    default: '--publish-quiet',
};

config.format.push('./allure.config.ts');
export default config;