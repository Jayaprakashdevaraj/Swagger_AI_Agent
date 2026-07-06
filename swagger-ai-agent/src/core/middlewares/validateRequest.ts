import { Request, Response, NextFunction } from 'express';
import { ValidationError, ValidationIssue } from '../errors/ValidationError';

/**
 * Factory: returns a middleware that runs the given validator function against req.body.
 * The validator should return an array of issues (empty = valid).
 */
export function validateRequest(
  validator: (body: unknown) => ValidationIssue[]
) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const issues = validator(req.body);
    if (issues.length > 0) {
      return next(new ValidationError('Request validation failed', issues));
    }
    next();
  };
}
