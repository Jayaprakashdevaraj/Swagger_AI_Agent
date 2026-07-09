import axios from 'axios';
import { AxiosClient } from '../../infrastructure/http/AxiosClient';
import { ExternalServiceError } from '../../core/errors/ExternalServiceError';
import { createRateLimiter } from '../../core/middlewares/rateLimiter';

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
  },
}));

describe('Phase 12 hardening', () => {
  it('retries transient HTTP status responses and then succeeds', async () => {
    const request = jest
      .fn()
      .mockResolvedValueOnce({ status: 503, headers: {}, data: { ok: false } })
      .mockResolvedValueOnce({ status: 200, headers: {}, data: { ok: true } });

    (axios.create as jest.Mock).mockReturnValue({ request });

    const client = new AxiosClient(undefined, { retries: 2, retryDelayMs: 1 });
    const response = await client.request({ method: 'GET', url: 'https://example.test/health' });

    expect(response.status).toBe(200);
    expect(request).toHaveBeenCalledTimes(2);
  });

  it('maps terminal network failures to ExternalServiceError', async () => {
    const request = jest.fn().mockRejectedValue(new Error('socket hang up'));
    (axios.create as jest.Mock).mockReturnValue({ request });

    const client = new AxiosClient(undefined, { retries: 1, retryDelayMs: 1 });

    await expect(client.request({ method: 'GET', url: 'https://example.test/health' })).rejects.toBeInstanceOf(
      ExternalServiceError
    );
    expect(request).toHaveBeenCalledTimes(2);
  });

  it('rate limits requests after configured threshold', () => {
    const limiter = createRateLimiter({ windowMs: 1000, maxRequests: 2 });

    const req = {
      ip: '127.0.0.1',
      socket: { remoteAddress: '127.0.0.1' },
    } as any;

    const responseState: { status?: number; payload?: unknown; retryAfter?: string } = {};
    const res = {
      setHeader: jest.fn((name: string, value: string) => {
        if (name === 'Retry-After') {
          responseState.retryAfter = value;
        }
      }),
      status: jest.fn((statusCode: number) => {
        responseState.status = statusCode;
        return res;
      }),
      json: jest.fn((payload: unknown) => {
        responseState.payload = payload;
      }),
    } as any;

    const next = jest.fn();

    limiter(req, res, next);
    limiter(req, res, next);
    limiter(req, res, next);

    expect(next).toHaveBeenCalledTimes(2);
    expect(responseState.status).toBe(429);
    expect(responseState.retryAfter).toBeDefined();
    expect(responseState.payload).toEqual(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({
          code: 'RATE_LIMIT_EXCEEDED',
        }),
      })
    );
  });
});
