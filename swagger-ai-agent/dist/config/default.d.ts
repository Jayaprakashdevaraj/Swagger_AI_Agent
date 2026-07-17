/** Base configuration — shared across all environments. */
export declare const defaultConfig: {
    app: {
        name: string;
        version: string;
    };
    http: {
        port: number;
        requestSizeLimitMb: number;
        rateLimitWindowMs: number;
        rateLimitMaxRequests: number;
        specMaxSizeMb: number;
        externalTimeoutMs: number;
        externalRetries: number;
        externalRetryDelayMs: number;
    };
    logging: {
        level: string;
        dir: string;
    };
};
//# sourceMappingURL=default.d.ts.map