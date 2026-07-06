/**
 * Phase 1 — Sample unit test.
 * Verifies that the config and env modules load correctly.
 */

describe('Config & Env (Phase 1 smoke tests)', () => {
  it('should load env with default NODE_ENV', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { env } = require('../../core/env');
    expect(env).toBeDefined();
    expect(typeof env.PORT).toBe('number');
    expect(env.PORT).toBeGreaterThan(0);
  });

  it('should merge config from default and environment overrides', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { config } = require('../../core/config');
    expect(config).toBeDefined();
    expect(config.app.name).toBe('swagger-ai-agent');
    expect(config.http.port).toBeGreaterThan(0);
    expect(typeof config.logging.level).toBe('string');
  });

  it('should have a valid request size limit', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { config } = require('../../core/config');
    expect(config.http.requestSizeLimitMb).toBeGreaterThan(0);
  });
});
