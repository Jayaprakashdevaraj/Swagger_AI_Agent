import { NextFunction, Request, Response } from 'express';
interface RateLimitOptions {
    windowMs: number;
    maxRequests: number;
}
/**
 * Basic in-memory rate limiter for API hardening.
 */
export declare function createRateLimiter(options: RateLimitOptions): (req: Request, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=rateLimiter.d.ts.map