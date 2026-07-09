/** Base configuration — shared across all environments. */
export const defaultConfig = {
  app: {
    name: 'swagger-ai-agent',
    version: '1.0.0',
  },
  http: {
    port: 3000,
    requestSizeLimitMb: 10,
    rateLimitWindowMs: 60_000,
    rateLimitMaxRequests: 25,
    specMaxSizeMb: 3,
    externalTimeoutMs: 20_000,
    externalRetries: 2,
    externalRetryDelayMs: 300,
  },
  logging: {
    level: 'info',
    dir: 'logs',
  },
};
