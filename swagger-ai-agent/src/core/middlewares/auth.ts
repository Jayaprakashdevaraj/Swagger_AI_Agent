import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../errors/UnauthorizedError';

/**
 * Placeholder auth middleware.
 * Phase 1: passes all requests through.
 * Replace with real JWT / API-key validation in a later phase.
 */
export function auth(_req: Request, _res: Response, next: NextFunction): void {
  // TODO: validate Bearer token or API key here in a later phase.
  next();
}

/**
 * Extracts Bearer token from Authorization header.
 * Returns undefined if not present.
 */
export function extractBearerToken(req: Request): string | undefined {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return undefined;
  }
  return authHeader.slice(7);
}

/**
 * Middleware that requires a Bearer token to be present.
 * Use on routes that must be authenticated.
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = extractBearerToken(req);
  if (!token) {
    return next(new UnauthorizedError('Bearer token required'));
  }
  next();
}
