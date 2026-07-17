"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = void 0;
/** Base configuration — shared across all environments. */
exports.defaultConfig = {
    app: {
        name: 'swagger-ai-agent',
        version: '1.0.0',
    },
    http: {
        port: 3000,
        requestSizeLimitMb: 10,
        rateLimitWindowMs: 60000,
        rateLimitMaxRequests: 25,
        specMaxSizeMb: 3,
        externalTimeoutMs: 20000,
        externalRetries: 2,
        externalRetryDelayMs: 300,
    },
    logging: {
        level: 'info',
        dir: 'logs',
    },
};
//# sourceMappingURL=default.js.map