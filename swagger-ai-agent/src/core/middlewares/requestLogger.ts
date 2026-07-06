import { Request, Response, NextFunction } from 'express';
import { logger } from '../../infrastructure/logging/Logger';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const startAt = process.hrtime.bigint();

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - startAt) / 1_000_000;
    logger.http('Incoming request', {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      durationMs: durationMs.toFixed(2),
      contentLength: res.get('content-length') ?? '-',
    });
  });

  next();
}
