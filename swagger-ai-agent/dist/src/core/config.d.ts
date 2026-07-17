export declare const config: {
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
export type AppConfig = typeof config;
//# sourceMappingURL=config.d.ts.map