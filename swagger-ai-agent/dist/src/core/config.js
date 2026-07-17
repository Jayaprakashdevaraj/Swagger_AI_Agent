"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const env_1 = require("./env");
const default_1 = require("../../config/default");
const development_1 = require("../../config/development");
const production_1 = require("../../config/production");
const test_1 = require("../../config/test");
function mergeDeep(base, override) {
    const result = { ...base };
    for (const key of Object.keys(override)) {
        const baseVal = base[key];
        const overrideVal = override[key];
        if (overrideVal !== undefined) {
            if (typeof baseVal === 'object' && !Array.isArray(baseVal) && typeof overrideVal === 'object') {
                result[key] = mergeDeep(baseVal, overrideVal);
            }
            else {
                result[key] = overrideVal;
            }
        }
    }
    return result;
}
const envOverrides = {
    development: development_1.developmentConfig,
    production: production_1.productionConfig,
    test: test_1.testConfig,
};
const envSpecific = envOverrides[env_1.env.NODE_ENV] ?? {};
exports.config = mergeDeep(default_1.defaultConfig, {
    ...envSpecific,
    http: {
        ...envSpecific.http,
        port: env_1.env.PORT,
    },
    logging: {
        ...envSpecific.logging,
        level: env_1.env.LOG_LEVEL,
    },
});
//# sourceMappingURL=config.js.map