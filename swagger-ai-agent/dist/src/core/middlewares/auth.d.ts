import { Request, Response, NextFunction } from 'express';
/**
 * Placeholder auth middleware.
 * Phase 1: passes all requests through.
 * Replace with real JWT / API-key validation in a later phase.
 */
export declare function auth(_req: Request, _res: Response, next: NextFunction): void;
/**
 * Extracts Bearer token from Authorization header.
 * Returns undefined if not present.
 */
export declare function extractBearerToken(req: Request): string | undefined;
/**
 * Middleware that requires a Bearer token to be present.
 * Use on routes that must be authenticated.
 */
export declare function requireAuth(req: Request, _res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.d.ts.map