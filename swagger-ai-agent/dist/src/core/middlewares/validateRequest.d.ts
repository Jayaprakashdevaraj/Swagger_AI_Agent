import { Request, Response, NextFunction } from 'express';
import { ValidationIssue } from '../errors/ValidationError';
/**
 * Factory: returns a middleware that runs the given validator function against req.body.
 * The validator should return an array of issues (empty = valid).
 */
export declare function validateRequest(validator: (body: unknown) => ValidationIssue[]): (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=validateRequest.d.ts.map