/** Base configuration — shared across all environments. */
export const defaultConfig = {
  app: {
    name: 'swagger-ai-agent',
    version: '1.0.0',
  },
  http: {
    port: 3000,
    requestSizeLimitMb: 10,
  },
  logging: {
    level: 'info',
    dir: 'logs',
  },
};
