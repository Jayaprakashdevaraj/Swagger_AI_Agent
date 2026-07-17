"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRateLimiter = createRateLimiter;
/**
 * Basic in-memory rate limiter for API hardening.
 */
function createRateLimiter(options) {
    const counters = new Map();
    return function rateLimiter(req, res, next) {
        const key = req.ip || req.socket.remoteAddress || 'unknown';
        const now = Date.now();
        const current = counters.get(key);
        if (!current || now - current.windowStart >= options.windowMs) {
            counters.set(key, { count: 1, windowStart: now });
            next();
            return;
        }
        current.count += 1;
        if (current.count > options.maxRequests) {
            const retryAfterSeconds = Math.ceil((options.windowMs - (now - current.windowStart)) / 1000);
            res.setHeader('Retry-After', String(Math.max(retryAfterSeconds, 1)));
            res.status(429).json({
                success: false,
                error: {
                    code: 'RATE_LIMIT_EXCEEDED',
                    message: 'Too many requests. Please retry later.',
                    details: [
                        {
                            field: 'rateLimit',
                            message: `Maximum ${options.maxRequests} requests per ${options.windowMs}ms exceeded`,
                        },
                    ],
                },
            });
            return;
        }
        next();
    };
}
//# sourceMappingURL=rateLimiter.js.map