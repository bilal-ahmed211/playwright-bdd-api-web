import * as pkg from './package.json';
import { getOsEnv, toBool} from './src/lib/utils/Utilities';

export const env = {

    app: {
        name: getOsEnv('APP_NAME') || (pkg as any).name,
        version: getOsEnv('APP_VERSION') || (pkg as any).version,
    },
    imgThreshold: {threshold: 0.4 },
    channelId: getOsEnv('CHANNEL_ID') || '',
    // datasetPath: getOsEnv('DATASET_PATH') || '',

    playwright: {
        isBrowserLogsEnabled: toBool(getOsEnv('BROWSER_LOG_ENABLED')) || false,
        defaultTimeout: Number(getOsEnv('DEFAULT_TIMEOUT') || 60 * 1000),
        isHeadlessModeEnabled: toBool(getOsEnv('IS_HEADLESS_MODE_ENABLED')) || false,
        isVideoEnabled: toBool(getOsEnv('IS_VIDEO_ENABLED')) || true,
        browser: getOsEnv('BROWSER') || 'chromium',
        executeType: getOsEnv('EXECUTE_TYPE') || 'CI',
        baseUrl: String(getOsEnv('BASE_FE_URL')) || 'www.google.com',
        baseApiUrl: String(getOsEnv('BASE_API_URL')) || 'abc.com',
        browserLaunchOptions: getOsEnv('BROWSER_LAUNCH_OPTIONS') || {},
        headlessLaunchOptions: getOsEnv('HEADLESS_LAUNCH_OPTIONS') || {},
        workers: Number(getOsEnv('WORKERS')) || 1,
        logLevel: String(getOsEnv('LOG_LEVEL')) || 'error',
        closeBrowser: toBool(getOsEnv('CLOSE_BROWSER_POST_EXECUTION')) || false,
        isToUseSameBrowser: toBool(getOsEnv('IS_TO_USE_SAME_BROWSER')) || false,
    },

    db: {
        connectionString: String(getOsEnv('MONGODB_URL')),
        name: String(getOsEnv('MONGODB_NAME')),
        enableMongodbConnection: toBool(getOsEnv('ENABLE_MONGODB_CONNECTION')) || false,
        mongodbDetails: getOsEnv('MONGODB_Details') || {},
    }
}