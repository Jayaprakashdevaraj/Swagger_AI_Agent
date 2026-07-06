import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { ValidationError } from '../errors/ValidationError';
import { logger } from '../../infrastructure/logging/Logger';
import { ApiErrorResponse } from '../types';

function isBodyParserSyntaxError(error: unknown): error is Error & { status: number; type: string } {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const candidate = error as { status?: unknown; type?: unknown };
  return candidate.status === 400 && candidate.type === 'entity.parse.failed';
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (isBodyParserSyntaxError(err)) {
    const response: ApiErrorResponse = {
      success: false,
      error: {
        code: 'INVALID_JSON_BODY',
        message: 'Request body contains invalid JSON',
      },
    };
    res.status(400).json(response);
    return;
  }

  if (err instanceof ValidationError) {
    const response: ApiErrorResponse = {
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.issues,
      },
    };
    res.status(err.statusCode).json(response);
    return;
  }

  if (err instanceof AppError) {
    if (!err.isOperational) {
      logger.error('Non-operational error', { stack: err.stack });
    }
    const response: ApiErrorResponse = {
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    };
    res.status(err.statusCode).json(response);
    return;
  }

  // Unknown / unhandled error
  logger.error('Unhandled error', { message: err.message, stack: err.stack });
  const response: ApiErrorResponse = {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    },
  };
  res.status(500).json(response);
}
